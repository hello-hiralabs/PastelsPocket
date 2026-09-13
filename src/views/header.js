import { LANG, t, tf } from '../i18n.js';
import { AVATARS } from '../constants.js';
import { $, esc, mkNow, num, stk, today } from '../utils.js';
import { db, ui } from '../state.js';
import { save } from '../data-service.js';
import { allowance, spentOn, sums } from '../calc.js';
import { catAvatar } from '../mascot.js';

/* =========================================================
   9. HEADER
   ========================================================= */
export function sapaan(){
  const j=new Date().getHours();
  const slot = j<11?0:(j<15?1:(j<18?2:3));
  /* panggilan bawaan per waktu: [ID, EN] */
  const FB=[['Sweety','Cutie'],['Sweety','Bestie'],['Sweety','Cutie'],['Bestie','Sweety']];
  const panggil = db.profile.name ? db.profile.name : FB[slot][LANG==='en'?1:0];
  if(slot===0) return tf('Pagi {0}! ✨ Siap atur jajan hari ini?',panggil);
  if(slot===1) return tf('Siang {0}! 🌸 Mau catat jajan apa hari ini?',panggil);
  if(slot===2) return tf('Sore {0}! 🌿 Gimana jajan hari ini?',panggil);
  return tf('Met malem {0}! 🌙 Spill jajan seharian yuk~',panggil);
}
export function mascotLine(){
  const s=sums(mkNow()), jatah=allowance(), spent=spentOn(today());
  const near=db.goals.filter(g=>num(g.target)>0&&num(g.saved)/num(g.target)>=.8&&num(g.saved)<num(g.target))[0];
  const full=db.goals.filter(g=>num(g.target)>0&&num(g.saved)>=num(g.target))[0];
  const lines=[sapaan()];
  if(jatah>0&&spent>jatah*.75) lines.push(t('Opps, jatah jajan tipis nih... Rem dikit dulu ya! 🚨'));
  else if(spent>0) lines.push(t('Aman banget! Masih bisa jajan enak hari ini 🍦'));
  if(full) lines.push(tf('Celengan {0} udah full! Checkout yuk 🎉',full.name));
  if(near) lines.push(t('Celengan kamu dikit lagi penuh, semangat! 💖'));
  if(spent===0) lines.push(t('Hari ini mau jajan apa? 👀'));
  if(num(db.streak.count)>=3) lines.push(tf('Streak {0} hari, rajin banget sih 🔥',db.streak.count));
  if(s.sisa<0) lines.push(t('Dompetnya minus nih, yuk cek lagi 🥲'));
  lines.push(t('Aku temenin nyatet, ya 💕'));
  lines.push(t('Jangan lupa minum air putih! 🫧'));
  return lines[ui.mascot % lines.length];
}
export function renderHeader(){
  const ava=AVATARS.find(a=>a[0]===db.profile.ava)||AVATARS[0];
  const st=db.streak;
  const sub={home:'Yuk cek dompet kamu',save:'Wishlist kamu nungguin',badge:'Koleksi stiker kamu',recap:'Rekap bulan ini'}[ui.tab];
  $('#hdr').innerHTML=
    '<div class="flex items-center gap-2.5">'+
      /* Ikon kucing = pemicu ganti tema kucing (permintaan: dipindah ke sini).
         Isinya wajah kucing yang sedang dipakai, bukan avatar Fluent. */
      '<button data-act="kitty" aria-label="'+esc(t('Ganti Kucing 🐾'))+'" class="stk-press shrink-0 hop relative">'+
        '<span class="stk" style="--tone:#FFD2E0;--rot:-4deg;width:52px;height:52px;border-radius:999px;overflow:hidden">'+
          catAvatar(db.profile.cat)+'</span>'+
        '<span class="absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] rounded-full grid place-items-center text-[9px]" style="background:#FFF3CD;border:2px solid #F7E7B8">🐾</span>'+
      '</button>'+
      '<button data-act="mascot" aria-label="'+esc(t('Ganti sapaan'))+'" class="bubble flex-1 min-w-0 text-left">'+
        '<p class="hand font-semibold text-[12.5px] leading-snug clamp2">'+esc(mascotLine())+'</p>'+
        '<p class="text-[10px] text-soft leading-tight truncate">'+esc(t(sub))+'</p>'+
      '</button>'+
      '<div class="flex flex-col gap-1.5 shrink-0">'+
        '<div class="langpill">'+
          '<button data-act="lang" data-l="id" aria-pressed="'+(LANG==='id')+'"><span>🇮🇩</span>ID</button>'+
          '<button data-act="lang" data-l="en" aria-pressed="'+(LANG==='en')+'"><span>🇬🇧</span>EN</button>'+
        '</div>'+
        '<button data-act="settings" aria-label="Settings" class="stk-press self-end">'+
          stk('gear',{size:34,ic:19,tone:'#E8D8E8',rot:3,fb:'⚙️'})+'</button>'+
      '</div>'+
    '</div>'+
    '<div class="flex items-center gap-2 mt-2.5">'+
      '<div class="flex items-center gap-1.5 pl-1.5 pr-3 py-1 rounded-full bg-white" style="border:2.5px solid #FBE49B;box-shadow:0 3px 0 #FBE49B;transform:rotate(-1.5deg)">'+
        stk('fire',{size:26,ic:17,tone:'#FBE49B',rot:0,round:true,fb:'🔥'})+
        '<span class="hand font-bold text-[13px] leading-none">'+esc(tf('{0} Hari Rajin Catat Jajan!',num(st.count)))+'</span>'+
      '</div>'+
      '<div class="flex items-center gap-1.5 pl-1.5 pr-3 py-1 rounded-full bg-white" style="border:2.5px solid #D3E7C6;box-shadow:0 3px 0 #D3E7C6;transform:rotate(1.5deg)">'+
        stk('glowing-star',{size:26,ic:17,tone:'#D3E7C6',rot:0,round:true,fb:'🌟'})+
        '<span class="hand font-bold text-[13px] leading-none">'+esc(tf('{0} Stiker Kekumpul',Object.keys(db.badges).length))+'</span>'+
      '</div>'+
    '</div>';
}

export function cardHead(title,icon,tone,fb,right){
  return '<div class="flex items-center gap-2.5 mb-3">'+
    stk(icon,{size:40,ic:23,tone:tone,fb:fb})+
    '<h2 class="hand font-bold text-[16.5px] flex-1 leading-tight">'+esc(title)+'</h2>'+
    (right||'')+'</div>';
}
