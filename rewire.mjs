/* Hitung ulang seluruh import/export dari tabel simbol.
   Dipakai setiap kali modul diedit, jadi tidak ada import
   yang tertinggal atau menggantung. */
import fs from 'fs'; import path from 'path';


import { ORDER } from './modules.mjs';

const strip = s => s.replace(/^import\s+\{[^}]*\}\s+from\s+['"][^'"]+['"];?[^\n]*$/gm,'')
                    .replace(/^import\s+['"][^'"]+['"];?[^\n]*$/gm,'');

/* Salinan khusus pemindaian: komentar dan literal string dibuang.
   Tanpa ini, nama modul yang cuma disebut di komentar ("lihat CATS")
   atau di dalam teks kamus ikut terdeteksi sebagai pemakaian nyata. */
const scanSrc = s => s
  .replace(/\/\*[\s\S]*?\*\//g, ' ')
  .replace(/(^|[^:])\/\/[^\n]*/g, '$1 ')
  .replace(/'(?:\\.|[^'\\])*'/g, "''")
  .replace(/"(?:\\.|[^"\\])*"/g, '""')
  .replace(/`(?:\\.|[^`\\])*`/g, '``');
const DECL = /^export\s+(?:async\s+)?(?:function|const|let|var|class)\s+([A-Za-z_$][\w$]*)/gm;

const bodies = {}, owner = {};
for(const p of ORDER){
  const raw = fs.readFileSync(p,'utf8');
  bodies[p] = strip(raw).replace(/^\n+/,'');
  for(const m of bodies[p].matchAll(DECL)) owner[m[1]] = owner[m[1]] || p;
}
const rel = (from,to)=>{ const r = path.relative(path.dirname(from),to).split(path.sep).join('/');
  return r.startsWith('.') ? r : './'+r; };

let total=0;
for(const p of ORDER){
  const body = bodies[p], scan = scanSrc(body), need = {};
  for(const [name,own] of Object.entries(owner)){
    if(own===p) continue;
    if(new RegExp('(?<![\\w$.])'+name.replace(/[$]/g,'\\$')+'(?![\\w$])').test(scan))
      (need[own]=need[own]||[]).push(name);
  }
  const lines = ORDER.filter(s=>need[s])
    .map(s=>`import { ${need[s].sort().join(', ')} } from '${rel(p,s)}';`);
  if(p==='src/app.js') lines.push("import './actions.js';");
  total += lines.length;
  fs.writeFileSync(p, (lines.length? lines.join('\n')+'\n\n' : '') + body);
}
console.log('import ditulis ulang:', total, 'baris di', ORDER.length, 'modul');
