import { CATS } from './constants.js';
import { clamp, mkNow, num, pad2, sanitizeAmount, uid } from './utils.js';
import { MO, db } from './state.js';

/* =========================================================
   TRANSAKSI BERULANG
   ---------------------------------------------------------
   Satu entri = satu tagihan bulanan. Tiap bulan, saat aplikasi
   dibuka dan tanggalnya sudah lewat, entri dicatat sekali ke
   bulan itu. Penanda `lastRun` mencegah dobel, dan `rec`
   menandai transaksi supaya bisa dibedakan dari catatan manual.
   ========================================================= */



export function recList(){
  if(!Array.isArray(db.recurring)) db.recurring = [];
  return db.recurring;
}

export function recAdd(){
  const r = { id: uid(), label: '', amount: 0, cat: 'kos', day: 1, active: true, lastRun: '' };
  recList().push(r);
  return r;
}
export function recDel(id){ db.recurring = recList().filter(r => r.id !== id); }
export function recFind(id){ return recList().filter(r => r.id === id)[0]; }

export function recNormalize(r){
  r.amount = sanitizeAmount(r.amount);
  r.day = clamp(num(r.day) || 1, 1, 28);      /* 28 supaya aman di Februari */
  if(!CATS.some(c => c.k === r.cat)) r.cat = 'kos';
  r.active = !!r.active;
  return r;
}

/* apakah entri sudah waktunya dicatat untuk bulan berjalan */
export function recDue(r, mk, hariIni){
  if(!r.active) return false;
  if(sanitizeAmount(r.amount) <= 0) return false;
  if(r.lastRun === mk) return false;
  return clamp(num(r.day) || 1, 1, 28) <= hariIni;
}

/* dijalankan sekali saat boot dan setiap ganti bulan.
   Mengembalikan jumlah entri yang baru dicatat. */
export function applyRecurring(){
  const mk = mkNow(), hariIni = new Date().getDate();
  const M = MO(mk);
  let n = 0, total = 0;
  recList().forEach(r => {
    recNormalize(r);
    if(!recDue(r, mk, hariIni)) return;
    /* jaring pengaman: kalau transaksi dengan penanda sama sudah ada, lewati */
    if(M.tx.some(x => x.rec === r.id && String(x.date).slice(0, 7) === mk)){ r.lastRun = mk; return; }
    M.tx.push({
      id: uid(), date: mk + '-' + pad2(clamp(num(r.day) || 1, 1, 28)),
      cat: r.cat, amount: sanitizeAmount(r.amount),
      note: r.label || '', h: 9, rec: r.id
    });
    r.lastRun = mk; n++; total += sanitizeAmount(r.amount);
  });
  return { count: n, total: total };
}

/* total komitmen bulanan, dipakai di ringkasan amplop */
export function recMonthlyTotal(){
  return recList().reduce((a, r) => a + (r.active ? sanitizeAmount(r.amount) : 0), 0);
}
