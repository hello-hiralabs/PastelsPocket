import { t, tf } from '../i18n.js';
import { clayVars, kName, kindOf } from '../constants.js';
import { clamp, esc, fmt, ico, mkNow, num, rp, rpS, stk } from '../utils.js';
import { db, tapeStyle, ui } from '../state.js';
import { envNom, envSpent, sums, totalSaved } from '../calc.js';
import { cardHead } from './header.js';

/* =========================================================
   11. TAB CELENGAN
   ========================================================= */
export function viewSave(){
  const tot=totalSaved();
  const target=db.goals.reduce((a,g)=>a+num(g.target),0);
  const pct=target>0?clamp(tot/target*100,0,100):0;
  const s=sums(mkNow());
  let html='';

  html+=
  '<section class="paper tape p-5 pt-6 mb-5 text-center" style="'+tapeStyle('goal','calc(50% - 50px)',100,-5)+';background:linear-gradient(165deg,#F1F8EC,#FFFAEA)">'+
    '<div class="inline-block mb-2 hop">'+stk('money-bag',{size:84,ic:52,tone:'#CDE4C0',rot:-3,round:true,fb:'💰'})+'</div>'+
    '<h2 class="hand font-bold text-[17px] mb-0.5">'+t('Celengan Impian 💰')+'</h2>'+
    '<p class="hand text-[12px] text-[#6E9668] mb-2 px-3 leading-snug">'+t('Biar jajan tetep aman, sambil nabung wishlist 💖')+'</p>'+
    '<p class="hand font-bold text-[12.5px] text-[#6E9668]">'+t('Total di semua celengan')+'</p>'+
    '<p class="font-extrabold text-[33px] leading-tight money mb-3">'+rp(tot)+'</p>'+
    '<div class="track mx-auto max-w-[286px]" style="height:16px">'+
      '<div class="fill" style="width:'+pct+'%;background-color:#A3C79B"></div></div>'+
    '<p class="hand text-[12.5px] text-[#6E9668] mt-2">'+esc(tf('{0}% dari total wishlist {1}',Math.round(pct),rpS(target)))+'</p>'+
  '</section>';

  if(db.goals.length && ui.sortMode){
    html+='<section class="paper p-4 mb-4" style="background:#FFFDFA;border-color:#F7E7B8">'+
      cardHead(t('Atur Urutan'),'clamp','#F7E7B8','📋',
        '<button data-act="sort-done" class="hand text-[11.5px] font-bold px-3 py-1 rounded-full" style="background:#EAF5E2;border:2px solid #A3C79B;color:#6E9668">'+t('Selesai')+'</button>')+
      '<p class="text-[12px] text-soft mb-3 -mt-1">'+t('Susun celengan sesuai prioritas kamu. Yang paling penting taruh di atas ✨')+'</p>'+
      db.goals.map((g,gi)=>{
        const k=kindOf(g.e);
        const p=num(g.target)>0?clamp(num(g.saved)/num(g.target)*100,0,100):0;
        return '<div class="sortrow flex items-center gap-2.5 p-2.5 mb-2">'+
          '<span class="hand font-bold text-[12px] w-5 text-center text-soft">'+(gi+1)+'</span>'+
          stk(g.e,{size:38,ic:23,tone:k.tone,fb:k.f})+
          '<div class="flex-1 min-w-0">'+
            '<p class="hand font-bold text-[13.5px] truncate leading-tight">'+esc(g.name||t('Wishlist kamu apa?'))+'</p>'+
            '<p class="text-[10.5px] text-soft">'+esc(kName(k))+' · '+Math.round(p)+'%</p></div>'+
          '<div class="flex gap-1 shrink-0">'+
            '<button data-act="goal-up" data-id="'+g.id+'" aria-label="Naikkan" class="sortbtn"'+(gi===0?' disabled':'')+'>▲</button>'+
            '<button data-act="goal-down" data-id="'+g.id+'" aria-label="Turunkan" class="sortbtn"'+(gi===db.goals.length-1?' disabled':'')+'>▼</button>'+
          '</div></div>';
      }).join('')+
    '</section>';
  } else if(db.goals.length){
    if(db.goals.length>1){
      html+='<button data-act="sort-on" class="w-full py-2.5 mb-4 rounded-2xl bg-white hand font-bold text-[13px] text-soft flex items-center justify-center gap-1.5 active:scale-[.98] transition" style="border:2.5px solid #F3E7EA;box-shadow:0 3px 0 #FBF0F4">'+
        '<span class="text-[13px]">⇅</span> '+t('Atur Urutan')+'</button>';
    }
    db.goals.forEach((g,gi)=>{
      const p=num(g.target)>0?clamp(num(g.saved)/num(g.target)*100,0,100):0;
      const k=kindOf(g.e), tone=k.tone;
      const kurang=Math.max(0,num(g.target)-num(g.saved));
      const done=p>=100;
      const gf=k.f;
      html+=
      '<section class="paper tape p-4 pt-5 mb-4" style="'+tapeStyle('goal',(20+gi*6)+'px',70,(gi%2?4:-5))+';background:'+k.soft+';border-color:'+k.tone+'88">'+
        '<div class="flex items-center gap-3 mb-3">'+
          '<button data-act="goal-emoji" data-id="'+g.id+'" aria-label="Sticker" class="stk-press shrink-0">'+
            stk(g.e,{size:52,ic:31,tone:tone,fb:gf})+'</button>'+
          '<div class="flex-1 min-w-0">'+
            '<input type="text" data-field="goal:'+g.id+':name" value="'+esc(g.name)+'" placeholder="'+t('Wishlist kamu apa?')+'" class="flatfield hand font-bold text-[17px]">'+
            '<p class="text-[11px] font-bold mt-1" style="color:'+k.dark+'">'+esc(kName(k))+'</p>'+
            '<p class="text-[11.5px] text-soft">'+esc(done?t('Udah full! Saatnya checkout 🎉'):tf('Kurang {0} lagi, semangat!',rpS(kurang)))+'</p>'+
          '</div>'+
          '<button data-act="del-goal" data-id="'+g.id+'" aria-label="Hapus" class="w-7 h-7 grid place-items-center text-[#CBBCC0] font-bold text-[17px] shrink-0">×</button>'+
        '</div>'+
        '<div class="flex items-end justify-between mb-1.5">'+
          '<span class="text-[13px]"><b class="money font-extrabold" data-live="gs:'+g.id+'">'+rpS(g.saved)+'</b> <span class="text-soft">/ '+rpS(g.target)+'</span></span>'+
          '<span class="hand font-bold text-[18px]" data-live="gp:'+g.id+'">'+Math.round(p)+'%</span>'+
        '</div>'+
        '<div class="track relative" style="height:18px">'+
          '<div class="fill" data-live="gb:'+g.id+'" style="width:'+p+'%;background-color:'+k.solid+'"></div>'+
          '<span class="absolute top-1/2 -translate-y-1/2 transition-all" style="left:calc('+p+'% - 11px)">'+
            ico(done?'party-popper':'sparkles',16,done?'🎉':'✨')+'</span>'+
        '</div>'+
        '<div class="grid grid-cols-2 gap-2 mt-3">'+
          '<label class="block"><span class="hand block text-[11px] text-soft mb-1">'+t('Targetnya')+'</span>'+
            '<input type="text" inputmode="numeric" data-money="1" data-field="goal:'+g.id+':target" value="'+fmt(g.target)+'" class="field !py-2 text-[13px] text-right money font-bold"></label>'+
          '<label class="block"><span class="hand block text-[11px] text-soft mb-1">'+t('Sudah ada')+'</span>'+
            '<input type="text" inputmode="numeric" data-money="1" data-field="goal:'+g.id+':saved" value="'+fmt(g.saved)+'" class="field !py-2 text-[13px] text-right money font-bold"></label>'+
        '</div>'+
        '<button data-act="fill-goal" data-id="'+g.id+'" class="clay mt-3.5 w-full py-3 hand font-bold text-[15px]" style="'+clayVars(k)+'">'+t('Yuk Isi Celengan 💖')+'</button>'+
      '</section>';
    });
  } else {
    html+='<section class="paper p-7 text-center mb-4">'+
      '<div class="inline-block mb-3">'+stk('honey-pot',{size:70,ic:42,tone:'#EFDCD1',rot:-4,fb:'🫙'})+'</div>'+
      '<p class="hand text-[15px] font-bold mb-1">'+t('Belum ada celengan nih')+'</p>'+
      '<p class="text-[12.5px] text-soft">'+t('Bikin satu wishlist dulu yuk, biar nabungnya ada tujuannya 💖')+'</p></section>';
  }

  /* Jembatan ke amplop: alokasi bulan ini vs yang sudah benar-benar disetor.
     Sengaja butuh satu ketukan — alokasi itu rencana, setoran itu uang. */
  const alokasi=envNom('save',sums(mkNow()).masuk);
  const tersetor=envSpent(mkNow(),'save');
  const sisaAlok=Math.max(0,alokasi-tersetor);
  if(alokasi>0){
    html+='<section class="paper tape p-4 pt-5 mb-4" style="'+tapeStyle('main','24px',78,-4)+';background:#FFFAEA;border-color:#F7E7B8">'+
      cardHead(t('Celengan Impian 💰'),'money-bag','#F7E7B8','💰')+
      '<p class="hand text-[12.5px] font-bold mb-0.5" style="color:#786557">'+esc(tf('Alokasi amplop celengan bulan ini {0}',rp(alokasi)))+'</p>'+
      '<p class="text-[11.5px] text-soft mb-3">'+esc(tf('Belum disetor ke celengan: {0}',rp(sisaAlok)))+'</p>'+
      (sisaAlok>0
        ? '<button data-act="setor-alokasi" class="clay clay-gold w-full py-3 hand font-bold text-[14.5px]">'+t('Setor Alokasi ke Celengan')+'</button>'
        : '<p class="hand text-[12.5px] text-center" style="color:#5D7C58">'+t('Alokasi celengan sudah tersetor semua ✨')+'</p>')+
    '</section>';
  }

  html+='<button data-act="add-goal" class="w-full py-4 mb-3 rounded-[26px] dashed bg-white/70 hand font-bold text-[15px] text-soft active:scale-[.98] transition">'+t('+ Bikin Celengan Baru')+'</button>';
  html+='<p class="hand text-center text-[12.5px] text-soft mb-2">'+esc(tf('Sisa dompet kamu {0} — sisihin dikit yuk 💕',rpS(s.sisa)))+'</p>';
  return html;
}
