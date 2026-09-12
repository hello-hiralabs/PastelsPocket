import { BULAN, QUOTES, t, tf } from './i18n.js';
import { WASHI, WMAP } from './constants.js';
import { mkNow, num, rp, rpS, today } from './utils.js';
import { db } from './state.js';
import { allowance, spentOn, sums, wantsLeft } from './calc.js';
import { sheet } from './sheet.js';

/* =========================================================
   16. STORY CARD 9:16
   ========================================================= */
export function buildStoryCanvas(){
  const W=1080, H=1920;
  const cv=document.createElement('canvas'); cv.width=W; cv.height=H;
  const x=cv.getContext('2d');
  const HD=(w,s)=>w+' '+s+'px "Shantell Sans", cursive';
  const PJ=(w,s)=>w+' '+s+'px "Plus Jakarta Sans", sans-serif';
  const rr=(a,b,w,h,r)=>{x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath();};
  const heart=(cx,cy,s,col,rot)=>{
    x.save(); x.translate(cx,cy); x.rotate(rot||0); x.fillStyle=col;
    x.beginPath(); x.moveTo(0,s*.32);
    x.bezierCurveTo(0,s*.05,-s*.5,-s*.1,-s*.5,-s*.35);
    x.bezierCurveTo(-s*.5,-s*.68,-s*.12,-s*.7,0,-s*.42);
    x.bezierCurveTo(s*.12,-s*.7,s*.5,-s*.68,s*.5,-s*.35);
    x.bezierCurveTo(s*.5,-s*.1,0,s*.05,0,s*.32);
    x.closePath(); x.fill(); x.restore();
  };
  const star=(cx,cy,s,col,rot)=>{
    x.save(); x.translate(cx,cy); x.rotate(rot||0); x.fillStyle=col;
    x.beginPath();
    for(let i=0;i<10;i++){ const r=(i%2?s*.4:s), a=(Math.PI/5)*i-Math.PI/2;
      const px=Math.cos(a)*r, py=Math.sin(a)*r; i?x.lineTo(px,py):x.moveTo(px,py); }
    x.closePath(); x.fill(); x.restore();
  };
  const flower=(cx,cy,s,col,mid)=>{
    x.save(); x.translate(cx,cy); x.fillStyle=col;
    for(let i=0;i<5;i++){ x.save(); x.rotate(i*Math.PI*2/5);
      x.beginPath(); x.ellipse(0,-s*.62,s*.34,s*.6,0,0,6.29); x.fill(); x.restore(); }
    x.fillStyle=mid; x.beginPath(); x.arc(0,0,s*.28,0,6.29); x.fill(); x.restore();
  };

  /* kertas jurnal */
  x.fillStyle='#FFFDF9'; x.fillRect(0,0,W,H);
  const glow=x.createLinearGradient(0,0,W,H);
  glow.addColorStop(0,'rgba(255,192,211,.42)'); glow.addColorStop(.5,'rgba(255,243,205,.45)'); glow.addColorStop(1,'rgba(226,240,217,.55)');
  x.fillStyle=glow; x.fillRect(0,0,W,H);
  /* polka dot */
  x.fillStyle='rgba(255,176,199,.26)';
  for(let py=30;py<H;py+=44) for(let px=(Math.round(py/44)%2?22:0)+16;px<W;px+=44){ x.beginPath(); x.arc(px,py,4,0,6.29); x.fill(); }
  /* garis binder + margin + lubang jilid */
  x.strokeStyle='rgba(232,216,232,.60)'; x.lineWidth=2.5;
  for(let ly=300; ly<H-140; ly+=58){ x.beginPath(); x.moveTo(150,ly); x.lineTo(W-70,ly); x.stroke(); }
  x.strokeStyle='rgba(255,192,211,.75)'; x.lineWidth=3;
  x.beginPath(); x.moveTo(150,180); x.lineTo(150,H-120); x.stroke();
  [430,960,1490].forEach(hy=>{
    x.fillStyle='#FFF7F9'; x.beginPath(); x.arc(86,hy,26,0,6.29); x.fill();
    x.strokeStyle='rgba(255,176,199,.55)'; x.lineWidth=3.5; x.stroke();
  });

  /* washi tape miring sesuai motif pilihan */
  const w=WMAP[db.washi.main]||WASHI[0];
  const drawTape=(cx,cy,tw,th,rot)=>{
    x.save(); x.translate(cx,cy); x.rotate(rot);
    x.fillStyle=w.tone; x.globalAlpha=.92; x.fillRect(-tw/2,-th/2,tw,th);
    x.globalAlpha=1;
    x.save(); x.beginPath(); x.rect(-tw/2,-th/2,tw,th); x.clip();
    if(w.pat==='stripe'){ x.fillStyle='rgba(255,255,255,.6)';
      for(let i=-tw;i<tw;i+=26){ x.save(); x.translate(i,0); x.rotate(-.7); x.fillRect(0,-th,11,th*3); x.restore(); } }
    else if(w.pat==='grid'){ x.strokeStyle='rgba(255,255,255,.75)'; x.lineWidth=3;
      for(let i=-tw/2;i<tw/2;i+=22){ x.beginPath(); x.moveTo(i,-th/2); x.lineTo(i,th/2); x.stroke(); }
      for(let j=-th/2;j<th/2;j+=22){ x.beginPath(); x.moveTo(-tw/2,j); x.lineTo(tw/2,j); x.stroke(); } }
    else { x.fillStyle='rgba(255,255,255,.72)';
      for(let i=-tw/2;i<tw/2;i+=30) for(let j=-th/2;j<th/2;j+=30){ x.beginPath(); x.arc(i+15,j+15,6,0,6.29); x.fill(); } }
    x.restore();
    x.fillStyle='rgba(255,255,255,.35)'; x.fillRect(-tw/2,-th/2,tw,6);
    x.restore();
  };
  drawTape(540,168,540,86,-0.055);
  drawTape(958,268,200,52,0.42);

  /* stiker kawaii di pojok */
  heart(120,206,86,'#FFB7C6',-0.22);
  star(986,1064,52,'#F5D96B',0.2);
  flower(112,1706,70,'#FFB9CC','#F5D96B');
  heart(972,1748,66,'#CDE6D5',0.3);
  star(148,1006,38,'#E3D2EC',-0.3);

  const s=sums(mkNow()), jatah=allowance(), spent=spentOn(today());
  const left=Math.max(0,jatah-spent);
  const d=new Date(), nama=db.profile.name||t('Bestie');

  /* judul jurnal */
  x.textAlign='center';
  x.fillStyle='#5A4E4D'; x.font=HD(700,64);
  x.fillText(t('Jurnal Jajan Harianku ✨'),556,262);
  x.fillStyle='#B79FAC'; x.font=PJ(600,38);
  x.fillText(d.getDate()+' '+BULAN()[d.getMonth()]+' '+d.getFullYear(),556,326);

  /* wajah kawaii */
  const fx=556, fy=520, fr=104;
  const over=spent>jatah, tight=!over&&spent>jatah*.75;
  x.fillStyle=over?'#FFCFD8':(tight?'#FCE9B8':'#D3E7C6');
  x.beginPath(); x.arc(fx,fy,fr,0,6.29); x.fill();
  x.strokeStyle='#fff'; x.lineWidth=11; x.stroke();
  x.fillStyle='#5A4E4D';
  x.beginPath(); x.arc(fx-36,fy-14,11,0,6.29); x.fill();
  x.beginPath(); x.arc(fx+36,fy-14,11,0,6.29); x.fill();
  x.fillStyle='rgba(255,158,178,.55)';
  x.beginPath(); x.ellipse(fx-62,fy+22,20,13,0,0,6.29); x.fill();
  x.beginPath(); x.ellipse(fx+62,fy+22,20,13,0,0,6.29); x.fill();
  x.strokeStyle='#5A4E4D'; x.lineWidth=8; x.lineCap='round'; x.beginPath();
  if(over) x.arc(fx,fy+62,30,Math.PI*1.15,Math.PI*1.85);
  else x.arc(fx,fy+26,30,Math.PI*.15,Math.PI*.85);
  x.stroke();

  /* angka utama */
  x.fillStyle='#8C7F7E'; x.font=HD(600,42); x.textAlign='center';
  x.fillText(t('jatah hari ini'),556,712);
  x.fillStyle='#FF8299'; x.font=PJ(800,124);
  x.fillText(rp(left),556,834);

  /* tiga kotak ringkasan */
  const box=(cx,cy,label,val,bg,br)=>{
    x.save(); x.shadowColor='rgba(190,130,155,.18)'; x.shadowBlur=18; x.shadowOffsetY=7;
    x.fillStyle=bg; rr(cx-142,cy,284,204,42); x.fill(); x.restore();
    x.strokeStyle=br; x.lineWidth=5; rr(cx-142,cy,284,204,42); x.stroke();
    x.fillStyle='#8C7F7E'; x.font=HD(600,31); x.textAlign='center'; x.fillText(label,cx,cy+70);
    x.fillStyle='#5A4E4D'; x.font=PJ(800,46); x.fillText(val,cx,cy+140);
  };
  box(258,904,t('total jajan kepake'),rpS(spent),'#FFF1F5','#FBD5E2');
  box(556,904,t('streak'),tf('🔥 {0} hari',num(db.streak.count)),'#FFF8DC','#F7E7B8');
  box(854,904,t('sisa dompet'),rpS(wantsLeft()),'#F1F8EC','#D3E7C6');

  /* kutipan */
  const q=QUOTES()[(d.getDate()+d.getMonth())%QUOTES().length];
  x.save(); x.translate(556,1330); x.rotate(-0.014);
  x.fillStyle='#FFF7D9'; rr(-390,-118,780,236,48); x.fill();
  x.strokeStyle='#F7E7B8'; x.lineWidth=5; rr(-390,-118,780,236,48); x.stroke();
  x.fillStyle='#7A6A62'; x.font=HD(600,41); x.textAlign='center';
  const words=q.split(' '); let line='', ly=-34;
  words.forEach(wd=>{ if(x.measureText(line+wd+' ').width>640){ x.fillText(line.trim(),0,ly); line=wd+' '; ly+=58; } else line+=wd+' '; });
  x.fillText(line.trim(),0,ly);
  x.restore();

  /* baris identitas + watermark */
  x.textAlign='center';
  x.fillStyle='#8C7F7E'; x.font=PJ(600,33);
  x.fillText(nama+' · '+tf('{0} Stiker Kekumpul',Object.keys(db.badges).length),556,1580);
  /* cap jempol kucing */
  x.save(); x.translate(900,1640); x.rotate(-.22); x.globalAlpha=.22; x.fillStyle='#A3C79B';
  x.beginPath(); x.ellipse(0,16,26,21,0,0,6.29); x.fill();
  [[-26,-9,10,12],[-12,-20,10,13],[8,-20,10,13],[22,-9,10,12]].forEach(t2=>{
    x.beginPath(); x.ellipse(t2[0],t2[1],t2[2],t2[3],0,0,6.29); x.fill(); });
  x.restore(); x.globalAlpha=1;
  x.fillStyle='#C9758A'; x.font=HD(700,36); x.textAlign='center';
  x.globalAlpha=.88; x.fillText(t('Logged with Pastels : Your Pocket Bestie 🌸'),556,1806); x.globalAlpha=1;
  return cv;
}
export async function storySheet(){
  try{ if(document.fonts&&document.fonts.ready) await document.fonts.ready; }catch(e){}
  const url=buildStoryCanvas().toDataURL('image/png');
  sheet(
    '<h2 class="hand font-bold text-[20px] mb-1">'+t('Kartu Story Kamu 📤')+'</h2>'+
    '<p class="text-[12.5px] text-soft mb-3">'+t('Ukurannya 9:16, pas banget buat IG Story atau TikTok 💕')+'</p>'+
    '<img id="storyImg" src="'+url+'" alt="Story card" class="w-full rounded-[24px] mb-2" style="border:2.5px solid #F3E7EA;box-shadow:0 4px 0 #FBF0F4">'+
    '<p class="text-[11.5px] text-soft text-center mb-3">'+t('Tahan gambarnya buat langsung save ke galeri.')+'</p>'+
    '<div class="grid grid-cols-2 gap-2 pb-1">'+
      '<button data-act="share-img" class="py-3.5 rounded-2xl bg-white hand font-bold text-[14.5px]" style="border:2.5px solid #F3E7EA;box-shadow:0 3px 0 #FBF0F4">'+t('Share')+'</button>'+
      '<button data-act="save-img" class="clay py-3.5 hand font-bold text-[15px]">'+t('Download PNG')+'</button>'+
    '</div>');
}
export function dataURLtoBlob(u){
  const p=u.split(','), b=atob(p[1]), n=b.length, arr=new Uint8Array(n);
  for(let i=0;i<n;i++) arr[i]=b.charCodeAt(i);
  return new Blob([arr],{type:'image/png'});
}
