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
/* ---- Tailwind: hasil kompilasi disimpan sebagai tw.css ----
   tw.css IKUT DISIMPAN di repositori. Artinya build tidak butuh
   npm install, tidak butuh jaringan, dan tidak bisa gagal karena
   paket yang belum terpasang.

   Kalau Tailwind CLI kebetulan tersedia (habis `npm install`),
   tw.css diperbarui dulu supaya kelas baru ikut terkompilasi.
   Kalau tidak ada, tw.css yang tersimpan dipakai apa adanya. */
const cli = 'node_modules/.bin/tailwindcss';
if(fs.existsSync(cli)){
  try{
    execSync(cli + ' -c tailwind.config.js -i tw-input.css -o tw.css --minify',
      { stdio: ['ignore','ignore','inherit'] });
    console.log('  tailwind: tw.css diperbarui dari sumber');
  }catch(e){
    console.warn('  tailwind: gagal memperbarui, pakai tw.css yang tersimpan');
  }
} else {
  console.log('  tailwind: pakai tw.css tersimpan (CLI tidak terpasang)');
}
if(!fs.existsSync('tw.css'))
  throw new Error('tw.css tidak ada. Jalankan `npm install` lalu `npm run build` sekali untuk membuatnya.');
const tw = fs.readFileSync('tw.css','utf8');
console.log('  tailwind:', (tw.length/1024).toFixed(0)+' KB');

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
