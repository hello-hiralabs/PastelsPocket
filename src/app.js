import { tf } from './i18n.js';
import { iconFallback, markSvgFilterSupport, toast } from './utils.js';
import { MO, initUi, setDb, ui } from './state.js';
import { DS, load, save } from './data-service.js';
import { clearQueue, collectRewards } from './rewards.js';
import { applyRecurring } from './recurring.js';
import { render } from './render.js';
import './actions.js';

/* =========================================================
   ENTRY POINT
   Urutannya penting: data dimuat -> tagihan berulang
   dijalankan -> hadiah dihitung -> baru dirender.
   ========================================================= */








export function boot(){
  initUi();
  setDb(load());
  MO(ui.mk);

  const rec = applyRecurring();

  /* hadiah yang sudah terpenuhi oleh data awal dianggap sudah dibuka,
     supaya pengguna baru tidak dihujani pop-up di detik pertama */
  collectRewards(); clearQueue();

  save();
  render();

  if(rec.count){
    setTimeout(() => toast(tf('{0} tagihan otomatis dicatat 🧾', rec.count)), 900);
  }
  markSvgFilterSupport();
  window.addEventListener('load', iconFallback);
  daftarkanSW();
  console.info('[Pastels] siap · penyimpanan:', DS.adapter.id);
}

boot();

/* =========================================================
   SERVICE WORKER
   Hanya jalan di https (atau localhost). Dari file:// dilewati
   supaya tidak melempar error saat dev.html dibuka langsung.
   ========================================================= */
function daftarkanSW(){
  if(!('serviceWorker' in navigator)) return;
  const aman = location.protocol === 'https:' || location.hostname === 'localhost';
  if(!aman) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.info('[Pastels] offline siap'))
      .catch(e => console.warn('[Pastels] service worker gagal:', e && e.message));
  });
}
