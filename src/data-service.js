import { t } from './i18n.js';
import { LSKEY } from './constants.js';
import { safeParseBackup, toast } from './utils.js';
import { db, migrate, seed } from './state.js';

/* =========================================================
   DATA SERVICE LAYER
   ---------------------------------------------------------
   Satu-satunya tempat aplikasi menyentuh penyimpanan.
   Seluruh kode lain cuma tahu tiga hal: load(), save(), DS.
   Menukar localStorage dengan Supabase/Firebase berarti
   menukar satu adapter, tanpa menyentuh view atau state.
   ========================================================= */





/* ---------------------------------------------------------
   Kontrak adapter — semua adapter wajib menyediakan ini.
   read()  -> objek db mentah, atau null kalau kosong
   write(d)-> menyimpan, boleh async, boleh gagal
   ---------------------------------------------------------
   interface Adapter {
     id: string
     label: string
     read(): Promise<object|null> | object|null
     write(dbObject): Promise<void> | void
     signIn?(): Promise<User>
     signOut?(): Promise<void>
     user?(): object|null
   }
   --------------------------------------------------------- */

/* ---------- 1. Adapter lokal (dipakai sekarang) ---------- */
export const LocalAdapter = {
  id: 'local',
  label: 'Lokal (browser ini)',
  labelEn: 'Local (this browser)',
  read(){
    let raw = null;
    try{ raw = localStorage.getItem(LSKEY); }
    catch(e){ console.warn('[DS] localStorage tidak bisa dibaca:', e && e.name); return null; }
    if(!raw) return null;
    const res = safeParseBackup(raw);
    if(!res.ok){
      /* data rusak: jangan dibuang, sisihkan supaya masih bisa diselamatkan manual */
      console.warn('[DS] data tersimpan rusak:', res.error);
      try{ localStorage.setItem(LSKEY + '-rusak-' + Date.now(), raw.slice(0, 500000)); }catch(e){}
      return null;
    }
    return res.data;
  },
  write(d){
    try{
      localStorage.setItem(LSKEY, JSON.stringify(d));
      return true;
    }catch(e){
      /* QuotaExceededError paling sering; beri pesan yang bisa ditindak */
      const penuh = e && (e.name === 'QuotaExceededError' || e.code === 22);
      toast(t(penuh ? 'Memori browsernya penuh, backup dulu yuk 🥲'
                    : 'Gagal menyimpan. Coba backup datamu 🥲'));
      return false;
    }
  },
  user(){ return null; }
};

/* ---------- 2. Adapter cloud (kerangka, belum aktif) ----------
   Cara mengaktifkan dengan Supabase:

   1) Tambahkan di <head> index.html:
      <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"><\/script>

   2) Buat tabel di Supabase (SQL editor):
      create table pastels_state (
        user_id uuid primary key references auth.users on delete cascade,
        payload jsonb not null,
        updated_at timestamptz default now()
      );
      alter table pastels_state enable row level security;
      create policy "pemilik saja" on pastels_state
        for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

   3) Isi SUPABASE_URL & SUPABASE_ANON_KEY di bawah, lalu
      DS.use('cloud').
   -------------------------------------------------------------- */
const SUPABASE_URL = '';
const SUPABASE_ANON_KEY = '';

export const CloudAdapter = {
  id: 'cloud',
  label: 'Akun Google (sinkron)',
  labelEn: 'Google account (synced)',
  _sb: null,
  _user: null,
  ready(){
    return !!(SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase);
  },
  client(){
    if(!this._sb && this.ready())
      this._sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return this._sb;
  },
  async signIn(){
    const sb = this.client();
    if(!sb) throw new Error('cloud-belum-disetel');
    const { error } = await sb.auth.signInWithOAuth({ provider: 'google' });
    if(error) throw error;
  },
  async signOut(){
    const sb = this.client();
    if(sb) await sb.auth.signOut();
    this._user = null;
  },
  user(){ return this._user; },
  async read(){
    const sb = this.client();
    if(!sb) return null;
    const { data: sesi } = await sb.auth.getUser();
    this._user = sesi && sesi.user ? sesi.user : null;
    if(!this._user) return null;
    const { data, error } = await sb.from('pastels_state')
      .select('payload').eq('user_id', this._user.id).maybeSingle();
    if(error){ console.warn('[DS] gagal baca cloud:', error.message); return null; }
    return data ? data.payload : null;
  },
  async write(d){
    const sb = this.client();
    if(!sb || !this._user) return false;
    const { error } = await sb.from('pastels_state')
      .upsert({ user_id: this._user.id, payload: d, updated_at: new Date().toISOString() });
    if(error){ console.warn('[DS] gagal tulis cloud:', error.message); return false; }
    return true;
  }
};

/* ---------- 3. Fasad ---------- */
export const DS = {
  adapter: LocalAdapter,
  /* tulis ke cloud hanya kalau adapter cloud aktif; lokal selalu ditulis
     sebagai cache offline, jadi aplikasi tetap jalan tanpa jaringan */
  mirrorLocal: true,

  use(id){
    this.adapter = (id === 'cloud' && CloudAdapter.ready()) ? CloudAdapter : LocalAdapter;
    return this.adapter.id;
  },
  isCloud(){ return this.adapter.id === 'cloud'; },
  cloudAvailable(){ return CloudAdapter.ready(); },
  user(){ return this.adapter.user ? this.adapter.user() : null; },
  label(en){ return en ? (this.adapter.labelEn || this.adapter.label) : this.adapter.label; }
};

/* ---------- 4. API yang dipakai aplikasi ---------- */
export function load(){
  let raw = null;
  try{ raw = DS.adapter.read(); }
  catch(e){ console.warn('[DS] read gagal:', e); raw = null; }
  /* adapter cloud mengembalikan Promise; boot tetap sinkron pakai cache lokal,
     lalu hydrate() menimpanya begitu data cloud sampai */
  if(raw && typeof raw.then === 'function') raw = LocalAdapter.read();
  return raw ? migrate(raw) : seed();
}

let saveTimer = null;
export function save(){
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const snapshot = db;
    if(DS.mirrorLocal || !DS.isCloud()) LocalAdapter.write(snapshot);
    if(DS.isCloud()){
      Promise.resolve(DS.adapter.write(snapshot)).catch(e => console.warn('[DS] sync:', e));
    }
  }, 200);
}

/* dipanggil setelah login cloud: tarik data server, lalu render ulang */
export async function hydrateFromCloud(onDone){
  if(!DS.isCloud()) return false;
  try{
    const remote = await CloudAdapter.read();
    if(remote){ onDone && onDone(migrate(remote)); return true; }
  }catch(e){ console.warn('[DS] hydrate gagal:', e); }
  return false;
}
