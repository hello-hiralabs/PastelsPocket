import { BULAN_S, HARI_S, LANG, t, tf } from '../i18n.js';
import { CATS, ENVS, cName, catOf } from '../constants.js';
import { clamp, esc, fmt, ico, mkLabel, mkNow, num, pawStamp, rp, rpS, stk, today, zig } from '../utils.js';
import { MO, db, tapeStyle, ui } from '../state.js';
import { allowance, daysLeft, envNom, envOfCat, envPctSum, envSpent, hasOverride, spentOn, sums, wantsLeft } from '../calc.js';
import { filterActive, filterBar } from '../filter.js';
import { CAT_COL, catQuote, catScene, catState } from '../mascot.js';
import { histDates, prevMonthWithData, storyItems, storyList } from '../history.js';
import { cardHead } from './header.js';

/* =========================================================
   10. TAB RUMAH
   ========================================================= */
export function viewHome(){
  const mk=mkNow(), s=sums(mk), jatah=allowance(), spent=spentOn(today());
  const left=Math.max(0,jatah-spent);
  const pct=jatah>0?clamp(spent/jatah*100,0,100):(spent>0?100:0);
  const cst=catState(left,jatah), ovr=hasOverride();
  /* < 15% jatah = tanda bahaya: bar diberi garis bergerak + denyut halus */
  const kritis = jatah>0 && left/jatah < .15;
  let html='';

  html+=
  '<section class="paper ruled tape p-4 pt-5 mb-5" style="'+tapeStyle('main','26px',104,-7)+'">'+
    '<div class="relative mb-3">'+
      '<div class="rounded-[18px] overflow-hidden" style="border:2.5px solid #EFDDE4;box-shadow:inset 0 2px 6px rgba(197,150,170,.18)" data-live="scene" data-cur="'+cst+'">'+catScene(cst)+'</div>'+
    '</div>'+
    '<p class="hand font-bold text-[13.5px] text-[#A66172] flex items-center gap-1.5">'+t('Jatah Jajan Hari Ini 🧋')+
      '<button data-act="edit-limit" aria-label="Ubah limit" class="w-6 h-6 grid place-items-center rounded-full" style="background:#FFF3CD;border:2px solid #F7E7B8">'+ico('pencil',12,'✏️')+'</button>'+
      (ovr?'<span class="text-[9.5px] font-bold px-1.5 py-0.5 rounded-full" style="background:#F5D96B;color:#5A4E4D">'+t('custom')+'</span>':'')+'</p>'+
    '<p class="font-extrabold text-[38px] leading-[1.15] money mt-0.5" data-live="left">'+rp(left)+'</p>'+
    '<p class="hand text-[12.5px] text-soft mt-0.5" data-live="kata">'+esc(catQuote(cst))+'</p>'+
    (kritis?'<p class="hand text-[11.5px] font-bold mt-0.5" style="color:#D4796A">'+t('Jatah hampir habis!')+'</p>':'')+
    '<div class="mt-4">'+
      '<div class="track'+(kritis?' alert-ring':'')+'" data-live="bartrack" style="height:15px"><div class="fill'+(kritis?' fill-alert':'')+'" data-live="bar" style="width:'+pct+'%;background-color:'+CAT_COL[cst]+'"></div></div>'+
      '<div class="flex justify-between text-[11px] text-soft mt-1.5 px-0.5">'+
        '<span class="hand font-semibold" data-live="spent">'+esc(tf('Kepake {0}',rpS(spent)))+'</span>'+
        '<span class="hand font-semibold">'+esc(tf('dari limit jajan {0}/hari',rpS(jatah)))+'</span>'+
      '</div>'+
    '</div>'+
    '<div class="mt-3.5 flex gap-2">'+
      '<div class="flex-1 rounded-2xl px-3 py-2" style="background:#FFF6E2;border:2px solid #F7E6B6">'+
        '<p class="text-[10.5px] text-soft">'+t('Sisa Dompet Jajan Bulan Ini')+'</p>'+
        '<p class="font-extrabold text-[15px] money" data-live="sisa">'+rpS(wantsLeft(mk))+'</p></div>'+
      '<div class="flex-1 rounded-2xl px-3 py-2" style="background:#F1F8EC;border:2px solid #D3E7C6">'+
        '<p class="text-[10.5px] text-soft">'+t('Hitungan Mundur Payday')+'</p>'+
        '<p class="font-extrabold text-[15px]">'+esc(tf('{0} hari lagi',daysLeft()))+'</p></div>'+
      '<button data-act="share" aria-label="Story card" class="stk-press w-[52px] rounded-2xl grid place-items-center" style="background:#FCF5F8;border:2px solid #EFDCD1">'+
        stk('outbox-tray',{size:34,ic:20,tone:'#F7E7B8',fb:'📤'})+'</button>'+
    '</div>'+
  '</section>';

  const inc=MO(mk).income;
  html+=
  '<section class="paper tape p-4 pt-5 mb-5" style="'+tapeStyle('main','calc(100% - 116px)',88,5)+'">'+
    cardHead(t('Cuan Masuk 💸'),'purse','#D3E7C6','👛',
      '<span class="font-extrabold text-[17px] money" data-live="masuk">'+rp(s.masuk)+'</span>')+
    (inc.length? inc.map(r=>
      '<div class="flex items-center gap-2.5 py-2 border-b-2 border-dotted border-[#F6E8EE] last:border-0">'+
        stk('incoming-envelope',{size:34,ic:20,tone:'#E8E3F3',fb:'📩'})+
        '<input type="text" data-field="inc:'+r.id+':label" value="'+esc(r.label)+'" placeholder="'+t('Cuan dari mana?')+'" class="flatfield hand text-[14px] font-semibold flex-1 min-w-0">'+
        '<input type="text" inputmode="numeric" data-money="1" data-field="inc:'+r.id+':amount" value="'+fmt(r.amount)+'" class="flatfield text-[13.5px] font-extrabold text-right money w-[108px]">'+
        '<button data-act="del-inc" data-id="'+r.id+'" aria-label="Hapus" class="w-6 h-6 grid place-items-center text-[#CBBCC0] font-bold text-[15px] shrink-0">×</button>'+
      '</div>').join('')
      : '<p class="hand text-[13px] text-soft text-center py-3">'+t('Belum ada cuan masuk bulan ini 🌱')+'</p>')+
    '<button data-act="add-inc" class="mt-3 w-full py-2.5 rounded-2xl dashed hand text-[13.5px] font-bold text-soft active:scale-[.98] transition">'+t('+ Tambah Cuan Baru')+'</button>'+
  '</section>';

  html+=envCard(mk);

  const hmk=ui.hmk||mkNow(), isCur=hmk===mkNow();
  const H=histDates(hmk,ui.histLvl), byDate=H.by;
  let hist='';
  if(H.all.length){
    H.shown.forEach(ds=>{
      const list=byDate[ds];
      const tot=list.reduce((a,x)=>a+(x.cat==='celengan'?0:num(x.amount)),0);
      const dd=new Date(ds+'T00:00:00');
      const label=ds===today()?t('Hari ini'):HARI_S()[dd.getDay()]+', '+dd.getDate()+' '+BULAN_S()[dd.getMonth()];
      hist+=
      '<div class="mb-4 last:mb-0">'+
        '<div class="flex items-center gap-2 mb-1.5">'+
          '<span class="hand font-bold text-[13px] px-2.5 py-0.5 rounded-full" style="background:'+(ds===today()?'#FFEAF0':'#FDF5F8')+';color:'+(ds===today()?'#E4718A':'#7E7271')+'">'+esc(label)+'</span>'+
          '<span class="flex-1 border-b-2 border-dotted border-[#EEDEE4]"></span>'+
          '<span class="text-[11.5px] text-soft money font-bold">'+rpS(tot)+'</span>'+
        '</div>'+
        list.slice().reverse().map(x=>{
          const c=catOf(x.cat);
          return '<div class="flex items-center gap-2.5 py-2">'+
            stk(c.i,{size:38,ic:22,tone:c.c,fb:c.f})+
            '<div class="flex-1 min-w-0">'+
              '<p class="hand text-[14px] font-semibold truncate leading-tight">'+esc(x.note||cName(c))+'</p>'+
              '<p class="text-[10.5px] text-soft">'+esc(cName(c))+(x.rec?' · '+t('otomatis'):'')+'</p></div>'+
            '<span class="font-extrabold text-[14px] money shrink-0" style="color:'+(x.cat==='celengan'?'#5D7C58':'#5A4E4D')+'">'+(x.cat==='celengan'?'+':'−')+rpS(x.amount)+'</span>'+
            '<button data-act="del-tx" data-id="'+x.id+'" aria-label="Hapus" class="w-6 h-6 grid place-items-center text-[#CBBCC0] font-bold text-[15px] shrink-0">×</button>'+
          '</div>';
        }).join('')+
      '</div>';
    });
  } else if(filterActive()){
    hist='<div class="text-center py-7">'+
      '<div class="inline-block mb-3">'+stk('memo',{size:64,ic:38,tone:'#EFDFB4',rot:3,fb:'🔍'})+'</div>'+
      '<p class="hand text-[14.5px] font-bold mb-1">'+t('Tidak ada catatan yang cocok 🔍')+'</p>'+
      '<p class="text-[12.5px] text-soft px-6">'+t('Coba kata lain atau lepas filter kategorinya.')+'</p></div>';
  } else {
    hist='<div class="text-center py-8">'+
      '<div class="inline-block mb-3">'+stk('basket',{size:74,ic:44,tone:'#EFDCD1',rot:-4,fb:'🧺'})+'</div>'+
      '<p class="hand text-[15px] font-bold mb-1">'+esc(isCur?t('Masih bersih nih! Belum jajan apa-apa hari ini ✨'):tf('Belum ada catatan di {0} 🌱',mkLabel(hmk)))+'</p>'+
      '<p class="text-[12.5px] text-soft px-6">'+t('Ketuk tombol pink di bawah buat mulai nyatet.')+'</p></div>';
  }

  /* tingkat berikutnya yang benar-benar menambah hari */
  let nextLvl=-1, delta=0;
  for(let L=ui.histLvl+1; L<=2; L++){
    const n=histDates(hmk,L).shown.length;
    if(n>H.shown.length){ nextLvl=L; delta=n-H.shown.length; break; }
  }
  const capt=[t('3 hari terakhir'),t('Seminggu terakhir'),t('Sebulan penuh')][clamp(ui.histLvl,0,2)];
  let ctrl='';
  if(H.all.length){
    if(nextLvl>=0){
      const lab = nextLvl===1 ? tf('Lihat {0} hari sebelumnya',delta) : tf('Buka sisa bulan ini · {0} hari',delta);
      ctrl+='<button data-act="hist-more" data-l="'+nextLvl+'" class="mt-3 w-full py-2.5 rounded-2xl dashed hand text-[13px] font-bold text-soft flex items-center justify-center gap-1.5 active:scale-[.98] transition">'+
        '<span>'+esc(lab)+'</span><span class="text-[10px] opacity-70">▼</span></button>';
    }
    if(ui.histLvl>0){
      ctrl+='<button data-act="hist-less" class="mt-2 w-full py-2 hand text-[12px] font-bold text-soft/70 flex items-center justify-center gap-1.5">'+
        '<span class="text-[10px] opacity-70">▲</span><span>'+t('Tutup lagi')+'</span></button>';
    }
    /* halaman sebelumnya: muncul kalau bulan ini sudah kebuka semua */
    if(nextLvl<0){
      const prev=prevMonthWithData(hmk);
      if(prev||!isCur){
        ctrl+='<div class="mt-3 pt-3 border-t-2 border-dotted border-[#EEDEE4] flex gap-2">'+
          (prev?'<button data-act="hist-month" data-mk="'+prev+'" class="chip hand flex-1 text-center !text-[11.5px]">◀ '+esc(tf('Buka {0}',mkLabel(prev)))+'</button>':'')+
          (!isCur?'<button data-act="hist-now" class="chip hand flex-1 text-center !text-[11.5px]" style="background:#FFF6E2;border-color:#F7E6B6;color:#786557">'+t('Balik ke bulan ini')+'</button>':'')+
        '</div>';
      }
    }
  }

  const totShown=H.shown.reduce((a,ds)=>a+byDate[ds].reduce((b,x)=>b+(x.cat==='celengan'?0:num(x.amount)),0),0);
  html+='<section class="receipt tape mb-2" style="'+tapeStyle('main','30px',76,-4)+'">'+
    zig(1)+
    '<div class="receipt-body relative">'+
      '<div class="flex items-start gap-2 pt-1">'+
        '<div class="flex-1 text-center">'+
          '<p class="hand font-bold text-[15.5px] leading-tight">'+t('Struk Jajan Kamu 🧾')+'</p>'+
          '<p class="text-[8.5px] font-bold tracking-[.16em] text-soft mt-0.5">'+t('PASTELS · YOUR POCKET BESTIE')+'</p>'+
        '</div>'+
        (isCur?'':'<button data-act="hist-now" class="hand text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap shrink-0" style="background:#FFF6E2;border:2px solid #F7E6B6;color:#786557">'+t('Balik ke bulan ini')+'</button>')+
      '</div>'+
      '<p class="text-center text-[10.5px] text-soft mt-1 mb-2">'+esc(mkLabel(hmk)+' · '+(H.filtered?t('Hasil pencarian'):capt)+' · '+tf('{0} hari tercatat',H.shown.length))+'</p>'+
      '<div class="dotline mb-2"></div>'+
      filterBar(H.hits)+
      hist +
      '<div class="dotline mt-1 mb-2"></div>'+
      '<div class="flex items-end justify-between pb-1">'+
        '<span class="text-[10.5px] font-extrabold tracking-[.14em] text-soft">'+t('TOTAL TERCATAT')+'</span>'+
        '<span class="font-extrabold text-[17px] money">'+rp(totShown)+'</span>'+
      '</div>'+
      '<p class="hand text-center text-[11.5px] text-soft pt-1.5 pb-0.5">'+t('Makasih udah rajin nyatet ya! 🌸')+'</p>'+
      ctrl+
      '<div class="stamp">'+pawStamp(46,'#A3C79B')+'</div>'+
      '<div class="pb-2"></div>'+
    '</div>'+
    zig(-1)+
  '</section>';
  /* tumpukan struk: petunjuk halus kalau masih ada catatan di bawahnya */
  if(nextLvl>=0){
    html+='<div class="mx-auto mb-1" style="width:90%;height:6px;background:#FFF7FA;box-shadow:0 3px 6px rgba(197,150,170,.14)"></div>'+
          '<div class="mx-auto mb-5" style="width:78%;height:6px;background:#FDF2F6;box-shadow:0 3px 6px rgba(197,150,170,.10)"></div>';
  } else { html+='<div class="mb-5"></div>'; }

  /* Cerita bulan ini — ditaruh persis di bawah riwayat sebagai pengingat */
  if(H.all.length){
    html+='<section class="paper tape p-4 pt-5 mb-5" style="'+tapeStyle('main','24px',72,4)+';background:linear-gradient(165deg,#FFFDFB,#FFFAEA)">'+
      cardHead(tf('Cerita {0}',mkLabel(hmk)),'notebook-with-decorative-cover','#FCE9B8','📔',
        '<button data-act="go-recap" data-mk="'+hmk+'" class="hand text-[11px] font-bold whitespace-nowrap" style="color:#786557">'+t('Rekap lengkap')+' ▸</button>')+
      storyList(storyItems(hmk).slice(0,3))+
    '</section>';
  }

  html+=
  '<section class="paper tape p-5 pt-6 mb-2 text-center" style="'+tapeStyle('goal','calc(50% - 44px)',88,3)+';background:linear-gradient(160deg,#FAF4F7,#EEF6F3)">'+
    '<div class="inline-block mb-2">'+stk('people-hugging',{size:60,ic:36,tone:'#DCD2E8',rot:-3,fb:'👭'})+'</div>'+
    '<h2 class="hand font-bold text-[16px] mb-1">'+(LANG==='en'?'Save-Off With Your Bestie':'Challenge Hemat Bareng Bestie')+'</h2>'+
    '<p class="text-[12.5px] text-[#66706D] leading-relaxed mb-3 px-2">'+
      (LANG==='en'?'A week-long saving duel, cheering each other on, racing for the winner sticker. Coming soon 💖'
                 :'Adu hemat seminggu, saling nyemangatin, rebutan stiker juara. Coming soon 💖')+'</p>'+
    '<button data-act="soon" class="chip hand">'+(LANG==='en'?'Notify me later':'Notify me nanti ya')+'</button>'+
  '</section>';

  return html;
}

export function envCard(mk){
  const masuk=sums(mk).masuk, pctSum=envPctSum();
  let rows='';
  ENVS.forEach(e=>{
    const alloc=envNom(e.k,masuk), used=envSpent(mk,e.k);
    const p=alloc>0?clamp(used/alloc*100,0,100):(used>0?100:0);
    const over=alloc>0&&used>alloc;
    rows+=
    '<div class="py-2.5 border-b-2 border-dotted border-[#F6E8EE] last:border-0">'+
      '<div class="flex items-center gap-2.5 mb-2">'+
        stk(e.i,{size:36,ic:21,tone:e.tone,fb:e.f})+
        '<div class="flex-1 min-w-0">'+
          '<p class="hand font-bold text-[13.5px] leading-tight">'+esc(LANG==='en'?e.en:e.n)+'</p>'+
        '</div>'+
        '<div class="flex items-center gap-1 shrink-0">'+
          '<input type="text" inputmode="numeric" data-field="env:'+e.k+':pct" data-live="envpct:'+e.k+'" value="'+num(db.env[e.k].pct)+'" class="field !py-1 !px-1.5 w-[44px] text-center font-extrabold text-[12.5px]">'+
          '<span class="text-[11px] text-soft font-bold">%</span>'+
        '</div>'+
        '<input type="text" inputmode="numeric" data-money="1" data-field="env:'+e.k+':nom" data-live="envnom:'+e.k+'" value="'+fmt(alloc)+'" class="field !py-1 !px-2 w-[92px] text-right money font-extrabold text-[12.5px] shrink-0">'+
      '</div>'+
      '<div class="track" style="height:9px"><div class="fill" data-live="envbar:'+e.k+'" style="width:'+p+'%;background-color:'+(over?'#FF8299':e.solid)+'"></div></div>'+
      '<p class="text-[10.5px] text-soft mt-1" data-live="envused:'+e.k+'">'+esc(tf('Kepake {0} dari {1}',rpS(used),rpS(alloc)))+'</p>'+
    '</div>';
  });

  /* Dropdown: kategori jajan mana masuk amplop mana.
     Disembunyikan di belakang <details> supaya kartu tidak ramai. */
  const envOpts=k=>ENVS.map(e=>'<option value="'+e.k+'"'+(envOfCat(k)===e.k?' selected':'')+'>'+esc(LANG==='en'?e.en:e.n)+'</option>').join('');
  const peta=CATS.map(c=>
    '<div class="flex items-center gap-2 py-1.5 border-b border-dotted border-[#F6E8EE] last:border-0">'+
      stk(c.i,{size:30,ic:18,tone:c.c,fb:c.f})+
      '<span class="hand text-[12.5px] font-semibold flex-1 min-w-0 truncate">'+esc(cName(c))+'</span>'+
      '<select data-field="catenv:'+c.k+'" class="field !py-1 !px-2 text-[11.5px] w-[124px] shrink-0">'+envOpts(c.k)+'</select>'+
    '</div>').join('');
  return '<section class="paper tape p-4 pt-5 mb-5" style="'+tapeStyle('main','24px',84,4)+'">'+
    cardHead(t('Amplop Bulan Ini 🧺'),'card-file-box','#F7E7B8','🧺',
      '<span class="hand text-[11px] font-bold '+(pctSum===100?'text-soft':'text-[#FF8299]')+'" data-live="envtotal">'+esc(tf('Total amplop {0}% dari cuan masuk',pctSum))+'</span>')+
    '<p class="text-[12px] text-soft mb-1 -mt-1">'+t('Bagi otomatis dari cuan masuk, atau ketik nominal sendiri.')+'</p>'+
    rows+
    '<button data-act="autosplit" class="mt-3 w-full py-2.5 rounded-2xl hand text-[13.5px] font-bold active:scale-[.98] transition" style="background:#FFF3CD;border:2.5px solid #F7E7B8;box-shadow:0 3px 0 #F7E7B8">'+t('Auto-Split 50/30/20')+'</button>'+
    '<details class="mt-3">'+
      '<summary class="hand text-[12.5px] font-bold text-soft cursor-pointer py-1">'+t('Atur kategori tiap amplop')+'</summary>'+
      '<p class="text-[11.5px] text-soft mt-1 mb-2">'+t('Yang masuk Jatah Jajan ikut menentukan limit harianmu.')+'</p>'+
      peta+
    '</details>'+
  '</section>';
}
