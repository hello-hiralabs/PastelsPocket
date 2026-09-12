/* =========================================================
   BUILD — gabungkan modul ES6 jadi satu index.html
   ---------------------------------------------------------
   Urutan modul sudah topologis, jadi penggabungan cukup
   membuang baris import/export lalu menyambung isinya.
   Jalankan: node build.mjs
   ========================================================= */
import fs from 'fs';
import { execSync } from 'child_process';
import { ORDER } from './modules.mjs';

const shell = fs.readFileSync('shell.html','utf8');

const chunks = ORDER.map(p => {
  let s = fs.readFileSync(p,'utf8');
  s = s.replace(/^import\s+\{[^}]*\}\s+from\s+['"][^'"]+['"];?[^\n]*$/gm,'')
       .replace(/^import\s+['"][^'"]+['"];?[^\n]*$/gm,'')
       .replace(/^export\s+(?=(?:async\s+)?(?:function|const|let|var|class)\s)/gm,'')
       .replace(/^export\s*\{[^}]*\};?\s*$/gm,'');
  return '/* ======== ' + p + ' ======== */\n' + s.trim() + '\n';
});

let bundle = '(function(){\n"use strict";\n\n' + chunks.join('\n') + '\n})();\n';

/* Penjaga wajib: satu saja '</script' di dalam kode — bahkan di dalam
   komentar — akan menutup tag <script> pembungkus, dan sisa berkas
   dirender sebagai teks biasa. Escape dulu sebelum ditempel. */
const bocor = (bundle.match(/<\/script/gi) || []).length;
if(bocor){
  bundle = bundle.replace(/<\/script/gi, '<\\/script');
  console.warn('  penjaga: ' + bocor + " penutup '</script' di-escape");
}
/* ---- Tailwind dikompilasi, bukan lewat CDN ----
   Menghilangkan FOUC (halaman tidak lagi tampil tanpa gaya sesaat)
   dan membuat aplikasi bisa jalan penuh tanpa jaringan. */
execSync('npx tailwindcss -c tailwind.config.js -i tw-input.css -o .tw-out.css --minify',
  { stdio: ['ignore','ignore','inherit'] });
const tw = fs.readFileSync('.tw-out.css','utf8');
console.log('  tailwind:', (tw.length/1024).toFixed(0)+' KB terkompilasi');

let out = shell.replace('/*__BUNDLE__*/', () => bundle);
out = out.replace('/*__TAILWIND__*/', () => tw);
if(out.indexOf('/*__TAILWIND__*/') >= 0) throw new Error('penanda tailwind tidak tergantikan');

if(out === shell) throw new Error('penanda /*__BUNDLE__*/ tidak ditemukan di shell.html');
fs.writeFileSync('index.html', out);

/* berkas pendamping PWA ikut disalin ke akar supaya bisa diunggah bersama */
for(const f of ['manifest.webmanifest','sw.js','icon-192.png','icon-512.png']){
  if(!fs.existsSync(f)) console.warn('  ! berkas PWA hilang:', f);
}
console.log('index.html dibangun:', (out.length/1024).toFixed(0)+' KB ·',
  ORDER.length, 'modul ·', bundle.split('\n').length, 'baris JS');
