import { LANG, t, tf } from './i18n.js';
import { AVATARS, BADGES, CATS, GOAL_KINDS, bDesc, bName, cName, clayVars, kName, kindOf } from './constants.js';
import { esc, fmt, mkLabel, mkNow, num, prettyDate, rp, rpS, stk, today } from './utils.js';
import { db, tapeStyle, ui } from './state.js';
import { DS } from './data-service.js';
import { autoAllowance, hasOverride, sums } from './calc.js';
import { recList, recMonthlyTotal } from './recurring.js';
import { sheet } from './sheet.js';
import { CAT_KINDS, ROOMS, catAvatar, ckName, roomName } from './mascot.js';
import { cardHead } from './views/header.js';

/* =========================================================
   15. SHEET
   ========================================================= */
export function quickSheet(){
  const grid=CATS.map(c=>
    '<button data-act="pick-cat" data-k="'+c.k+'" class="catbtn" aria-pressed="'+(ui.quick.cat===c.k)+'">'+
      stk(c.i,{size:38,ic:23,tone:c.c,fb:c.f})+
      '<span class="hand text-[10px] font-bold leading-tight text-center">'+esc(cName(c))+'</span></button>').join('');
  sheet(
    '<h2 class="hand font-bold text-[21px] mb-1">'+t('Catat Jajan 🛍️')+'</h2>'+
    '<p class="text-[12.5px] text-soft mb-4">'+t('Berapa dan buat apa? Cuma dua ketukan kok.')+'</p>'+
    '<div class="paper tape p-4 pt-5 mb-4" style="'+tapeStyle('main','22px',70,-6)+';background:linear-gradient(150deg,#FFF1F5,#FFFAEA)">'+
      '<div class="amtbox flex items-center gap-2">'+
        '<span class="hand font-bold text-[21px] shrink-0 text-[#C9758A]">Rp</span>'+
        '<input id="qa" type="text" inputmode="numeric" data-money="1" value="'+(ui.quick.amount?fmt(ui.quick.amount):'')+'" placeholder="0" class="bigamt bg-transparent border-0 p-0 font-extrabold text-[32px] money">'+
      '</div>'+
      '<div class="flex gap-1.5 mt-3">'+
        [5000,10000,20000,50000].map(v=>'<button data-act="qplus" data-v="'+v+'" class="chip hand flex-1 !px-1 text-center">+'+(v/1000)+'rb</button>').join('')+
      '</div>'+
    '</div>'+
    '<div class="grid grid-cols-4 gap-2 mb-4">'+grid+'</div>'+
    '<div class="grid grid-cols-2 gap-2 mb-4">'+
      '<label class="block"><span class="hand block text-[11px] text-soft mb-1">'+t('Kapan?')+'</span>'+
        '<input id="qd" type="date" value="'+today()+'" class="field !py-2 text-[13px]"></label>'+
      '<label class="block"><span class="hand block text-[11px] text-soft mb-1">'+t('Catatannya')+'</span>'+
        '<input id="qn" type="text" placeholder="'+t('boba sama bestie...')+'" class="field !py-2 text-[13px]"></label>'+
    '</div>'+
    '<div class="flex gap-2 pb-1">'+
      '<button data-act="close" class="flex-1 py-3.5 rounded-2xl bg-white hand font-bold text-[15px]" style="border:2.5px solid #F3E7EA;box-shadow:0 3px 0 #FBF0F4">'+t('Nanti aja')+'</button>'+
      '<button data-act="save-tx" class="clay flex-[1.6] py-3.5 hand font-bold text-[16px]">'+t('Simpan 💕')+'</button>'+
    '</div>',
    { focus:'#qa' });
}
export function fillGoalSheet(id){
  const g=db.goals.find(x=>x.id===id); if(!g) return;
  const s=sums(mkNow()), kurang=Math.max(0,num(g.target)-num(g.saved));
  const gk=kindOf(g.e), gf=gk.f;
  sheet(
    '<div class="text-center mb-4">'+
      '<div class="inline-block mb-2">'+stk(g.e,{size:76,ic:46,tone:gk.tone,rot:-4,fb:gf})+'</div>'+
      '<h2 class="hand font-bold text-[20px]">'+esc(tf('Isi Celengan {0}',g.name||t('Impian')))+'</h2>'+
      '<p class="text-[12.5px] text-soft mt-1">'+esc(tf('Kurang {0} lagi · sisa dompet {1}',rpS(kurang),rpS(s.sisa)))+'</p></div>'+
    '<div class="paper tape p-4 pt-5 mb-4" style="'+tapeStyle('goal','22px',70,5)+';background:'+gk.soft+';border-color:'+gk.tone+'">'+
      '<div class="amtbox flex items-center gap-2">'+
        '<span class="hand font-bold text-[21px] shrink-0" style="color:'+gk.dark+'">Rp</span>'+
        '<input id="ga" type="text" inputmode="numeric" data-money="1" placeholder="0" class="bigamt bg-transparent border-0 p-0 font-extrabold text-[32px] money">'+
      '</div>'+
      '<div class="flex gap-1.5 mt-3">'+
        [10000,25000,50000,100000].map(v=>'<button data-act="gplus" data-v="'+v+'" class="chip hand flex-1 !px-1 text-center">+'+(v/1000)+'rb</button>').join('')+
      '</div>'+
    '</div>'+
    '<div class="flex gap-2 pb-1">'+
      '<button data-act="close" class="flex-1 py-3.5 rounded-2xl bg-white hand font-bold text-[15px]" style="border:2.5px solid #F3E7EA;box-shadow:0 3px 0 #FBF0F4">'+t('Nanti aja')+'</button>'+
      '<button data-act="save-fill" data-id="'+id+'" class="clay flex-[1.6] py-3.5 hand font-bold text-[16px]" style="'+clayVars(gk)+'">'+t('Masukin! 💰')+'</button>'+
    '</div>',
    { focus:'#ga' });
}
export function catPickerSheet(){
  sheet(
    '<h2 class="hand font-bold text-[21px] mb-1">' + t('Pilih Kucingmu 🐾') + '</h2>' +
    '<p class="text-[12.5px] text-soft mb-4">' + t('Tiap kucing bawa kamarnya sendiri. Gonta-ganti bebas kok.') + '</p>' +
    '<div class="grid grid-cols-2 gap-2.5 pb-2">' +
      CAT_KINDS.map(function(c){
        var on = db.profile.cat === c.id, R = ROOMS[c.room];
        return '<button data-act="set-kitty" data-id="' + c.id + '" aria-pressed="' + on + '" ' +
          'class="text-left p-2.5 rounded-[20px] active:scale-95 transition" ' +
          'style="background:' + (on ? '#FFF4F7' : '#FFFDFB') + ';border:2.5px solid ' + (on ? c.tone : '#F3E7EA') +
          ';box-shadow:0 3px 0 ' + (on ? c.tone : '#FBF0F4') + '">' +
          '<div class="rounded-[14px] overflow-hidden mb-2" style="border:2px solid #EFDDE4">' + catAvatar(c.id) + '</div>' +
          '<p class="hand font-bold text-[14.5px] leading-tight">' + esc(c.n) + '</p>' +
          '<p class="text-[10.5px] text-soft leading-tight">' + esc(ckName(c)) + '</p>' +
          '<p class="text-[10px] mt-1 font-bold" style="color:' + R.line + '">' + esc(roomName(R)) + '</p>' +
        '</button>';
      }).join('') +
    '</div>');
}

export function recurringSheet(){
  const list=recList();
  const rows = list.length ? list.map(function(r){
    const c=CATS.filter(x=>x.k===r.cat)[0]||CATS[0];
    const opts=CATS.map(x=>'<option value="'+x.k+'"'+(x.k===r.cat?' selected':'')+'>'+esc(cName(x))+'</option>').join('');
    return '<div class="rounded-[20px] p-3 mb-2.5" style="background:'+(r.active?'#FFFDFB':'#FAF6F2')+
        ';border:2.5px solid '+(r.active?c.c:'#F3E7EA')+';box-shadow:0 3px 0 '+(r.active?c.c:'#FBF0F4')+'">'+
      '<div class="flex items-center gap-2.5 mb-2">'+
        stk(c.i,{size:36,ic:21,tone:c.c,fb:c.f})+
        '<input type="text" data-field="rec:'+r.id+':label" value="'+esc(r.label)+'" placeholder="'+esc(t('Nama tagihan'))+'" class="flatfield hand text-[14px] font-bold flex-1 min-w-0">'+
        '<button data-act="rec-toggle" data-id="'+r.id+'" class="shrink-0 hand text-[10.5px] font-bold px-2.5 py-1 rounded-full" '+
          'style="background:'+(r.active?'#E2F0D9':'#F3E7EA')+';border:2px solid '+(r.active?'#A3C79B':'#EDDCE3')+';color:'+(r.active?'#5F7A5A':'#8C7F7E')+'">'+
          t(r.active?'Aktif':'Dijeda')+'</button>'+
        '<button data-act="rec-del" data-id="'+r.id+'" aria-label="Hapus" class="shrink-0 w-6 h-6 grid place-items-center text-[#CBBCC0] font-bold text-[15px]">×</button>'+
      '</div>'+
      '<div class="grid grid-cols-[1fr_84px_62px] gap-2">'+
        '<label class="block"><span class="hand block text-[10px] text-soft mb-1">'+t('Kategori')+'</span>'+
          '<select data-field="rec:'+r.id+':cat" class="field !py-1.5 !px-2 text-[12.5px]">'+opts+'</select></label>'+
        '<label class="block"><span class="hand block text-[10px] text-soft mb-1">'+t('Nominal')+'</span>'+
          '<input type="text" inputmode="numeric" data-money="1" data-field="rec:'+r.id+':amount" value="'+fmt(r.amount)+'" class="field !py-1.5 !px-2 text-right money font-extrabold text-[12.5px]"></label>'+
        '<label class="block"><span class="hand block text-[10px] text-soft mb-1">'+t('Tgl')+'</span>'+
          '<input type="text" inputmode="numeric" data-field="rec:'+r.id+':day" value="'+num(r.day)+'" class="field !py-1.5 !px-2 text-center font-extrabold text-[12.5px]"></label>'+
      '</div></div>';
  }).join('') : '<p class="hand text-[13px] text-soft text-center py-4">'+t('Belum ada tagihan berulang 🌱')+'</p>';

  sheet(
    '<h2 class="hand font-bold text-[21px] mb-1">'+t('Tagihan Berulang 🔁')+'</h2>'+
    '<p class="text-[12.5px] text-soft mb-3">'+t('Dicatat otomatis tiap bulan begitu tanggalnya lewat.')+'</p>'+
    '<p class="hand text-[12px] font-bold mb-3" style="color:#A88B49">'+esc(tf('Komitmen bulanan {0}',rp(recMonthlyTotal())))+'</p>'+
    rows+
    '<button data-act="rec-add" class="w-full py-3 rounded-2xl dashed hand font-bold text-[13.5px] text-soft mb-2 active:scale-[.98] transition">'+t('+ Tambah Tagihan')+'</button>'+
    '<button data-act="close" class="clay w-full py-3.5 hand font-bold text-[15px] mb-1">'+t('Selesai')+'</button>');
}

export function limitSheet(){
  const auto=autoAllowance(), cur=hasOverride()?num(db.dayLimit[today()]):'';
  sheet(
    '<h2 class="hand font-bold text-[20px] mb-1">'+t('Atur Limit Jajan Hari Ini ✏️')+'</h2>'+
    '<p class="text-[12.5px] text-soft mb-4">'+t('Ada acara khusus? Timpa limit otomatis buat hari ini aja.')+'</p>'+
    '<div class="paper tape p-4 pt-5 mb-3" style="'+tapeStyle('main','22px',70,-6)+';background:#FFFAEA;border-color:#F7E7B8">'+
      '<div class="amtbox flex items-center gap-2">'+
        '<span class="hand font-bold text-[21px] shrink-0 text-[#8A7565]">Rp</span>'+
        '<input id="la" type="text" inputmode="numeric" data-money="1" value="'+(cur===''?'':fmt(cur))+'" placeholder="'+fmt(auto)+'" class="bigamt bg-transparent border-0 p-0 font-extrabold text-[32px] money">'+
      '</div>'+
      '<p class="hand text-[11.5px] text-soft mt-2">'+esc(tf('Hitungan otomatisnya {0}',rp(auto)))+'</p>'+
    '</div>'+
    '<div class="flex gap-2 pb-1">'+
      '<button data-act="limit-auto" class="flex-1 py-3.5 rounded-2xl bg-white hand font-bold text-[14px]" style="border:2.5px solid #F3E7EA;box-shadow:0 3px 0 #FBF0F4">'+t('Pakai Otomatis')+'</button>'+
      '<button data-act="limit-save" class="clay clay-gold flex-[1.4] py-3.5 hand font-bold text-[15px]">'+t('Simpan Limit')+'</button>'+
    '</div>',
    { focus:'#la' });
}

export function emojiSheet(id){
  const cur=db.goals.find(x=>x.id===id);
  sheet('<h2 class="hand font-bold text-[19px] mb-1">'+t('Pilih Jenis Celengan')+'</h2>'+
    '<p class="text-[12.5px] text-soft mb-4">'+t('Warnanya ikut jenis yang kamu pilih 🎨')+'</p>'+
    '<div class="grid grid-cols-3 gap-2.5 pb-2">'+
      GOAL_KINDS.map(k=>{
        const on=cur&&cur.e===k.i;
        return '<button data-act="set-emoji" data-id="'+id+'" data-e="'+k.i+'" class="stk-press flex flex-col items-center gap-1.5 p-2.5 rounded-[20px]" '+
          'style="background:'+(on?k.soft:'#fff')+';border:2.5px solid '+(on?k.solid:'#F3E7EA')+';box-shadow:0 3px 0 '+(on?k.tone:'#FBF0F4')+'">'+
          stk(k.i,{size:44,ic:27,tone:k.tone,fb:k.f})+
          '<span class="hand text-[10.5px] font-bold leading-tight text-center" style="color:'+(on?k.dark:'#8C7F7E')+'">'+esc(kName(k))+'</span>'+
        '</button>';
      }).join('')+
    '</div>');
}
export function settingsSheet(){
  let size=0; try{ size=new Blob([JSON.stringify(db)]).size; }catch(e){ size=JSON.stringify(db).length; }
  sheet(
    '<h2 class="hand font-bold text-[21px] mb-4">'+t('Pengaturan ⚙️')+'</h2>'+
    '<p class="hand text-[12px] text-soft mb-2">'+t('Bahasa aplikasi')+'</p>'+
    '<div class="flex gap-2 mb-4">'+
      '<button data-act="lang" data-l="id" class="flex-1 py-3 rounded-2xl hand font-bold text-[14px]" style="background:'+(LANG==='id'?'#FFEAF0':'#fff')+';border:2.5px solid '+(LANG==='id'?'#FFC0D3':'#F3E7EA')+';box-shadow:0 3px 0 '+(LANG==='id'?'#FFD2E0':'#FBF0F4')+'">🇮🇩 Bahasa Indonesia</button>'+
      '<button data-act="lang" data-l="en" class="flex-1 py-3 rounded-2xl hand font-bold text-[14px]" style="background:'+(LANG==='en'?'#FFEAF0':'#fff')+';border:2.5px solid '+(LANG==='en'?'#FFC0D3':'#F3E7EA')+';box-shadow:0 3px 0 '+(LANG==='en'?'#FFD2E0':'#FBF0F4')+'">🇬🇧 English</button>'+
    '</div>'+
    '<label class="block mb-4"><span class="hand block text-[12px] text-soft mb-1.5">'+t('Panggil kamu siapa nih?')+'</span>'+
      '<input type="text" data-field="name" value="'+esc(db.profile.name)+'" placeholder="'+t('Contoh: Kirana')+'" class="field hand text-[15px]"></label>'+
    '<p class="hand text-[12px] text-soft mb-2">'+t('Pilih temen ngobrol kamu')+'</p>'+
    '<div class="grid grid-cols-6 gap-2 mb-4">'+
      AVATARS.map(a=>'<button data-act="set-ava" data-e="'+a[0]+'" class="stk-press aspect-square grid place-items-center rounded-[16px]" style="background:'+(db.profile.ava===a[0]?'#FFEAF0':'#fff')+';border:2px solid '+(db.profile.ava===a[0]?'#FFC0D3':'#F3E7EA')+'">'+
        stk(a[0],{size:34,ic:22,tone:'#FFE3EE',round:true,fb:a[1]})+'</button>').join('')+
    '</div>'+
    '<button data-act="kitty" class="w-full py-3 rounded-2xl hand font-bold text-[14px] mb-3" style="background:#FFF4F7;border:2.5px solid #FFD2E0;box-shadow:0 3px 0 #FFD2E0">'+t('Ganti Kucing 🐾')+'</button>'+
    '<button data-act="rec-open" class="w-full py-3 rounded-2xl hand font-bold text-[14px] mb-3" style="background:#E9F4E2;border:2.5px solid #A3C79B;box-shadow:0 3px 0 #C0DCB4">'+t('Atur Tagihan Berulang 🔁')+'</button>'+
    '<button data-act="open-wardrobe" class="w-full py-3 rounded-2xl hand font-bold text-[14px] mb-4" style="background:#FFFAEA;border:2.5px solid #F7E7B8;box-shadow:0 3px 0 #F7E7B8">'+t('Buka Lemari Washi Tape 🎀')+'</button>'+
    '<div class="paper p-4 mb-3" style="background:#F1F8EC;border-color:#D3E7C6">'+
      cardHead(t('Backup Data 💾'),'floppy-disk','#D3E7C6','💾')+
      '<p class="text-[12px] text-[#6E9668] leading-relaxed mb-3">'+esc(tf('Semua catatan cuma nyimpen di browser ini ({0} KB). Backup dulu sebelum ganti HP ya!',(size/1024).toFixed(1)))+'</p>'+
      '<div class="grid grid-cols-2 gap-2 mb-2">'+
        '<button data-act="export" class="py-2.5 rounded-2xl bg-white hand font-bold text-[13px]" style="border:2px solid #D3E7C6">'+t('Unduh Backup')+'</button>'+
        '<button data-act="import" class="py-2.5 rounded-2xl bg-white hand font-bold text-[13px]" style="border:2px solid #D3E7C6">'+t('Restore Data')+'</button>'+
      '</div>'+
      '<button data-act="export-csv" class="w-full py-2.5 rounded-2xl bg-white hand font-bold text-[13px]" style="border:2px solid #D3E7C6">'+t('Ekspor CSV')+' · '+esc(mkLabel(mkNow()))+'</button>'+
      '</div>'+
    /* --- akun & sinkron: kerangka Data Service Layer --- */
    '<div class="paper p-4 mb-4" style="background:#F4F1FA;border-color:#DDD8EA">'+
      cardHead(t('Akun & Sinkron ☁️'),'bank','#DDD8EA','🏦')+
      '<p class="text-[12px] leading-relaxed mb-3" style="color:#6E6884">'+
        esc(tf('Mode sekarang: {0}',DS.label(LANG==='en')))+
        (DS.cloudAvailable()?'':'<br>'+esc(t('Sinkron cloud belum disetel. Isi kunci Supabase di src/data-service.js dulu.')))+'</p>'+
      (DS.cloudAvailable()
        ? (DS.isCloud()
            ? '<button data-act="cloud-out" class="w-full py-2.5 rounded-2xl bg-white hand font-bold text-[13px]" style="border:2px solid #DDD8EA">'+t('Keluar dari Akun')+'</button>'
            : '<button data-act="cloud-in" class="w-full py-2.5 rounded-2xl bg-white hand font-bold text-[13px]" style="border:2px solid #DDD8EA">'+t('Hubungkan Akun Google')+'</button>')
        : '<button disabled class="w-full py-2.5 rounded-2xl hand font-bold text-[13px] opacity-50" style="background:#EFEAF6;border:2px solid #DDD8EA">'+t('Hubungkan Akun Google')+'</button>')+
    '</div>'+
    '<div class="paper p-4 mb-4" style="background:#FFFAEA;border-color:#F7E7B8">'+
      cardHead(t('Pasang di Home Screen 📱'),'mobile-phone','#F7E7B8','📱')+
      '<p class="text-[12px] text-[#8A7565] leading-relaxed">'+t('Buka di Safari → ketuk ikon Share → pilih “Add to Home Screen”. Jadi kayak app beneran!')+'</p></div>'+
    '<button data-act="reset-ask" class="w-full py-3 rounded-2xl hand font-bold text-[14px] mb-3" style="background:#FFE3EA;border:2px solid #FFD2E0">'+t('Reset semua data')+'</button>'+
    '<p class="hand text-center text-[12px] font-bold text-soft pb-0.5">'+t('Pastels : Your Pocket Bestie 🎀')+'</p>'+
    '<p class="hand text-center text-[11px] text-soft pb-1">'+t('dibuat manis buat kamu')+'</p>');
}
export function badgeSheet(id){
  const b=BADGES.find(x=>x.id===id); if(!b) return;
  const on=db.badges[id];
  sheet('<div class="text-center pb-2">'+
    '<div class="inline-block mb-3 '+(on?'':'locked')+'">'+stk(b.i,{size:104,ic:60,tone:on?'#F5D96B':'#EFE0E6',rot:-4,fb:b.f})+'</div>'+
    '<h2 class="hand font-bold text-[21px] mb-1">'+esc(on?bName(b):t('Masih dikunci nih'))+'</h2>'+
    '<p class="text-[13.5px] text-soft mb-1">'+esc(bDesc(b))+'</p>'+
    (on?'<p class="hand text-[12px] text-berry font-bold mb-5">'+esc(tf('Kebuka {0}',prettyDate(on)))+'</p>'
       :'<p class="hand text-[12px] text-soft mb-5">'+t('Terus nyatet, nanti kebuka sendiri ✨')+'</p>')+
    '<button data-act="close" class="w-full py-3.5 rounded-2xl hand font-bold text-[15px]" style="background:#FFEAF0;border:2.5px solid #FFD9E4;box-shadow:0 3px 0 #FFD9E4">'+t('Tutup')+'</button>'+
  '</div>');
}
