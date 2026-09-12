import { tf } from './i18n.js';
import { cName, catOf } from './constants.js';
import { clamp, dayDiff, daysIn, esc, mkNow, num, pad2, rpS, stk, today } from './utils.js';
import { MO, db } from './state.js';
import { sums } from './calc.js';
import { filterActive, txMatch } from './filter.js';

/* =========================================================
   9b. RIWAYAT BERTINGKAT & CERITA BULANAN
   ========================================================= */
/* jendela riwayat: 0 = 3 hari terakhir, 1 = seminggu, 2 = sebulan penuh */
export const HIST_WIN=[3,7,9999];
export function histAnchor(hmk){ return hmk===mkNow() ? today() : hmk+'-'+pad2(daysIn(hmk)); }
export function histDates(hmk,lvl){
  const M=MO(hmk), by={};
  /* filter dipasang di sumber, jadi seluruh turunannya ikut konsisten:
     daftar hari, total struk, dan tombol "lihat lebih" */
  M.tx.forEach(x=>{ if(txMatch(x)) (by[x.date]=by[x.date]||[]).push(x); });
  const all=Object.keys(by).sort().reverse();
  const hits=all.reduce((a,ds)=>a+by[ds].length,0);
  /* saat filter aktif, jendela 3/7 hari diabaikan — kalau tidak,
     hasil pencarian bisa "hilang" hanya karena tanggalnya lama */
  if(filterActive()) return { by, all, shown:all, hits, filtered:true };
  const win=HIST_WIN[clamp(lvl,0,2)], anchor=histAnchor(hmk);
  let shown=all.filter(ds=>dayDiff(ds,anchor)<win);
  if(!shown.length && all.length) shown=all.slice(0, win===9999?all.length:Math.min(win,all.length));
  return { by, all, shown, hits, filtered:false };
}
export function prevMonthWithData(hmk){
  let y=num(hmk.slice(0,4)), m=num(hmk.slice(5,7));
  for(let i=0;i<24;i++){
    m--; if(m<1){ m=12; y--; }
    const k=y+'-'+pad2(m);
    if(db.months[k] && db.months[k].tx && db.months[k].tx.length) return k;
  }
  return null;
}
export function storyItems(mk){
  const s=sums(mk), M=MO(mk);
  const per={}; M.tx.forEach(x=>{ if(x.cat==='celengan') return; per[x.cat]=(per[x.cat]||0)+num(x.amount); });
  const rows=Object.keys(per).map(k=>({k,v:per[k]})).sort((a,b)=>b.v-a.v);
  const dayTot={}; M.tx.forEach(x=>{ if(x.cat==='celengan') return; const d=num(x.date.slice(8,10)); dayTot[d]=(dayTot[d]||0)+num(x.amount); });
  const hariAda=Object.keys(dayTot).length, rata=hariAda?s.jajan/hariAda:0;
  const top=rows[0]?catOf(rows[0].k):null;
  const out=[];
  out.push({ i:s.sisa>=0?'glowing-star':'pensive-face', f:s.sisa>=0?'🌟':'🥲',
    h: s.sisa>=0 ? tf('Sisa dompet {0}, boleh banget dipindah ke celengan 💖',rpS(s.sisa))
                 : tf('Pengeluaran lebih gede {0} dari cuan masuk. Bulan depan kita fix ya 🥲',rpS(-s.sisa)) });
  if(top) out.push({ i:top.i, f:top.f, h:tf('Paling banyak kabur ke <b>{0}</b>, totalnya {1}.',esc(cName(top)),rpS(rows[0].v)) });
  out.push({ i:'spiral-calendar', f:'📅', h:tf('Kamu jajan di <b>{0} hari</b>, rata-rata {1} sekali jajan.',hariAda,rpS(rata)) });
  out.push({ i:'money-bag', f:'💰', h:tf('Yang masuk celengan {0} bulan ini.',rpS(s.nabung)) });
  return out;
}
export function storyList(items){
  return '<ul>'+items.map(it=>'<li class="flex items-start gap-2.5 py-1.5">'+
    stk(it.i,{size:32,ic:19,tone:'#FBF0F4',fb:it.f})+
    '<span class="text-[13px] leading-relaxed pt-1">'+it.h+'</span></li>').join('')+'</ul>';
}
