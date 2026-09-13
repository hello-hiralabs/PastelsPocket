import { LANG, t, tf } from './i18n.js';
import { CATS, CELENGAN } from './constants.js';
import { esc, stk } from './utils.js';
import { ui } from './state.js';

/* =========================================================
   FILTER & PENCARIAN RIWAYAT
   ---------------------------------------------------------
   Keadaan filter disimpan di ui supaya ikut bertahan saat
   pindah bulan, tapi tidak ikut tersimpan ke localStorage —
   filter adalah keadaan tampilan, bukan data.
   ========================================================= */




export function filterActive(){
  return !!((ui.q && ui.q.trim()) || ui.fcat);
}
export function filterReset(){ ui.q = ''; ui.fcat = ''; }

function norm(s){ return String(s == null ? '' : s).toLowerCase(); }

/* satu transaksi lolos filter? */
export function txMatch(x){
  if(ui.fcat && x.cat !== ui.fcat) return false;
  const q = norm(ui.q).trim();
  if(!q) return true;
  const c = x.cat === 'celengan' ? CELENGAN : (CATS.filter(y => y.k === x.cat)[0] || {});
  const nama = LANG === 'en' ? (c.en || c.n || '') : (c.n || '');
  /* cocokkan catatan, nama kategori, dan nominal mentah */
  return norm(x.note).indexOf(q) >= 0 ||
         norm(nama).indexOf(q) >= 0 ||
         String(x.amount).indexOf(q.replace(/[^\d]/g, '')) >= 0 && /\d/.test(q);
}

/* bilah pencarian + deretan chip kategori */
export function filterBar(hitung){
  const cats = CATS.concat([CELENGAN]);
  const chips = cats.map(c => {
    const on = ui.fcat === c.k;
    return '<button data-act="fcat" data-k="' + c.k + '" aria-pressed="' + on + '" ' +
      'class="shrink-0 flex items-center gap-1 pl-1 pr-2.5 py-1 rounded-full hand text-[11px] font-bold whitespace-nowrap" ' +
      'style="background:' + (on ? c.c : '#FFFDFB') + ';border:2px solid ' + (on ? c.s : '#F3E7EA') + ';' +
      'color:' + (on ? '#5A4E4D' : '#7E7271') + '">' +
      stk(c.i, { size: 22, ic: 14, tone: c.c, rot: 0, round: true, fb: c.f }) +
      esc(LANG === 'en' ? (c.en || c.n) : c.n) + '</button>';
  }).join('');

  return '<div class="mb-2.5">' +
    '<div class="amtbox flex items-center gap-2 px-2.5 py-1.5 rounded-2xl mb-2" ' +
      'style="background:#FFFDFB;border:2px solid #F3E7EA">' +
      '<span class="text-[13px] shrink-0 opacity-60">🔍</span>' +
      '<input id="qbox" type="text" data-field="q" value="' + esc(ui.q || '') + '" ' +
        'placeholder="' + esc(t('Cari catatan atau kategori...')) + '" ' +
        'class="bigamt bg-transparent border-0 p-0 text-[13.5px]">' +
      (filterActive()
        ? '<button data-act="q-clear" aria-label="Hapus filter" class="shrink-0 w-6 h-6 grid place-items-center rounded-full hand font-bold text-[13px]" style="background:#FFEAF0;color:#A66172">×</button>'
        : '') +
    '</div>' +
    '<div class="flex gap-1.5 overflow-x-auto hide-scroll pb-1">' + chips + '</div>' +
    (filterActive()
      ? '<p class="hand text-[11px] text-soft mt-1.5">' + esc(tf('{0} catatan cocok', hitung)) + '</p>'
      : '') +
  '</div>';
}
