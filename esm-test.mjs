/* Jalankan graf modul ES6 yang asli (bukan hasil bundle).
   Import yang kurang akan muncul sebagai ReferenceError di sini,
   sementara di bundle tidak ketahuan karena urutannya sudah benar. */
import fs from 'fs';
import { JSDOM, VirtualConsole } from 'jsdom';

const html = fs.readFileSync('shell.html','utf8');
const errs = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => { if(!/tailwind|scrollTo|Not implemented/.test(e.message)) errs.push(e.message); });

const dom = new JSDOM(html, { url:'https://x.test/', pretendToBeVisual:true, virtualConsole:vc });
const w = dom.window;
w.HTMLCanvasElement.prototype.getContext = function(){ return new Proxy({}, { get:(t,p)=>{
  if(p==='measureText') return ()=>({width:80});
  if(p==='createLinearGradient') return ()=>({addColorStop(){}});
  return ()=>{}; } }); };
w.HTMLCanvasElement.prototype.toDataURL = () => 'data:image/png;base64,iVBORw0KGgo=';
w.Element.prototype.scrollIntoView = function(){};

for(const k of ['document','localStorage','performance','Blob','URL','File',
                'requestAnimationFrame','cancelAnimationFrame','matchMedia','atob','Image','Event','MouseEvent',
                'getComputedStyle','HTMLCanvasElement','FileReader','Element','ClipboardItem'])
  if(w[k] !== undefined){ try{ globalThis[k] = w[k]; }catch(e){ Object.defineProperty(globalThis,k,{value:w[k],configurable:true}); } }
Object.defineProperty(globalThis,'navigator',{value:w.navigator,configurable:true});
globalThis.window = w;

try{
  await import('./src/app.js');
}catch(e){
  console.log('GAGAL IMPORT:', e && e.message);
  console.log((e && e.stack || '').split('\n').slice(1,5).join('\n'));
  process.exit(1);
}
await new Promise(r => setTimeout(r, 500));

const d = w.document;
const view = d.querySelector('#view').innerHTML.length;
console.log('graf modul jalan · #view terisi', view, 'karakter');
console.log('nav:', [...d.querySelectorAll('.navlab')].map(e=>e.textContent).join('/'));
console.log('adegan kucing:', !!d.querySelector('[data-live="scene"] svg'));
console.log('bilah filter  :', !!d.querySelector('#qbox'));
console.log('galat:', errs.length ? errs.slice(0,3) : 'tidak ada');
if(view < 500 || errs.length) process.exit(1);
