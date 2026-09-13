import { CAT_ENV, ENVS } from './constants.js';
import { daysIn, mkNow, mkOf, num, round100, today } from './utils.js';
import { MO, db } from './state.js';

/* =========================================================
   5. HITUNGAN
   ========================================================= */
export function sums(mk){
  const M=MO(mk);
  const masuk=M.income.reduce((a,b)=>a+num(b.amount),0);
  let jajan=0,nabung=0;
  M.tx.forEach(x=>{ if(x.cat==='celengan') nabung+=num(x.amount); else jajan+=num(x.amount); });
  return { masuk, jajan, nabung, sisa:masuk-jajan-nabung };
}
/* Kategori mana masuk amplop mana. Pengguna boleh mengubahnya,
   jadi bacaan utamanya db.catEnv; CAT_ENV hanya nilai bawaan. */
export function envOfCat(k){
  if(k==='celengan') return 'save';
  const m=db.catEnv||{};
  return (m[k]==='bills'||m[k]==='wants'||m[k]==='save') ? m[k] : (CAT_ENV[k]||'wants');
}

/* jatah jajan harian hanya dihitung dari kategori beramplop 'wants' */
export function spentOn(ds){ return MO(mkOf(ds)).tx.reduce((a,x)=>a+((x.date===ds&&envOfCat(x.cat)==='wants')?num(x.amount):0),0); }
export function envSpent(mk,k){ return MO(mk).tx.reduce((a,x)=>a+(envOfCat(x.cat)===k?num(x.amount):0),0); }
export function envNom(k,masuk){
  const e=db.env[k]||{}; 
  if(e.nom!=null) return num(e.nom);
  if(masuk==null) masuk=sums(mkNow()).masuk;
  return round100(num(masuk)*num(e.pct)/100);
}
export function envPctSum(){ return ENVS.reduce((a,e)=>a+num(db.env[e.k].pct),0); }
export function wantsLeft(mk){ mk=mk||mkNow(); return envNom('wants',sums(mk).masuk)-envSpent(mk,'wants'); }
export function daysLeft(){ const mk=mkNow(); return Math.max(1, daysIn(mk)-new Date().getDate()+1); }
export function hasOverride(){ const v=db.dayLimit[today()]; return v!=null&&num(v)>0; }
export function autoAllowance(){
  const mk=mkNow();
  return Math.max(0, round100((wantsLeft(mk)+spentOn(today()))/daysLeft()));
}
export function allowance(){ return hasOverride() ? num(db.dayLimit[today()]) : autoAllowance(); }
export function totalSaved(){ return db.goals.reduce((a,g)=>a+num(g.saved),0); }
export function txCountAll(){ let c=0; Object.values(db.months).forEach(M=>M.tx.forEach(x=>{ if(x.cat!=='celengan') c++; })); return c; }
export function maxGoalPct(){ const p=db.goals.map(g=>num(g.target)>0?num(g.saved)/num(g.target)*100:0); return p.length?Math.max.apply(null,p):0; }

/* =========================================================
   NOMINAL YANG SERING DIPAKAI
   Diambil dari riwayat pengguna sendiri, bukan angka tebakan.
   Dipakai jadi chip satu-ketuk di lembar Catat Jajan.
   ========================================================= */
export function topAmounts(cat, n){
  const hitung = {};
  Object.keys(db.months).forEach(mk => {
    (db.months[mk].tx || []).forEach(x => {
      if(x.cat === 'celengan') return;
      if(cat && x.cat !== cat) return;
      const a = num(x.amount);
      if(a <= 0) return;
      /* dibulatkan ke ribuan supaya 22.000 dan 22.500 dianggap satu kebiasaan */
      const k = Math.round(a / 1000) * 1000;
      hitung[k] = (hitung[k] || 0) + 1;
    });
  });
  return Object.keys(hitung)
    .map(k => ({ amount: num(k), n: hitung[k] }))
    .filter(o => o.n >= 2)                 /* sekali pakai belum jadi kebiasaan */
    .sort((a, b) => b.n - a.n || b.amount - a.amount)
    .slice(0, n || 3);
}
