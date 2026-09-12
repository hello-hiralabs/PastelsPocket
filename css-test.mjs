/* =========================================================
   UJI CAKUPAN KELAS CSS
   ---------------------------------------------------------
   Setiap kelas yang dipakai di markup harus ada wujudnya:
   entah utility Tailwind hasil kompilasi, atau kelas kustom
   di <style>. Tanpa uji ini, kelas yang hilang tidak
   menimbulkan error apa pun — halaman cuma tampil salah,
   dan itu yang pernah terjadi pada .receipt dan .polaroid.
   ========================================================= */
import fs from 'fs';
import { ORDER } from './modules.mjs';

const html = fs.readFileSync('index.html','utf8');
const style = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m=>m[1]).join('\n');

/* kelas kustom yang dideklarasikan di stylesheet */
const kustom = new Set([...style.matchAll(/\.([a-zA-Z][\w-]*)/g)].map(m=>m[1]));

/* token kelas yang benar-benar dipakai di markup */
const tok = new Set();
for(const f of ORDER.concat(['shell.html'])){
  const s = fs.readFileSync(f,'utf8');
  for(const m of s.matchAll(/class="([^"]*)"/g))
    for(const t of m[1].split(/\s+/)){
      if(!t || t.includes('+') || t.includes("'") || t.includes('(') || t.includes('?') || t === ':' || t === '%') continue;
      tok.add(t);
    }
}
const esc = t => '.' + t.replace(/([\[\]\(\)#.,%!/:])/g, '\\$1');
const kurang = [...tok].filter(t => !kustom.has(t) && !style.includes(esc(t)) && !style.includes('.'+t)).sort();

console.log('token kelas dipakai :', tok.size);
console.log('kelas kustom        :', kustom.size);
if(kurang.length){
  console.log('TIDAK ADA WUJUDNYA  :', kurang.length);
  kurang.forEach(t => console.log('  ', t));
  process.exit(1);
}
console.log('semua kelas punya wujud di stylesheet ✓');

/* ---------------------------------------------------------
   Integritas tag <script>.
   Bundle harus utuh dalam SATU elemen script inline. Kalau
   ada '</script>' bocor di dalam kode, browser memecahnya
   jadi dua dan separuh kode dirender sebagai teks — persis
   yang pernah membuat situs tampil seperti tumpukan kode.
   Jumlah tag <script> lain boleh berubah; yang diperiksa
   di sini bukan angkanya, tapi keutuhannya.
   --------------------------------------------------------- */
const inline = [...html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
const bundle = inline.filter(s2 => s2.includes('"use strict"'));
console.log('script inline       :', inline.length, '| berisi bundle:', bundle.length);
if(bundle.length !== 1){
  console.log('GAGAL: bundle tidak utuh dalam satu <script>.');
  console.log('       kemungkinan ada \'</script>\' bocor di dalam kode.');
  process.exit(1);
}
if(/<\/script/i.test(bundle[0])){
  console.log("GAGAL: masih ada '</script' mentah di dalam bundle.");
  process.exit(1);
}
/* Pemeriksaan penentu: bundle dibuka dengan IIFE dan HARUS ditutup
   dengan '})();'. Kalau ada '</script>' bocor, separuh depan tetap
   berisi "use strict" tapi kehilangan penutupnya — inilah yang
   membedakan bundle utuh dari bundle yang terpotong. */
if(!bundle[0].trimEnd().endsWith('})();')){
  console.log('GAGAL: bundle terpotong — tidak berakhir dengan })();');
  console.log('       hampir pasti ada \'</script>\' bocor di dalam kode.');
  process.exit(1);
}
console.log('bundle utuh dalam satu <script> ✓');
