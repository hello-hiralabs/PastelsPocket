import { BADGES, WASHI } from './constants.js';
import { dayDiff, num, today } from './utils.js';
import { db } from './state.js';
import { maxGoalPct, totalSaved, txCountAll } from './calc.js';
import { celebrateBadge, celebrateWashi } from './sheet.js';

/* =========================================================
   6. STREAK · STIKER · REWARD WASHI
   ========================================================= */
export function touchStreak(){
  const d=today(), st=db.streak;
  if(st.last===d) return false;
  if(st.last&&dayDiff(st.last,d)===1) st.count=num(st.count)+1; else st.count=1;
  st.last=d; st.best=Math.max(num(st.best),st.count);
  return true;
}
export function ctx(){
  return { txCount:txCountAll(), best:num(db.streak.best), streak:num(db.streak.count),
    goals:db.goals.length, maxPct:maxGoalPct(), saved:totalSaved(),
    iritDay:!!db.stats.iritDay, pagi:!!db.stats.pagi };
}
export function checkBadges(c){
  c=c||ctx(); const fresh=[];
  BADGES.forEach(b=>{ if(!db.badges[b.id]&&b.t(c)){ db.badges[b.id]=today(); fresh.push(b); } });
  return fresh;
}
export function washiMet(w,c){
  const nd=w.need; if(!nd) return true;
  if(nd.k==='streak')  return c.best>=nd.v;
  if(nd.k==='log')     return c.txCount>=nd.v;
  if(nd.k==='goal50')  return c.maxPct>=50;
  if(nd.k==='goal100') return c.maxPct>=100;
  if(nd.k==='saved')   return c.saved>=nd.v;
  return false;
}
export function checkWashi(c){
  c=c||ctx(); const fresh=[];
  WASHI.forEach(w=>{
    if(db.washi.owned.indexOf(w.id)<0 && washiMet(w,c)){ db.washi.owned.push(w.id); fresh.push(w); }
  });
  return fresh;
}
/* satu antrean untuk semua hadiah */
export let queue=[];
export function collectRewards(){
  const c=ctx();
  queue = queue.concat(checkBadges(c).map(b=>({type:'badge',data:b})))
               .concat(checkWashi(c).map(w=>({type:'washi',data:w})));
}
export function flushQueue(){
  if(!queue.length) return false;
  const it=queue.shift();
  if(it.type==='badge') celebrateBadge(it.data); else celebrateWashi(it.data);
  return true;
}

/* kosongkan antrean di tempat, jangan ditugaskan ulang dari luar modul */
export function clearQueue(){ queue.length = 0; }
