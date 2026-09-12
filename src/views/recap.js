import { HARI_S, t } from '../i18n.js';
import { cName, catOf } from '../constants.js';
import { daysIn, esc, mkLabel, mkNow, num, rp, rpS, stk } from '../utils.js';
import { MO, tapeStyle, ui } from '../state.js';
import { sums } from '../calc.js';
import { storyItems, storyList } from '../history.js';
import { cardHead } from './header.js';

/* =========================================================
   13. TAB REKAP
   ========================================================= */
export function viewRecap(){
  const mk=ui.mk, s=sums(mk), M=MO(mk);
  let html='';

  html+=
  '<div class="flex items-center gap-2 mb-5">'+
    '<button data-act="step" data-d="-1" aria-label="Prev" class="w-11 h-11 rounded-2xl grid place-items-center bg-white hand font-bold text-[18px] active:scale-90 transition" style="border:2.5px solid #F3E7EA;box-shadow:0 3px 0 #FBF0F4">‹</button>'+
    '<div class="flex-1 text-center py-2 rounded-2xl bg-white" style="border:2.5px solid #F3E7EA;box-shadow:0 3px 0 #FBF0F4;transform:rotate(-.6deg)">'+
      '<p class="hand font-bold text-[16px]">'+mkLabel(mk)+'</p></div>'+
    '<button data-act="step" data-d="1" aria-label="Next" class="w-11 h-11 rounded-2xl grid place-items-center bg-white hand font-bold text-[18px] active:scale-90 transition" style="border:2.5px solid #F3E7EA;box-shadow:0 3px 0 #FBF0F4">›</button>'+
  '</div>';

  const pill=(icon,fb,label,val,bg,tone,rot)=>
    '<div class="rounded-[22px] p-3.5" style="background:'+bg+';border:2px solid '+tone+'">'+
      '<div class="mb-2">'+stk(icon,{size:38,ic:22,tone:tone,rot:rot,fb:fb})+'</div>'+
      '<p class="hand text-[11.5px] text-soft font-semibold">'+esc(label)+'</p>'+
      '<p class="font-extrabold text-[17px] leading-tight money">'+rpS(val)+'</p></div>';
  html+='<div class="grid grid-cols-2 gap-3 mb-5">'+
    pill('purse','👛',t('Cuan Masuk'),s.masuk,'#F1F8EC','#D3E7C6',-3)+
    pill('shopping-bags','🛍️',t('Kejajanin'),s.jajan,'#FFF2F6','#FBDDE7',3)+
    pill('money-bag','💰',t('Ketabung'),s.nabung,'#F1F8EC','#D8E8D4',-2)+
    pill('cherry-blossom','🌸',t('Sisa Dompet'),s.sisa,'#FDF5F8','#EBE0EF',3)+
  '</div>';

  html+='<button data-act="share" class="clay w-full py-3.5 mb-5 hand font-bold text-[15.5px]">'+t('Share ke IG Story 📤')+'</button>';

  const per={};
  M.tx.forEach(x=>{ if(x.cat==='celengan') return; per[x.cat]=(per[x.cat]||0)+num(x.amount); });
  const rows=Object.keys(per).map(k=>({k,v:per[k]})).sort((a,b)=>b.v-a.v);
  let catHtml='';
  if(rows.length){
    const max=rows[0].v;
    rows.forEach(r=>{
      const c=catOf(r.k);
      catHtml+='<div class="flex items-center gap-2.5 py-2">'+
        stk(c.i,{size:38,ic:22,tone:c.c,fb:c.f})+
        '<div class="flex-1 min-w-0">'+
          '<div class="flex justify-between mb-1"><span class="hand text-[13.5px] font-semibold">'+esc(cName(c))+'</span>'+
          '<span class="text-[12.5px] font-extrabold money">'+rpS(r.v)+'</span></div>'+
          '<div class="track" style="height:9px"><div class="fill" style="width:'+(r.v/max*100)+'%;background-color:'+c.s+'"></div></div>'+
        '</div></div>';
    });
  } else catHtml='<p class="hand text-[13px] text-soft text-center py-4">'+t('Bulan ini masih bersih, belum ada catatan 🌱')+'</p>';
  html+='<section class="paper tape p-4 pt-5 mb-5" style="'+tapeStyle('main','26px',80,-5)+'">'+
    cardHead(t('Duitmu Lari ke Mana? 👀'),'chart-increasing','#FFD9E4','📊')+catHtml+'</section>';

  const dim=daysIn(mk), first=new Date(num(mk.slice(0,4)),num(mk.slice(5,7))-1,1).getDay();
  const dayTot={};
  M.tx.forEach(x=>{ if(x.cat==='celengan') return; const d=num(x.date.slice(8,10)); dayTot[d]=(dayTot[d]||0)+num(x.amount); });
  const maxD=Math.max(1,...Object.values(dayTot));
  let cal='<div class="grid grid-cols-7 gap-1.5 mb-2">'+HARI_S().map(h=>'<span class="hand text-[10px] text-soft text-center font-bold">'+h+'</span>').join('')+'</div>'+
    '<div class="grid grid-cols-7 gap-1.5">';
  for(let i=0;i<first;i++) cal+='<span></span>';
  for(let d=1;d<=dim;d++){
    const v=dayTot[d]||0, a=v>0?.18+(v/maxD)*.72:0;
    const isToday=mk===mkNow()&&d===new Date().getDate();
    cal+='<div class="aspect-square rounded-[13px] grid place-items-center text-[11px] font-extrabold" '+
      'style="background:'+(v>0?'rgba(255,158,178,'+a.toFixed(2)+')':'#FDF6F9')+';color:'+(a>.55?'#fff':'#B4A3AE')+
      ';border:2px solid '+(isToday?'#FF9EAA':'transparent')+'" title="'+rp(v)+'">'+d+'</div>';
  }
  cal+='</div>';
  html+='<section class="paper tape p-4 pt-5 mb-5" style="'+tapeStyle('goal','30px',74,4)+'">'+
    cardHead(t('Kalender Jajan 📅'),'spiral-calendar','#E6DCEE','📅',
      '<span class="hand text-[11px] text-soft">'+t('makin pink = makin boros')+'</span>')+cal+'</section>';

  html+='<section class="paper tape p-4 pt-5 mb-3" style="'+tapeStyle('main','24px',72,-4)+'">'+
    cardHead(t('Cerita Bulan Ini'),'notebook-with-decorative-cover','#FCE9B8','📔')+
    storyList(storyItems(mk))+'</section>';

  return html;
}
