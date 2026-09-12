import { HARI_S, t, tf } from '../i18n.js';
import { BADGES, WASHI, bDesc, bName, wName, wNeedText } from '../constants.js';
import { esc, ico, iso, mkOf, num, pawStamp, stk } from '../utils.js';
import { db, tapeStyle } from '../state.js';
import { cardHead } from './header.js';

/* =========================================================
   12. TAB STIKER (+ lemari washi)
   ========================================================= */
export function viewBadge(){
  const st=db.streak, got=Object.keys(db.badges).length;
  let html='';

  let week='';
  for(let i=6;i>=0;i--){
    const d=new Date(); d.setDate(d.getDate()-i);
    const ds=iso(d), M=db.months[mkOf(ds)];
    const on=M?M.tx.some(x=>x.date===ds):false;
    week+='<div class="flex-1 text-center">'+
      '<div class="h-11 rounded-2xl grid place-items-center" style="background:'+(on?'#fff':'rgba(255,255,255,.45)')+';border:2px solid '+(on?'#FBE49B':'#F8E9EF')+'">'+
        (on?ico('cherry-blossom',20,'🌸'):'<span class="text-[#D6C2CA] font-bold">·</span>')+'</div>'+
      '<p class="hand text-[10px] text-[#8A7565] mt-1 font-bold">'+HARI_S()[d.getDay()]+'</p></div>';
  }
  html+=
  '<section class="paper tape p-5 pt-6 mb-5" style="'+tapeStyle('main','28px',96,-6)+';background:linear-gradient(160deg,#FFFAEA,#FFF6E2)">'+
    '<div class="flex items-center gap-4">'+
      stk('fire',{size:70,ic:44,tone:'#FBE49B',rot:-4,round:true,fb:'🔥'})+
      '<div class="flex-1">'+
        '<p class="hand font-bold text-[13px] text-[#8A7565]">'+t('Streak Rajin Nyatet 🔥')+'</p>'+
        '<p class="font-extrabold text-[31px] leading-tight">'+esc(tf('{0} hari',num(st.count)))+'</p>'+
        '<p class="text-[11.5px] text-[#8A7565]">'+esc(tf('Best record kamu {0} hari',num(st.best)))+'</p>'+
      '</div>'+
    '</div>'+
    '<div class="flex gap-1.5 mt-4">'+week+'</div>'+
  '</section>';

  html+='<div class="flex items-end justify-between mb-3 px-1">'+
    '<h2 class="hand font-bold text-[18px]">'+t('Dinding Piala & Bingkai 🖼️')+'</h2>'+
    '<span class="hand text-[13px] font-bold text-soft">'+esc(tf('{0} dari {1} kekumpul',got,BADGES.length))+'</span></div>';

  const SHOT=['#FFE8DC','#E2F0D9','#FFF3CD','#FCDCE8','#E1E9F5','#F3E9EE'];
  let frames='';
  BADGES.forEach((b,i)=>{
    const on=!!db.badges[b.id];
    const rot=[-3.5,2.5,-2,3,-3,1.8][i%6];
    frames+=
    '<button data-act="badge" data-id="'+b.id+'" class="relative pt-2.5 active:scale-95 transition">'+
      '<span class="pin absolute left-1/2 -translate-x-1/2 top-0 z-10"></span>'+
      '<span class="polaroid block" style="transform:rotate('+rot+'deg)">'+
        '<span class="shot block" style="height:62px;background:'+(on?SHOT[i%SHOT.length]:'#F3E7EC')+'">'+
          (on?ico(b.i,34,b.f):'<span class="hand font-bold text-[20px] text-[#C6B6BA]">?</span>')+'</span>'+
        '<span class="hand block text-[9.5px] font-bold leading-tight py-1.5 px-0.5 '+(on?'':'text-soft')+'">'+
          esc(on?bName(b):t('Bingkai kosong nunggu diisi'))+'</span>'+
      '</span>'+
    '</button>';
  });
  html+='<section class="wall p-3.5 pt-3 mb-5">'+
    '<div class="rail mb-4"></div>'+
    '<div class="grid grid-cols-3 gap-x-2.5 gap-y-4">'+frames+'</div>'+
    '<div class="flex justify-end mt-3 opacity-30">'+pawStamp(32,'#6E9668')+'</div>'+
  '</section>';

  const next=BADGES.filter(b=>!db.badges[b.id])[0];
  if(next){
    html+='<section class="paper p-4 mb-5">'+
      '<p class="hand text-[12.5px] font-bold text-berry mb-2.5">'+t('Stiker selanjutnya nih 👀')+'</p>'+
      '<div class="flex items-center gap-3">'+
        '<span class="locked">'+stk(next.i,{size:52,ic:32,tone:'#EFE0E6',fb:next.f})+'</span>'+
        '<div><p class="hand font-bold text-[15.5px]">'+esc(bName(next))+'</p>'+
        '<p class="text-[12px] text-soft">'+esc(bDesc(next))+'</p></div></div></section>';
  } else {
    html+='<section class="paper p-6 text-center mb-5">'+
      '<div class="inline-block mb-2">'+stk('crown',{size:70,ic:42,tone:'#FBE49B',rot:-4,fb:'👑'})+'</div>'+
      '<p class="hand font-bold text-[16px] mb-1">'+t('Semua stiker kekumpul! 👑')+'</p>'+
      '<p class="text-[12.5px] text-soft">'+t('Kamu resmi jadi Ratu Nyatet. Proud of you, Bestie! 💖')+'</p></section>';
  }

  html+=washiWardrobe();
  html+='<button data-act="share" class="clay w-full py-4 hand font-bold text-[16px]">'+t('Bikin Kartu Buat Story 📤')+'</button>';
  return html;
}

export function washiWardrobe(){
  const own=db.washi.owned.length;
  let cards='';
  WASHI.forEach(w=>{
    const unlocked=db.washi.owned.indexOf(w.id)>=0;
    const isMain=db.washi.main===w.id, isGoal=db.washi.goal===w.id;
    cards+=
    '<div class="rounded-[20px] p-3 '+(unlocked?'bg-white':'bg-white/50')+'" style="border:2.5px '+(unlocked?'solid '+w.tone:'dashed #EFDFE5')+';'+(unlocked?'box-shadow:0 3px 0 '+w.tone:'')+'">'+
      '<div class="swatch mb-2 '+(unlocked?'':'locked')+'" style="background:'+w.bg+';transform:rotate(-1.5deg)"></div>'+
      '<p class="hand font-bold text-[12.5px] leading-tight mb-0.5 '+(unlocked?'':'text-soft')+'">'+esc(unlocked?wName(w):t('Terkunci'))+'</p>'+
      (unlocked
        ? '<div class="flex gap-1.5 mt-2">'+
            '<button data-act="wear" data-id="'+w.id+'" data-slot="main" aria-pressed="'+isMain+'" class="chip hand flex-1 !px-1 !py-0.5 !text-[10px] text-center'+(isMain?' !bg-[#FFEAF0] !border-[#FFC0D3] !text-[#E4718A]':'')+'">'+t('Kartu Utama')+'</button>'+
            '<button data-act="wear" data-id="'+w.id+'" data-slot="goal" aria-pressed="'+isGoal+'" class="chip hand flex-1 !px-1 !py-0.5 !text-[10px] text-center'+(isGoal?' !bg-[#EAF5E2] !border-[#A3C79B] !text-[#6E9668]':'')+'">'+t('Kartu Celengan')+'</button>'+
          '</div>'
        : '<p class="text-[10.5px] text-soft leading-snug">'+esc(wNeedText(w))+'</p>')+
    '</div>';
  });
  return '<section class="paper tape p-4 pt-5 mb-5" style="'+tapeStyle('goal','24px',82,4)+'">'+
    cardHead(t('Lemari Washi Tape 🎀'),'ribbon','#FFE3EE','🎀',
      '<span class="hand text-[11px] font-bold text-soft">'+esc(tf('{0} dari {1} motif kebuka',own,WASHI.length))+'</span>')+
    '<p class="text-[12px] text-soft mb-3 -mt-1">'+t('Pilih motif buat kartu utama & kartu celengan')+'</p>'+
    '<div class="grid grid-cols-2 gap-2.5">'+cards+'</div></section>';
}
