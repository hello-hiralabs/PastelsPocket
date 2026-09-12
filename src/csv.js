import { LANG } from './i18n.js';
import { CATS, CELENGAN } from './constants.js';
import { mkLabel, num } from './utils.js';
import { MO } from './state.js';
import { envNom, envSpent, sums } from './calc.js';

/* =========================================================
   EKSPOR CSV
   ---------------------------------------------------------
   Pemisah memakai titik koma karena Excel versi Indonesia
   membaca koma sebagai pemisah desimal. BOM UTF-8 dipasang
   supaya emoji dan huruf beraksen tidak jadi mojibake.
   ========================================================= */





const SEP = ';';

function cell(v){
  const s = String(v == null ? '' : v);
  return /[";\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}
function row(arr){ return arr.map(cell).join(SEP); }

function catName(k){
  if(k === 'celengan') return LANG === 'en' ? CELENGAN.en : CELENGAN.n;
  const c = CATS.filter(x => x.k === k)[0];
  return c ? (LANG === 'en' ? c.en : c.n) : k;
}

export function monthCsv(mk){
  const M = MO(mk), s = sums(mk);
  const L = LANG === 'en'
    ? { h:'Pastels — monthly recap', per:'Period', in:'Money in', out:'Spent', sav:'Saved', left:'Left over',
        env:'Envelope', alloc:'Allocated', used:'Used', d:'Date', c:'Category', n:'Note', a:'Amount', k:'Type',
        income:'income', expense:'expense', saving:'saving', auto:'auto', man:'manual', src:'Source', tx:'Transactions' }
    : { h:'Pastels — rekap bulanan', per:'Periode', in:'Cuan masuk', out:'Kejajanin', sav:'Ketabung', left:'Sisa dompet',
        env:'Amplop', alloc:'Alokasi', used:'Kepake', d:'Tanggal', c:'Kategori', n:'Catatan', a:'Nominal', k:'Jenis',
        income:'pemasukan', expense:'pengeluaran', saving:'celengan', auto:'otomatis', man:'manual', src:'Sumber', tx:'Transaksi' };

  const out = [];
  out.push(row([L.h]));
  out.push(row([L.per, mkLabel(mk)]));
  out.push('');
  out.push(row([L.in, s.masuk]));
  out.push(row([L.out, s.jajan]));
  out.push(row([L.sav, s.nabung]));
  out.push(row([L.left, s.sisa]));
  out.push('');
  out.push(row([L.env, L.alloc, L.used]));
  ['bills', 'wants', 'save'].forEach(k => {
    out.push(row([k, envNom(k, s.masuk), envSpent(mk, k)]));
  });
  out.push('');

  /* pemasukan */
  out.push(row([L.src, L.d, L.a]));
  M.income.forEach(r => out.push(row([r.label || '', r.date || '', num(r.amount)])));
  out.push('');

  /* transaksi */
  out.push(row([L.tx]));
  out.push(row([L.d, L.c, L.n, L.a, L.k, L.src]));
  M.tx.slice().sort((a, b) => String(a.date).localeCompare(String(b.date))).forEach(x => {
    out.push(row([
      x.date, catName(x.cat), x.note || '', num(x.amount),
      x.cat === 'celengan' ? L.saving : L.expense,
      x.rec ? L.auto : L.man
    ]));
  });
  return '\uFEFF' + out.join('\r\n') + '\r\n';
}

export function csvFilename(mk){ return 'pastels-' + mk + '.csv'; }
