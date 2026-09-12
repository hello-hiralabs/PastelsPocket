/* =========================================================
   BUILD — gabungkan modul ES6 jadi satu index.html
   ---------------------------------------------------------
   Urutan modul sudah topologis, jadi penggabungan cukup
   membuang baris import/export lalu menyambung isinya.
   Jalankan: node build.mjs
   ========================================================= */
import fs from 'fs';
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

const bundle = '(function(){\n"use strict";\n\n' + chunks.join('\n') + '\n})();\n';
const out = shell.replace('/*__BUNDLE__*/', () => bundle);

if(out === shell) throw new Error('penanda /*__BUNDLE__*/ tidak ditemukan di shell.html');
fs.writeFileSync('index.html', out);
console.log('index.html dibangun:', (out.length/1024).toFixed(0)+' KB ·',
  ORDER.length, 'modul ·', bundle.split('\n').length, 'baris JS');
