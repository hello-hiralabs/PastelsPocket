import { BULAN } from './i18n.js';

/* =========================================================
   3. UTIL
   ========================================================= */
export const $=(s,r)=>(r||document).querySelector(s);
export const $$=(s,r)=>Array.from((r||document).querySelectorAll(s));
export const uid=()=>Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-3);
export const num=v=>{const n=Number(v);return isFinite(n)?n:0;};
export const digits=s=>String(s==null?'':s).replace(/[^\d]/g,'');
export const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export const fmt=n=>new Intl.NumberFormat('id-ID').format(Math.round(num(n)));
export const rp=n=>(num(n)<0?'-Rp ':'Rp ')+fmt(Math.abs(n));
export const rpS=n=>{const a=Math.abs(num(n)),s=n<0?'-':'';
  if(a>=1e9)return s+'Rp '+(a/1e9).toFixed(1).replace('.',',')+'M';
  if(a>=1e6)return s+'Rp '+(a/1e6).toFixed(a>=1e7?0:1).replace('.',',')+'jt';
  if(a>=1e4)return s+'Rp '+Math.round(a/1e3)+'rb';
  return s+'Rp '+fmt(a);};
export const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
export const pad2=n=>String(n).padStart(2,'0');
export const iso=d=>d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate());
export const today=()=>iso(new Date());
export const mkNow=()=>today().slice(0,7);
export const mkOf=ds=>String(ds).slice(0,7);
export const mkLabel=mk=>BULAN()[num(mk.slice(5,7))-1]+' '+mk.slice(0,4);
export const daysIn=mk=>new Date(num(mk.slice(0,4)),num(mk.slice(5,7)),0).getDate();
export const round100=n=>Math.round(n/100)*100;
export const dayDiff=(a,b)=>Math.round((new Date(b+'T00:00:00')-new Date(a+'T00:00:00'))/86400000);
export const prettyDate=ds=>{const d=new Date(ds+'T00:00:00');return isNaN(d)?ds:(d.getDate()+' '+BULAN()[d.getMonth()]+' '+d.getFullYear());};

/* ---- stiker ikon ---- */
export const ROTS=[-4,2.5,-2,3.5,-3,1.5,4,-1.5,3,-2.5];
export let rotN=0;
export const nextRot=()=>ROTS[(rotN++)%ROTS.length];
export function stk(icon,o){
  o=o||{};
  const size=o.size||42, ic=o.ic||Math.round(size*0.56), tone=o.tone||'#FFD9E4';
  const r=(o.rot===undefined)?nextRot():o.rot;
  const radius=o.round?'999px':(size>=56?'20px':(size>=40?'16px':'13px'));
  return '<span class="stk '+(o.cls||'')+'" style="--tone:'+tone+';--rot:'+r+'deg;width:'+size+'px;height:'+size+'px;border-radius:'+radius+'">'+
    ico(icon,ic,o.fb)+'</span>';
}
export function ico(icon,size,fb){
  return '<iconify-icon icon="fluent-emoji-flat:'+icon+'" width="'+size+'" height="'+size+'"'+
    (fb?' data-fb="'+fb+'"':'')+' aria-hidden="true"></iconify-icon>';
}
export let fbTimer=null;
export function iconFallback(){
  clearTimeout(fbTimer);
  fbTimer=setTimeout(()=>{
    $$('iconify-icon').forEach(el=>{
      const sr=el.shadowRoot;
      if(sr && sr.childElementCount>0) return;
      const fb=el.getAttribute('data-fb'); if(!fb) return;
      const sp=document.createElement('span');
      sp.textContent=fb;
      sp.style.cssText='font-size:'+(el.getAttribute('width')||20)+'px;line-height:1;display:block';
      el.replaceWith(sp);
    });
  },2800);
}


/* tepi struk bergerigi · dir 1 = gigi ke atas, -1 = gigi ke bawah */
export function zig(dir){
  const n=24, step=100/n, h=3;
  let pts = dir>0 ? '0,'+h : '0,0';
  for(let i=0;i<n;i++){
    const x=i*step;
    pts += ' '+(x+step/2).toFixed(2)+','+(dir>0?0:h);
    pts += ' '+(x+step).toFixed(2)+','+(dir>0?h:0);
  }
  pts += dir>0 ? ' 100,'+h : ' 100,0';
  return '<svg viewBox="0 0 100 '+h+'" preserveAspectRatio="none" aria-hidden="true" '+
    'style="display:block;width:100%;height:9px"><polygon points="'+pts+'" fill="#FFFDF7"/></svg>';
}
/* cap jempol kucing */
export function pawStamp(size,color){
  const c=color||'#A3C79B';
  return '<svg viewBox="0 0 40 40" width="'+size+'" height="'+size+'" aria-hidden="true">'+
    '<ellipse cx="20" cy="26" rx="11" ry="9" fill="'+c+'"/>'+
    '<ellipse cx="9"  cy="15" rx="4.2" ry="5.2" fill="'+c+'"/>'+
    '<ellipse cx="16" cy="9"  rx="4.2" ry="5.4" fill="'+c+'"/>'+
    '<ellipse cx="24" cy="9"  rx="4.2" ry="5.4" fill="'+c+'"/>'+
    '<ellipse cx="31" cy="15" rx="4.2" ry="5.2" fill="'+c+'"/></svg>';
}


export let toastTimer=null;
export function toast(msg){
  $('#toast').innerHTML='<div class="pop px-4 py-2.5 rounded-full bg-white hand font-bold text-[14px]" style="border:2.5px solid #FFD9E4;box-shadow:0 4px 0 #FFE7EE,0 10px 20px rgba(190,140,165,.2)">'+esc(msg)+'</div>';
  $('#toast').classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>$('#toast').classList.add('hidden'),2600);
}

/* rotasi stiker di-reset tiap render supaya sudutnya stabil */
export function resetRot(){ rotN = 0; }

/* =========================================================
   SANITASI NOMINAL
   Batas 1 triliun. Di atas itu Number masih presisi, tapi
   Intl.NumberFormat jadi tidak enak dibaca di layar HP dan
   hampir pasti salah ketik.
   ========================================================= */
export const AMOUNT_MAX = 1e12;
export function sanitizeAmount(v){
  if(typeof v === 'number'){
    if(!isFinite(v)) return 0;
    return Math.min(Math.max(Math.round(v), 0), AMOUNT_MAX);
  }
  const d = String(v == null ? '' : v).replace(/[^\d]/g, '');
  if(!d) return 0;
  /* potong dari kiri: 15 digit sudah lewat batas, jangan sampai jadi Infinity */
  const n = Number(d.slice(0, 15));
  if(!isFinite(n)) return AMOUNT_MAX;
  return Math.min(n, AMOUNT_MAX);
}
/* dipakai oleh input: kembalikan string digit yang sudah dipangkas */
export function clampDigits(s){
  const d = String(s == null ? '' : s).replace(/[^\d]/g, '').replace(/^0+(?=\d)/, '');
  return d.slice(0, 13);
}

/* =========================================================
   PARSING BACKUP YANG AMAN
   JSON.parse melempar untuk teks rusak, tapi yang lebih sering
   terjadi adalah JSON valid dengan bentuk yang salah (misal
   file backup aplikasi lain). Keduanya harus ketahuan sebelum
   data pengguna ditimpa.
   ========================================================= */
export const BACKUP_MAX_BYTES = 8 * 1024 * 1024;

export function safeParseBackup(raw){
  if(typeof raw !== 'string' || !raw.trim())
    return { ok:false, code:'kosong', error:'Berkasnya kosong.' };
  if(raw.length > BACKUP_MAX_BYTES)
    return { ok:false, code:'kebesaran', error:'Berkasnya lebih dari 8 MB.' };

  let data;
  try{ data = JSON.parse(raw); }
  catch(e){
    const m = /position (\d+)/.exec(e.message || '');
    return { ok:false, code:'rusak',
      error:'Formatnya bukan JSON yang utuh' + (m ? ' (posisi ' + m[1] + ')' : '') + '.' };
  }
  if(!data || typeof data !== 'object' || Array.isArray(data))
    return { ok:false, code:'bukan-objek', error:'Isinya bukan objek data.' };

  /* tanda tangan minimal sebuah backup Pastels */
  const punyaBulan = data.months && typeof data.months === 'object' && !Array.isArray(data.months);
  const punyaProfil = data.profile && typeof data.profile === 'object';
  if(!punyaBulan && !punyaProfil)
    return { ok:false, code:'bukan-pastels', error:'Ini sepertinya bukan backup Pastels.' };

  if(punyaBulan){
    const kunci = Object.keys(data.months);
    const salah = kunci.filter(k => !/^\d{4}-\d{2}$/.test(k));
    if(salah.length)
      return { ok:false, code:'kunci-bulan',
        error:'Ada kunci bulan yang tidak wajar: ' + salah.slice(0,3).join(', ') + '.' };
  }
  return { ok:true, data:data };
}
