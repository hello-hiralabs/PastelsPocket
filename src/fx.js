import { $ } from './utils.js';

/* =========================================================
   7. CONFETTI
   ========================================================= */
export let confRAF=null;
export function heartPath(x,s){
  x.beginPath(); x.moveTo(0,s*.32);
  x.bezierCurveTo(0,s*.05,-s*.5,-s*.1,-s*.5,-s*.35);
  x.bezierCurveTo(-s*.5,-s*.68,-s*.12,-s*.7,0,-s*.42);
  x.bezierCurveTo(s*.12,-s*.7,s*.5,-s*.68,s*.5,-s*.35);
  x.bezierCurveTo(s*.5,-s*.1,0,s*.05,0,s*.32);
  x.closePath();
}
export function starPath(x,s){
  x.beginPath();
  for(let i=0;i<10;i++){
    const r=(i%2?s*.22:s*.55), a=(Math.PI/5)*i-Math.PI/2;
    const px=Math.cos(a)*r, py=Math.sin(a)*r;
    i?x.lineTo(px,py):x.moveTo(px,py);
  }
  x.closePath();
}
export function confetti(strong){
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cv=$('#confetti'), x=cv.getContext('2d');
  const dpr=Math.min(window.devicePixelRatio||1,2), W=window.innerWidth, H=window.innerHeight;
  cv.width=W*dpr; cv.height=H*dpr; cv.style.width=W+'px'; cv.style.height=H+'px';
  x.setTransform(dpr,0,0,dpr,0,0); cv.classList.remove('hidden');
  const cols=['#FF9EAA','#FFC0D3','#A3C79B','#F5D96B','#E8D8E8','#93AEC2','#FFFFFF','#F2D7B6'];
  const N=strong?120:72, P=[];
  for(let i=0;i<N;i++){
    const r=Math.random();
    P.push({ x:W*(.14+Math.random()*.72), y:H*(.34+Math.random()*.12),
      vx:(Math.random()-.5)*8, vy:-(6+Math.random()*8.5), g:.27+Math.random()*.12,
      s:9+Math.random()*11, r:Math.random()*6.28, vr:(Math.random()-.5)*.3,
      c:cols[(Math.random()*cols.length)|0], shape: r<.34?'heart':(r<.6?'star':'tape') });
  }
  const t0=performance.now();
  cancelAnimationFrame(confRAF);
  (function frame(tm){
    const el=tm-t0;
    x.clearRect(0,0,W,H);
    P.forEach(p=>{
      p.vy+=p.g; p.x+=p.vx; p.y+=p.vy; p.r+=p.vr; p.vx*=.995;
      const a=el>1250?Math.max(0,1-(el-1250)/720):1;
      x.save(); x.globalAlpha=a; x.translate(p.x,p.y); x.rotate(p.r); x.fillStyle=p.c;
      if(p.shape==='heart') heartPath(x,p.s);
      else if(p.shape==='star') starPath(x,p.s);
      else { x.beginPath(); x.rect(-p.s*.3,-p.s*.5,p.s*.6,p.s); }
      x.fill(); x.restore();
    });
    if(el<2000) confRAF=requestAnimationFrame(frame);
    else { x.clearRect(0,0,W,H); cv.classList.add('hidden'); }
  })(t0);
}
