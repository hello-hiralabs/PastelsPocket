import { LANG, t, tf } from './i18n.js';
import { CATS, ENVS, GOAL_KINDS, LSKEY, WMAP, cName, catOf, wName } from './constants.js';
import { $, $$, clamp, clampDigits, digits, esc, fmt, hap, iconFallback, mkLabel, mkNow, mkOf, num, pad2, rp, rpS, safeParseBackup, sanitizeAmount, stk, toast, today, uid } from './utils.js';
import { MO, blankMonth, db, migrate, seed, setDb, ui } from './state.js';
import { CloudAdapter, DS, hydrateFromCloud, save } from './data-service.js';
import { allowance, envNom, envPctSum, envSpent, spentOn, sums } from './calc.js';
import { clearQueue, collectRewards, flushQueue, touchStreak } from './rewards.js';
import { recAdd, recDel, recFind } from './recurring.js';
import { csvFilename, monthCsv } from './csv.js';
import { filterReset } from './filter.js';
import { celebrate, closeSheet, sheet } from './sheet.js';
import { blob, catKind } from './mascot.js';
import { renderHeader } from './views/header.js';
import { badgeSheet, catPickerSheet, emojiSheet, fillGoalSheet, limitSheet, quickSheet, recurringSheet, resetSheet, settingsSheet } from './sheets.js';
import { dataURLtoBlob, storySheet } from './story.js';
import { refresh, render, setLang } from './render.js';

let qTimer=null;

/* Perbarui seluruh angka kartu Amplop di tempat.
   Tidak memakai render() supaya kursor di kotak yang sedang diketik tidak lepas. */
function refreshEnv(kecuali){
  const mk=mkNow(), masuk=sums(mk).masuk;
  ENVS.forEach(e=>{
    const alloc=envNom(e.k,masuk), used=envSpent(mk,e.k);
    const ip=document.querySelector('[data-live="envpct:'+e.k+'"]');
    const inn=document.querySelector('[data-live="envnom:'+e.k+'"]');
    const bar=document.querySelector('[data-live="envbar:'+e.k+'"]');
    const us=document.querySelector('[data-live="envused:'+e.k+'"]');
    if(ip && ip!==kecuali) ip.value=num(db.env[e.k].pct);
    if(inn && inn!==kecuali) inn.value=fmt(alloc);
    if(bar){
      const pc=alloc>0?clamp(used/alloc*100,0,100):(used>0?100:0);
      bar.style.width=pc+'%';
      bar.style.backgroundColor=(alloc>0&&used>alloc)?'#FF8299':e.solid;
    }
    if(us) us.textContent=tf('Kepake {0} dari {1}',rpS(used),rpS(alloc));
  });
  const tot=document.querySelector('[data-live="envtotal"]');
  if(tot){ const s2=envPctSum(); tot.textContent=tf('Total amplop {0}% dari cuan masuk',s2);
    tot.classList.toggle('text-soft',s2===100); }
  refresh();
}





























/* =========================================================
   17. AKSI
   ========================================================= */
document.addEventListener('click',function(ev){
  const el=ev.target.closest('[data-act]'); if(!el) return;
  const a=el.dataset.act, d=el.dataset;

  if(el.classList.contains('clay')){ el.classList.remove('clay-boing'); void el.offsetWidth; el.classList.add('clay-boing'); }
  /* getaran halus: tombol clay lebih tegas, sisanya sekilas saja */
  hap(el.classList.contains('clay') ? 18 : 8);

  switch(a){
    case 'lang': {
      const inSheet=!$('#modal').classList.contains('hidden');
      setLang(d.l);
      if(inSheet) setTimeout(()=>{ closeSheet(); settingsSheet(); },180);
      break;
    }
    case 'tab': ui.tab=d.tab; if(d.tab!=='save') ui.sortMode=false; render(); window.scrollTo(0,0); break;
    case 'hist-more': ui.histLvl=clamp(num(d.l),0,2); render(); break;
    case 'hist-less': ui.histLvl=0; render(); break;
    case 'hist-month': ui.hmk=d.mk; ui.histLvl=2; render(); break;
    case 'hist-now': ui.hmk=mkNow(); ui.histLvl=0; render(); break;
    case 'go-recap': ui.mk=d.mk; ui.tab='recap'; render(); window.scrollTo(0,0); break;
    case 'mascot': ui.mascot++; renderHeader(); iconFallback(); break;
    case 'settings': settingsSheet(); break;
    case 'close': closeSheet(); if(!flushQueue()) render(); break;
    case 'soon': toast(t('Oke siap, nanti dikabarin ya 💌')); break;
    case 'open-wardrobe': closeSheet(); ui.tab='badge'; render(); setTimeout(()=>{ const s=$$('section').filter(x=>x.textContent.indexOf(t('Lemari Washi Tape 🎀'))>=0)[0]; if(s) s.scrollIntoView({behavior:'smooth',block:'center'}); },120); break;

    case 'wear': {
      db.washi[d.slot]=d.id; save(); render();
      const w=WMAP[d.id];
      toast(LANG==='en' ? (wName(w)+' is on your '+(d.slot==='goal'?'fund cards':'main card')+' 🎀')
                        : ('Motif '+wName(w)+' dipasang di '+(d.slot==='goal'?'kartu celengan':'kartu utama')+' 🎀'));
      break;
    }
    case 'wear-washi': {
      db.washi.main=d.id; save(); closeSheet();
      if(!flushQueue()) render();
      toast(tf('Motif {0} udah dipasang di kartu utama 🎀',wName(WMAP[d.id])));
      break;
    }

    case 'kitty': catPickerSheet(); break;

    /* ---- reset bertingkat ---- */
    case 'reset-open': resetSheet(); break;
    case 'reset-month-ask':
      sheet('<div class="text-center pb-2">'+
        '<div class="inline-block mb-3">'+stk('spiral-calendar',{size:72,ic:44,tone:'#F7E7B8',rot:-4,fb:'📅'})+'</div>'+
        '<h2 class="hand font-bold text-[20px] mb-1">'+esc(tf('Yakin reset {0}? 🥺',mkLabel(mkNow())))+'</h2>'+
        '<p class="text-[13px] text-soft mb-5 px-3">'+t('Catatan jajan dan amplop bulan ini bakal hilang. Celenganmu tetap utuh.')+'</p>'+
        '<div class="flex gap-2">'+
          '<button data-act="close" class="flex-1 py-3.5 rounded-2xl bg-white hand font-bold text-[15px]" style="border:2.5px solid #F3E7EA;box-shadow:0 3px 0 #FBF0F4">'+t('Nggak jadi')+'</button>'+
          '<button data-act="reset-month-ok" class="flex-1 py-3.5 rounded-2xl hand font-bold text-[15px]" style="background:#F7E7B8;box-shadow:0 4px 0 #EFDFB4">'+t('Iya, reset bulan ini')+'</button>'+
        '</div></div>');
      break;
    case 'reset-month-ok': {
      const mk=mkNow();
      db.months[mk]=blankMonth();                       /* transaksi + pemasukan */
      ENVS.forEach(e=>{ db.env[e.k].pct=e.def; db.env[e.k].nom=null; });
      delete db.dayLimit[today()];
      /* tagihan berulang boleh jalan lagi bulan ini */
      (db.recurring||[]).forEach(r=>{ if(r.lastRun===mk) r.lastRun=''; });
      filterReset();
      save(); closeSheet(); render();
      toast(tf('Bulan {0} udah dikosongkan 🌱',mkLabel(mk))); break;
    }
    case 'reset-all-ask': 
    case 'set-kitty':
      db.profile.cat=d.id; save(); closeSheet(); render();
      toast(tf('{0} pindah ke kamar barunya 🐾',catKind(d.id).n)); break;
    /* ---- filter & pencarian ---- */
    case 'fcat': ui.fcat = (ui.fcat===d.k ? '' : d.k); render(); break;
    case 'q-clear': filterReset(); render(); break;

    /* ---- tagihan berulang ---- */
    case 'rec-open': recurringSheet(); break;
    case 'rec-add': recAdd(); save(); recurringSheet(); break;
    case 'rec-del': recDel(d.id); save(); recurringSheet(); break;
    case 'rec-toggle': {
      const r=recFind(d.id); if(!r) break;
      r.active=!r.active; save(); recurringSheet(); break;
    }

    /* ---- ekspor CSV ---- */
    case 'export-csv': {
      const mk=mkNow();
      try{
        const blobCsv=new Blob([monthCsv(mk)],{type:'text/csv;charset=utf-8'});
        const u=URL.createObjectURL(blobCsv);
        const a2=document.createElement('a'); a2.href=u; a2.download=csvFilename(mk);
        document.body.appendChild(a2); a2.click(); a2.remove();
        setTimeout(()=>URL.revokeObjectURL(u),4000);
        toast(tf('Rekap {0} diekspor ke CSV 📄',mkLabel(mk)));
      }catch(e){ toast(t('Yah, gagal keunduh 🥲')); }
      break;
    }

    /* ---- akun cloud ---- */
    case 'cloud-in': {
      Promise.resolve(CloudAdapter.signIn()).then(()=>{
        DS.use('cloud');
        return hydrateFromCloud(next=>{ setDb(next); render(); });
      }).then(()=>{ closeSheet(); render(); toast(t('Yeay, data kamu balik lagi 💕')); })
        .catch(e=>toast(t('Sinkron cloud belum disetel. Isi kunci Supabase di src/data-service.js dulu.')));
      break;
    }
    case 'cloud-out': {
      Promise.resolve(CloudAdapter.signOut()).then(()=>{
        DS.use('local'); closeSheet(); settingsSheet();
      }).catch(()=>{});
      break;
    }

    case 'edit-limit': limitSheet(); break;
    case 'limit-save': {
      const v=num(digits($('#la')?$('#la').value:''));
      if(v<=0){ toast(t('Eh, nominalnya belum diisi 🥺')); return; }
      db.dayLimit[today()]=v; save(); closeSheet(); render();
      toast(tf('Limit hari ini jadi {0} ✨',rp(v))); break;
    }
    case 'limit-auto': delete db.dayLimit[today()]; save(); closeSheet(); render(); toast(t('Balik ke limit otomatis ✨')); break;
    case 'autosplit': {
      ENVS.forEach(e=>{ db.env[e.k].pct=e.def; db.env[e.k].nom=null; });
      save(); render(); toast(t('Amplop udah dibagi 50/30/20 ✨')); break;
    }
    case 'fab': ui.quick.amount=''; quickSheet(); break;
    case 'pick-cat': {
      ui.quick.cat=d.k;
      const cur=$('#qa'); ui.quick.amount=cur?digits(cur.value):'';
      const dt=$('#qd')?$('#qd').value:'', nt=$('#qn')?$('#qn').value:'';
      quickSheet();
      setTimeout(()=>{ if($('#qd')&&dt) $('#qd').value=dt; if($('#qn')&&nt) $('#qn').value=nt; },0);
      break;
    }
    case 'qplus': { const i=$('#qa'); if(i){ i.value=fmt(num(digits(i.value))+num(d.v)); i.focus(); } break; }
    /* chip kebiasaan: set langsung, bukan menambah */
    case 'qset': { const i=$('#qa'); if(i){ i.value=fmt(sanitizeAmount(d.v)); i.focus(); } break; }
    case 'gplus': { const i=$('#ga'); if(i){ i.value=fmt(num(digits(i.value))+num(d.v)); i.focus(); } break; }

    case 'save-tx': {
      const amount=num(digits($('#qa')?$('#qa').value:''));
      if(amount<=0){ toast(t('Eh, nominalnya belum diisi 🥺')); return; }
      const date=($('#qd')&&$('#qd').value)||today();
      const note=($('#qn')&&$('#qn').value)||'';
      const mk=mkOf(date), lain=mk!==mkNow();
      MO(mk).tx.push({id:uid(),date,cat:ui.quick.cat,amount,note,h:new Date().getHours()});
      if(new Date().getHours()<9) db.stats.pagi=true;
      if(spentOn(date)>0&&spentOn(date)<=25000) db.stats.iritDay=true;
      const grew=touchStreak();
      collectRewards();
      ui.hmk=mk; ui.histLvl=lain?2:0;   /* biar catatan baru langsung kelihatan */
      save(); closeSheet(); render();
      const c=catOf(ui.quick.cat);
      if(!flushQueue()){
        const pesan=grew?tf('Streak kamu jadi {0} hari nih. Rajin banget sih! 🔥',db.streak.count)
                        :tf('Sip, jajanmu udah dicatat! Tetep stay on budget ya~ 🌸 Sisa jatah hari ini {0}.',rp(Math.max(0,allowance()-spentOn(today()))));
        celebrate(tf('Noted! {0} buat {1}',rp(amount),cName(c).toLowerCase()),
          lain?tf('Catatan ini masuk ke {0}. Cek di tab Rekap ya 📊',mkLabel(mk)):pesan,
          c.i, c.f, grew&&!lain);
      }
      break;
    }

    case 'add-inc': MO(mkNow()).income.push({id:uid(),date:today(),label:'',amount:0}); save(); render(); break;
    case 'del-inc': { const M=MO(mkNow()); M.income=M.income.filter(x=>x.id!==d.id); save(); render(); break; }
    case 'del-tx': {
      const M=MO(ui.tab==='recap'?ui.mk:(ui.hmk||mkNow()));
      const x2=M.tx.find(x=>x.id===d.id); if(!x2) break;
      if(x2.cat==='celengan'&&x2.goal){ const g=db.goals.find(x=>x.id===x2.goal); if(g) g.saved=Math.max(0,num(g.saved)-num(x2.amount)); }
      M.tx=M.tx.filter(x=>x.id!==d.id);
      save(); render(); break;
    }

    /* Pindahkan alokasi amplop celengan jadi setoran nyata,
       dibagi ke tiap celengan sesuai sisa kebutuhannya. */
    case 'setor-alokasi': {
      const mk=mkNow();
      const sisa=Math.max(0,envNom('save',sums(mk).masuk)-envSpent(mk,'save'));
      if(sisa<=0){ toast(t('Alokasi celengan sudah tersetor semua ✨')); break; }
      if(!db.goals.length){ toast(t('Belum ada celengan buat disetori')); break; }
      const butuh=db.goals.map(g=>Math.max(0,num(g.target)-num(g.saved)));
      const totalButuh=butuh.reduce((x,y)=>x+y,0);
      let terbagi=0, n=0;
      db.goals.forEach((g,i)=>{
        /* proporsional ke sisa kebutuhan; kalau semua sudah penuh, bagi rata */
        const bagian=totalButuh>0 ? Math.floor(sisa*butuh[i]/totalButuh/100)*100
                                  : Math.floor(sisa/db.goals.length/100)*100;
        if(bagian<=0) return;
        g.saved=sanitizeAmount(num(g.saved)+bagian);
        MO(mk).tx.push({id:uid(),date:today(),cat:'celengan',goal:g.id,amount:bagian,
          note:'Setor alokasi amplop',h:new Date().getHours()});
        terbagi+=bagian; n++;
      });
      if(!n){ toast(t('Alokasi celengan sudah tersetor semua ✨')); break; }
      collectRewards(); save(); render();
      if(!flushQueue()) toast(tf('{0} dibagi ke {1} celengan 💖',rp(terbagi),n));
      break;
    }

    case 'add-goal': {
      const used=db.goals.map(g=>g.e);
      const pick=GOAL_KINDS.filter(k=>used.indexOf(k.i)<0)[0]||GOAL_KINDS[db.goals.length%GOAL_KINDS.length];
      db.goals.push({id:uid(),name:'',e:pick.i,target:0,saved:0,tone:db.goals.length});
      collectRewards(); save(); render(); flushQueue(); break;
    }
    case 'del-goal': db.goals=db.goals.filter(g=>g.id!==d.id); if(db.goals.length<2) ui.sortMode=false; save(); render(); break;
    case 'sort-on': ui.sortMode=true; render(); window.scrollTo(0,0); break;
    case 'sort-done': ui.sortMode=false; save(); render(); toast(t('Urutan celengan udah kesimpen ✨')); break;
    case 'goal-up': case 'goal-down': {
      const i=db.goals.findIndex(g=>g.id===d.id); if(i<0) break;
      const j=a==='goal-up'?i-1:i+1;
      if(j<0||j>=db.goals.length) break;
      const tmp=db.goals[i]; db.goals[i]=db.goals[j]; db.goals[j]=tmp;
      save(); render(); break;
    }
    case 'goal-emoji': emojiSheet(d.id); break;
    case 'set-emoji': { const g=db.goals.find(x=>x.id===d.id); if(g) g.e=d.e; save(); closeSheet(); render(); break; }
    case 'fill-goal': fillGoalSheet(d.id); break;

    case 'save-fill': {
      const amount=num(digits($('#ga')?$('#ga').value:''));
      if(amount<=0){ toast(t('Mau nabung berapa nih? 💰')); return; }
      const g=db.goals.find(x=>x.id===d.id); if(!g) break;
      const before=num(g.target)>0?num(g.saved)/num(g.target)*100:0;
      g.saved=num(g.saved)+amount;
      MO(mkNow()).tx.push({id:uid(),date:today(),cat:'celengan',goal:g.id,amount,note:'Isi celengan '+(g.name||'impian'),h:new Date().getHours()});
      touchStreak(); collectRewards();
      save(); closeSheet(); render();
      const after=num(g.target)>0?num(g.saved)/num(g.target)*100:0;
      if(!flushQueue()){
        let pesan=tf('Selangkah lagi menuju {0}. Proud of you! 💖',g.name||t('Impian'));
        let icon='money-bag', fb='💰';
        if(after>=100){ pesan=tf('Celengan {0} udah full! Saatnya checkout 🎉',g.name||''); icon='party-popper'; fb='🎉'; }
        else if(before<50&&after>=50){ pesan=tf('Setengah jalan! Tinggal {0} lagi. Bisa banget kamu 💪',rpS(Math.max(0,num(g.target)-num(g.saved)))); icon='glowing-star'; fb='🌟'; }
        celebrate(tf('Gokil! Celenganmu nambah {0} 💖',rp(amount)),pesan,icon,fb,after>=50);
      }
      break;
    }

    case 'badge': badgeSheet(d.id); break;
    case 'share': storySheet(); break;
    case 'save-img': {
      const img=$('#storyImg'); if(!img) break;
      const blob0=dataURLtoBlob(img.src);
      const file0=new File([blob0],'pastels-story-'+today()+'.png',{type:'image/png'});
      /* di iPhone, unduhan blob cuma kebuka di tab baru. Lembar Share iOS
         punya "Save Image" jadi lebih pas buat simpan ke galeri. */
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                    (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1);
      if(isIOS && navigator.canShare && navigator.canShare({files:[file0]})){
        navigator.share({ files:[file0] }).catch(()=>toast(t('Tahan gambarnya terus pilih Save ya 🌸')));
        break;
      }
      try{
        const u=URL.createObjectURL(blob0);
        const a2=document.createElement('a'); a2.href=u; a2.download='pastels-story-'+today()+'.png';
        document.body.appendChild(a2); a2.click(); a2.remove();
        setTimeout(()=>URL.revokeObjectURL(u),4000);
        toast(t('Udah kesimpen! Cek galeri kamu 💕'));
      }catch(e){ toast(t('Tahan gambarnya terus pilih Save ya 🌸')); }
      break;
    }
    case 'share-img': {
      const img=$('#storyImg'); if(!img) break;
      const blob=dataURLtoBlob(img.src);
      const file=new File([blob],'pastels-story-'+today()+'.png',{type:'image/png'});
      if(navigator.canShare&&navigator.canShare({files:[file]})){
        navigator.share({files:[file],text:t('Lagi rajin catat jajan pakai Pastels 🎀')}).catch(()=>{});
      } else if(navigator.clipboard&&window.ClipboardItem){
        navigator.clipboard.write([new ClipboardItem({'image/png':blob})])
          .then(()=>toast(t('Udah kesalin! Tinggal paste 💕'))).catch(()=>toast(t('Tahan gambarnya terus pilih Copy ya 🌸')));
      } else toast(t('Tahan gambarnya terus pilih Share ya 🌸'));
      break;
    }

    case 'step': {
      const y=num(ui.mk.slice(0,4)); let m=num(ui.mk.slice(5,7))+num(d.d), yy=y;
      if(m<1){m=12;yy--;} if(m>12){m=1;yy++;}
      ui.mk=yy+'-'+pad2(m); render(); break;
    }

    case 'set-ava': db.profile.ava=d.e; save(); closeSheet(); render(); settingsSheet(); break;
    case 'export': {
      try{
        const b=new Blob([JSON.stringify(db,null,2)],{type:'application/json'});
        const u=URL.createObjectURL(b);
        const a2=document.createElement('a'); a2.href=u; a2.download='pastels-backup-'+today()+'.json';
        document.body.appendChild(a2); a2.click(); a2.remove();
        setTimeout(()=>URL.revokeObjectURL(u),4000);
        toast(t('Backup-nya udah keunduh 💾'));
      }catch(e){ toast(t('Yah, gagal keunduh 🥲')); }
      break;
    }
    case 'import': $('#importFile').click(); break;
      sheet('<div class="text-center pb-2">'+
        '<div class="inline-block mb-3">'+stk('pleading-face',{size:76,ic:46,tone:'#FFD9E4',rot:-4,fb:'🥺'})+'</div>'+
        '<h2 class="hand font-bold text-[20px] mb-1">'+t('Yakin mau reset semua? 🥺')+'</h2>'+
        '<p class="text-[13px] text-soft mb-5 px-3">'+t('Semua catatan, celengan, sama stiker kamu bakal hilang. Backup dulu kalau masih sayang.')+'</p>'+
        '<div class="flex gap-2">'+
          '<button data-act="close" class="flex-1 py-3.5 rounded-2xl bg-white hand font-bold text-[15px]" style="border:2.5px solid #F3E7EA;box-shadow:0 3px 0 #FBF0F4">'+t('Nggak jadi')+'</button>'+
          '<button data-act="reset-ok" class="flex-1 py-3.5 rounded-2xl hand font-bold text-[15px]" style="background:#FFC0D3;box-shadow:0 4px 0 #FFAEC2">'+t('Iya, hapus')+'</button>'+
        '</div></div>');
      break;
    case 'reset-ok':
      setDb(seed()); ui.mk=mkNow(); clearQueue(); collectRewards(); clearQueue();
      try{ localStorage.setItem(LSKEY,JSON.stringify(db)); }catch(e){}
      closeSheet(); render(); toast(t('Oke, mulai dari nol lagi 🌱')); break;
  }
});

/* ---------------- Input ---------------- */
document.addEventListener('input',function(ev){
  const el=ev.target; if(!el.dataset) return;
  if(el.dataset.money==='1'){
    const atEnd=el.selectionStart===el.value.length;
    const f=clampDigits(el.value)?fmt(clampDigits(el.value)):'';
    if(f!==el.value){ el.value=f; if(atEnd){ try{ el.setSelectionRange(f.length,f.length); }catch(e){} } }
  }
  const field=el.dataset.field; if(!field) return;
  const v=el.dataset.money==='1'?sanitizeAmount(el.value):el.value;
  const p=field.split(':');
  if(p[0]==='q'){
    ui.q=el.value;
    /* render ulang ditunda, lalu fokus & caret dikembalikan ke kotak cari
       supaya mengetik tidak terputus */
    clearTimeout(qTimer);
    qTimer=setTimeout(()=>{
      const pos=el.selectionStart;
      render();
      const box=$('#qbox');
      if(box){ box.focus(); try{ box.setSelectionRange(pos,pos); }catch(e){} }
    },260);
    return;
  }
  if(p[0]==='rec'){
    const r=recFind(p[1]); if(!r) return;
    if(p[2]==='amount') r.amount=sanitizeAmount(el.value);
    else if(p[2]==='day') r.day=clamp(num(digits(el.value))||1,1,28);
    else if(p[2]==='label') r.label=String(v).slice(0,60);
    else if(p[2]==='cat') r.cat=v;
    save(); return;
  }
  if(p[0]==='env'){
    const e=db.env[p[1]]; if(!e) return;
    if(p[2]==='pct'){
      e.pct=clamp(num(digits(el.value)),0,100); e.nom=null;
      /* Dua amplop lain disesuaikan proporsional supaya total selalu 100%.
         Catatan: permintaan awalnya "kosongkan yang lain jadi 0", tapi itu
         membuat pengisian kedua menghapus yang pertama — tidak akan pernah
         bisa mengisi ketiganya. Auto-balance mencapai tujuan yang sama
         (total tak pernah lewat 100) tanpa masalah itu. */
      const lain=ENVS.filter(x=>x.k!==p[1]);
      const sisa=100-e.pct;
      const jum=lain.reduce((s2,x)=>s2+num(db.env[x.k].pct),0);
      lain.forEach((x,idx)=>{
        const en=db.env[x.k];
        en.nom=null;
        en.pct = jum>0 ? Math.round(sisa*num(en.pct)/jum)
                       : (idx===0 ? sisa : 0);
      });
      /* bulatkan selisih pembulatan ke amplop terakhir */
      const total=ENVS.reduce((s2,x)=>s2+num(db.env[x.k].pct),0);
      if(total!==100 && lain.length) db.env[lain[lain.length-1].k].pct += (100-total);
    }
    else { e.nom=sanitizeAmount(el.value); }
    save(); refreshEnv(el); return;
  }
  if(p[0]==='catenv'){
    if(!db.catEnv) db.catEnv={};
    db.catEnv[p[1]]=v;
    save(); render();
    const c=CATS.filter(x=>x.k===p[1])[0], e2=ENVS.filter(x=>x.k===v)[0];
    if(c&&e2) toast(tf('Kategori {0} pindah ke amplop {1}',cName(c),LANG==='en'?e2.en:e2.n));
    return;
  }
  else if(p[0]==='inc'){ const r=MO(mkNow()).income.find(x=>x.id===p[1]); if(r) r[p[2]]=p[2]==='amount'?num(v):v; }
  else if(p[0]==='goal'){ const g=db.goals.find(x=>x.id===p[1]); if(g) g[p[2]]=(p[2]==='name')?v:num(v); }
  else if(p[0]==='name'){ db.profile.name=v; }
  save(); refresh();
});
document.addEventListener('focusout',function(ev){
  const el=ev.target;
  if(el.dataset&&el.dataset.money==='1'&&el.dataset.field) el.value=fmt(num(digits(el.value)));
},true);
document.addEventListener('change',function(ev){
  const el=ev.target;
  if(el.dataset && el.dataset.field && el.dataset.field.indexOf('rec:')===0){
    const p=el.dataset.field.split(':'), r=recFind(p[1]);
    if(r && p[2]==='cat'){ r.cat=el.value; save(); recurringSheet(); }
    return;
  }
  if(el.id==='importFile'&&el.files&&el.files[0]){
    const r=new FileReader();
    r.onload=function(){
      const res=safeParseBackup(r.result);
      if(!res.ok){
        /* sebutkan alasannya, jangan cuma "gagal" — pengguna butuh tahu
           apakah salah pilih berkas atau berkasnya memang rusak */
        toast(tf('Backup gagal dipulihkan: {0}',res.error));
        el.value=''; return;
      }
      const cadangan=db;                       /* simpan yang lama dulu */
      try{
        setDb(migrate(res.data)); ui.mk=mkNow(); filterReset();
        save();
        closeSheet(); render(); toast(t('Yeay, data kamu balik lagi 💕'));
      }catch(e){
        setDb(cadangan); render();             /* kembalikan kalau migrasi gagal */
        toast(tf('Backup gagal dipulihkan: {0}',String(e&&e.message||e)));
      }
      el.value='';
    };
    r.onerror=function(){ toast(t('Yah, filenya gagal kebaca 🥲')); el.value=''; };
    r.readAsText(el.files[0]);
  }
});
document.addEventListener('keydown',function(ev){
  if(ev.key==='Enter'&&ev.target.tagName==='INPUT'&&ev.target.type!=='date'){ ev.preventDefault(); ev.target.blur(); }
  if(ev.key==='Escape'&&!$('#modal').classList.contains('hidden')) closeSheet();
});
