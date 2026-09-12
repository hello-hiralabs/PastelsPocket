import { t } from './i18n.js';
import { bDesc, bName, wName } from './constants.js';
import { $, esc, iconFallback, stk } from './utils.js';
import { confetti } from './fx.js';

/* =========================================================
   8. TOAST & SHEET
   ========================================================= */
export function sheet(inner,opt){
  $('#modal').innerHTML=
    '<div data-act="close" class="absolute inset-0" style="background:rgba(91,75,87,.30);backdrop-filter:blur(3px)"></div>'+
    '<div class="sheet absolute left-0 right-0 bottom-0 mx-auto w-full max-w-[480px] px-4 pt-3" '+
      'style="background:#FFFDF9;border-radius:32px 32px 0 0;border:2.5px solid #F8E9EF;border-bottom:0;'+
      'padding-bottom:calc(var(--sb) + 18px);max-height:90vh;overflow:auto">'+
      '<div class="w-12 h-1.5 rounded-full bg-[#EEDEE4] mx-auto mb-3"></div>'+inner+
    '</div>';
  $('#modal').classList.remove('hidden');
  iconFallback();
  if(opt&&opt.focus) setTimeout(()=>{const f=$(opt.focus); if(f) f.focus();},140);
}
export function closeSheet(){ $('#modal').classList.add('hidden'); $('#modal').innerHTML=''; }

export function celebrate(title,msg,icon,fb,strong){
  confetti(strong);
  sheet(
    '<div class="text-center pb-3 pt-1">'+
      '<div class="pop inline-block mb-3">'+stk(icon,{size:96,ic:56,tone:'#FFD9E4',rot:-4,fb:fb})+'</div>'+
      '<h2 class="hand font-bold text-[22px] mb-1.5 leading-tight">'+esc(title)+'</h2>'+
      '<p class="text-[13.5px] text-soft leading-relaxed px-3 mb-5">'+esc(msg)+'</p>'+
      '<button data-act="close" class="clay w-full py-4 hand font-bold text-[16px]">'+t('Yay, lanjut! 💕')+'</button>'+
    '</div>');
}
export function celebrateBadge(b){
  confetti(true);
  sheet(
    '<div class="text-center pb-3 pt-1">'+
      '<p class="hand text-[13px] font-bold text-berry mb-3">'+t('Stiker baru kebuka! 🎊')+'</p>'+
      '<div class="pop inline-block mb-3">'+stk(b.i,{size:110,ic:62,tone:'#F5D96B',rot:-5,fb:b.f})+'</div>'+
      '<h2 class="hand font-bold text-[23px] mb-1">'+esc(bName(b))+'</h2>'+
      '<p class="text-[13.5px] text-soft mb-5">'+esc(bDesc(b))+'</p>'+
      '<button data-act="close" class="clay clay-mint w-full py-4 hand font-bold text-[16px]">'+t('Tempel di buku stiker! ✨')+'</button>'+
    '</div>');
}
export function celebrateWashi(w){
  confetti(true);
  sheet(
    '<div class="text-center pb-3 pt-1">'+
      '<p class="hand text-[13.5px] font-bold text-[#8A7565] mb-3 tracking-wide">'+t('HADIAH BARU KEBUKA! 🎉')+'</p>'+
      '<div class="pop mx-auto mb-4 px-5 py-4 rounded-[24px] bg-white" style="border:2.5px solid '+w.tone+';box-shadow:0 4px 0 '+w.tone+'">'+
        '<div class="swatch mb-3" style="background:'+w.bg+';transform:rotate(-2deg)"></div>'+
        '<div class="swatch" style="background:'+w.bg+';transform:rotate(1.5deg)"></div>'+
      '</div>'+
      '<h2 class="hand font-bold text-[22px] mb-1">'+esc(wName(w))+'</h2>'+
      '<p class="text-[13.5px] text-soft mb-5 px-3">'+t('Motif washi tape baru buat jurnalmu')+'</p>'+
      '<div class="flex gap-2">'+
        '<button data-act="close" class="flex-1 py-3.5 rounded-2xl bg-white hand font-bold text-[15px]" style="border:2.5px solid #F3E7EA;box-shadow:0 3px 0 #FBF0F4">'+t('Nanti aja')+'</button>'+
        '<button data-act="wear-washi" data-id="'+w.id+'" class="clay clay-gold flex-[1.4] py-3.5 hand font-bold text-[15.5px]">'+t('Pasang Sekarang')+'</button>'+
      '</div>'+
    '</div>');
}
