import { LANG, LKEY, applyLang, t, tf } from './i18n.js';
import { $, clamp, ico, iconFallback, mkNow, num, resetRot, rp, rpS, today } from './utils.js';
import { db, ui } from './state.js';
import { save } from './data-service.js';
import { allowance, spentOn, sums, wantsLeft } from './calc.js';
import { CAT_COL, catQuote, catScene, catState } from './mascot.js';
import { renderHeader } from './views/header.js';
import { viewHome } from './views/home.js';
import { viewSave } from './views/goals.js';
import { viewBadge } from './views/badges.js';
import { viewRecap } from './views/recap.js';

/* =========================================================
   14. RENDER
   ========================================================= */
export function render(){
  resetRot();
  document.documentElement.lang = LANG;
  renderHeader();
  $('#view').innerHTML=({home:viewHome,save:viewSave,badge:viewBadge,recap:viewRecap})[ui.tab]();
  const items=[['home','house','🏠','Rumah'],['save','money-bag','💰','Celengan'],['badge','trophy','🏆','Stiker'],['recap','bar-chart','📊','Rekap']];
  $('#nav').innerHTML=items.map(it=>
    '<button data-act="tab" data-tab="'+it[0]+'" class="navbtn"'+(ui.tab===it[0]?' aria-current="page"':'')+'>'+
      '<span class="navbox">'+ico(it[1],ui.tab===it[0]?25:22,it[2])+'</span>'+
      '<span class="navlab">'+t(it[3])+'</span></button>').join('');
  $('#fabIcon').innerHTML=ico('shopping-bags',22,'🛍️');
  $('#fabText').textContent=t('Catat Jajan');
  $('#fabWrap').style.display=(ui.tab==='home'||ui.tab==='recap')?'block':'none';
  iconFallback();
}
export function refresh(){
  const s=sums(mkNow()), jatah=allowance(), spent=spentOn(today());
  const set=(k,v)=>{const el=$('[data-live="'+k+'"]'); if(el) el.textContent=v;};
  set('masuk',rp(s.masuk));
  set('sisa',rpS(wantsLeft()));
  set('left',rp(Math.max(0,jatah-spent)));
  set('spent',tf('Kepake {0}',rpS(spent)));
  const cst=catState(Math.max(0,jatah-spent),jatah);
  set('kata',catQuote(cst));
  const sc=$('[data-live="scene"]');
  if(sc && sc.dataset.cur!==cst){ sc.dataset.cur=cst; sc.innerHTML=catScene(cst); }
  const bar=$('[data-live="bar"]');
  if(bar){ bar.style.width=(jatah>0?clamp(spent/jatah*100,0,100):(spent>0?100:0))+'%'; bar.style.backgroundColor=CAT_COL[cst]; }
  db.goals.forEach(g=>{
    const p=num(g.target)>0?clamp(num(g.saved)/num(g.target)*100,0,100):0;
    set('gs:'+g.id,rpS(g.saved));
    set('gp:'+g.id,Math.round(p)+'%');
    const b=$('[data-live="gb:'+g.id+'"]'); if(b) b.style.width=p+'%';
  });
}
export function setLang(l){
  if(l===LANG) return;
  applyLang(l);
  try{ localStorage.setItem(LKEY,l); }catch(e){}
  document.body.classList.add('langswap');
  setTimeout(()=>{ render(); document.body.classList.remove('langswap'); },170);
}
