/* =========================================================
   PASTELS : YOUR POCKET BESTIE — Journal & Sticker Book Edition
   · Ikon: Microsoft Fluent Emoji Flat (Iconify) + efek stiker
   · Dual bahasa ID / EN (localStorage)
   · Washi tape wardrobe dengan sistem reward
   · Story card 9:16 digambar di canvas
   ========================================================= */



/* =========================================================
   1. BAHASA  ·  kamus EN dipetakan dari teks Indonesia
   ========================================================= */
/* kunci penyimpanan sengaja tidak diganti nama supaya data pengguna lama tetap kebaca */
export const LKEY='jajanku-lang';
export let LANG = (function(){ try{ const v=localStorage.getItem(LKEY); return (v==='en'||v==='id')?v:'id'; }catch(e){ return 'id'; } })();

export const EN = {
  /* --- sapaan & header --- */
  'Sweety':'Cutie',
  'Bestie':'Sweety',
  'Pagi {0}! ✨ Siap atur jajan hari ini?':'Morning {0}! ✨ Ready for today’s fun?',
  'Siang {0}! 🌸 Mau catat jajan apa hari ini?':'Afternoon {0}! 🌸 What’s today’s spend?',
  'Sore {0}! 🌿 Gimana jajan hari ini?':'Golden hour {0}! 🌿 How’s today’s spend?',
  'Met malem {0}! 🌙 Spill jajan seharian yuk~':'Evening {0}! 🌙 Let’s recap today’s spend~',
  '{0} Hari Rajin Catat Jajan!':'{0} Day Logging Streak!',
  '{0} Stiker Kekumpul':'{0} Stickers Unlocked',
  'Yuk cek dompet kamu':'Let’s peek at your wallet',
  'Wishlist kamu nungguin':'Your wishlist is waiting',
  'Koleksi stiker kamu':'Your sticker collection',
  'Rekap bulan ini':'This month at a glance',

  /* --- maskot --- */
  'Aman banget! Masih bisa jajan enak hari ini 🍦':'Budget intact! Go treat yourself, bestie 🍦',
  'Opps, jatah jajan tipis nih... Rem dikit dulu ya! 🚨':'Oopsie, wallet’s getting light... slow down! 🚨',
  'Celengan {0} udah full! Checkout yuk 🎉':'Your {0} fund is full! Time to checkout 🎉',
  'Celengan kamu dikit lagi penuh, semangat! 💖':'You’re so close to filling that piggy! 💖',
  'Hari ini mau jajan apa? 👀':'What are we treating ourselves to today? 👀',
  'Streak {0} hari, rajin banget sih 🔥':'{0}-day streak. Look at you go 🔥',
  'Dompetnya minus nih, yuk cek lagi 🥲':'Wallet went negative, let’s recheck 🥲',
  'Aku temenin nyatet, ya 💕':'I’ll keep you company while logging 💕',
  'Jangan lupa minum air putih! 🫧':'Drink some water, bestie! 🫧',

  /* --- kartu utama --- */
  'Jatah Jajan Hari Ini 🧋':'Daily Jajan Allowance 🧋',
  'Sisa Dompet Jajan Bulan Ini':'Left In The Vault',
  'Hitungan Mundur Payday':'Days Till Payday',
  '{0} hari lagi':'{0} days',
  'Kepake {0}':'Spent {0}',
  'dari limit jajan {0}/hari':'out of {0}/day limit',
  'Kebablasan dikit, besok kita fix ya 🥲':'Went a lil overboard, we’ll fix it tomorrow 🥲',
  'Kantong mulai tipis, rem dikit ya 🚨':'Wallet’s getting light, slow down 🚨',
  'Masih bersih! Belum jajan apa-apa ✨':'Clean slate! Nothing spent yet ✨',

  /* --- cuan & jajan --- */
  'Cuan Masuk 💸':'Money In 💸',
  'Amplop Bulan Ini 🧺':'This Month’s Envelopes 🧺',
  'Bagi otomatis dari cuan masuk, atau ketik nominal sendiri.':'Split automatically from your income, or type your own amount.',
  'Auto-Split 50/30/20':'Auto-Split 50/30/20',
  'Total amplop {0}% dari cuan masuk':'Envelopes total {0}% of income',
  'Kepake {0} dari {1}':'{0} used of {1}',
  'Amplop udah dibagi 50/30/20 ✨':'Split 50/30/20, done ✨',
  'Jatah Jajan':'Jajan Money',
  'Atur Limit Jajan Hari Ini ✏️':'Set Today’s Jajan Limit ✏️',
  /* --- filter & pencarian --- */
  'Cari catatan atau kategori...':'Search notes or categories...',
  '{0} catatan cocok':'{0} matching entries',
  'Tidak ada catatan yang cocok 🔍':'No matching entries 🔍',
  'Coba kata lain atau lepas filter kategorinya.':'Try another word or clear the category filter.',
  /* --- tagihan berulang --- */
  'Tagihan Berulang 🔁':'Recurring Bills 🔁',
  'Atur Tagihan Berulang 🔁':'Manage Recurring Bills 🔁',
  'Dicatat otomatis tiap bulan begitu tanggalnya lewat.':'Logged automatically each month once the date passes.',
  '+ Tambah Tagihan':'+ Add A Bill',
  'Nama tagihan':'Bill name',
  'Tgl':'Day',
  'Aktif':'Active',
  'Dijeda':'Paused',
  'Belum ada tagihan berulang 🌱':'No recurring bills yet 🌱',
  'Komitmen bulanan {0}':'Monthly commitment {0}',
  '{0} tagihan otomatis dicatat 🧾':'{0} recurring bills logged 🧾',
  'otomatis':'auto',
  /* --- ekspor --- */
  'Ekspor CSV':'Export CSV',
  'Rekap {0} diekspor ke CSV 📄':'{0} recap exported as CSV 📄',
  /* --- akun & sinkron --- */
  'Akun & Sinkron ☁️':'Account & Sync ☁️',
  'Mode sekarang: {0}':'Current mode: {0}',
  'Sinkron cloud belum disetel. Isi kunci Supabase di src/data-service.js dulu.':'Cloud sync isn’t configured yet. Add your Supabase keys in src/data-service.js.',
  'Hubungkan Akun Google':'Connect Google Account',
  'Keluar dari Akun':'Sign Out',
  /* --- pesan gagal yang lebih jelas --- */
  'Gagal menyimpan. Coba backup datamu 🥲':'Couldn’t save. Try backing up your data 🥲',
  'Backup gagal dipulihkan: {0}':'Restore failed: {0}',
  'Pilih Kucingmu 🐾':'Pick Your Cat 🐾',
  'Tiap kucing bawa kamarnya sendiri. Gonta-ganti bebas kok.':'Every cat brings its own room. Switch anytime.',
  '{0} pindah ke kamar barunya 🐾':'{0} moved into a new room 🐾',
  'Ganti':'Switch',
  'Ganti Kucing 🐾':'Switch Cat 🐾',
  'Ada acara khusus? Timpa limit otomatis buat hari ini aja.':'Something special today? Override the automatic limit, just for today.',
  'Hitungan otomatisnya {0}':'Automatic right now: {0}',
  'Pakai Otomatis':'Use Automatic',
  'Simpan Limit':'Save Limit',
  'custom':'custom',
  'Limit hari ini jadi {0} ✨':'Today’s limit is now {0} ✨',
  'Balik ke limit otomatis ✨':'Back to the automatic limit ✨',
  'Cuan dari mana?':'Where’s it from?',
  'Belum ada cuan masuk bulan ini 🌱':'No money in yet this month 🌱',
  '+ Tambah Cuan Baru':'+ Add Fresh Funds',
  'Spill Catatan Jajan 🛍️':'Today’s Jajan Spill 🛍️',
  'Struk Catatan Jajan':'Jajan Receipt',
  'Struk Jajan Kamu 🧾':'Your Jajan Receipt 🧾',
  'PASTELS · YOUR POCKET BESTIE':'PASTELS · YOUR POCKET BESTIE',
  'TOTAL TERCATAT':'TOTAL LOGGED',
  'Makasih udah rajin nyatet ya! 🌸':'Thanks for logging today! 🌸',
  'Dinding Piala & Bingkai 🖼️':'Trophy & Frame Wall 🖼️',
  'Bingkai kosong nunggu diisi':'Empty frame, waiting for you',
  'Spill Catatan Jajan {0} 🛍️':'Jajan Spill · {0} 🛍️',
  '3 hari terakhir':'Last 3 days',
  'Seminggu terakhir':'Last 7 days',
  'Sebulan penuh':'Whole month',
  '{0} hari tercatat':'{0} days logged',
  'Lihat {0} hari sebelumnya':'Show {0} earlier days',
  'Buka sisa bulan ini · {0} hari':'Open the rest of the month · {0} days',
  'Tutup lagi':'Collapse',
  'Buka {0}':'Open {0}',
  'Balik ke bulan ini':'Back to this month',
  'Belum ada catatan di {0} 🌱':'Nothing logged in {0} yet 🌱',
  'Cerita {0}':'{0} Story',
  'Rekap lengkap':'Full summary',
  'Hari ini':'Today',
  'Masih bersih nih! Belum jajan apa-apa hari ini ✨':'Clean slate! No jajan logged today ✨',
  'Ketuk tombol pink di bawah buat mulai nyatet.':'Tap the pink button below to start logging.',

  /* --- celengan --- */
  'Celengan Impian 💰':'Dream Wishlist 💰',
  'Biar jajan tetep aman, sambil nabung wishlist 💖':'Little by little, your dream items await 💖',
  'Total di semua celengan':'Total across all funds',
  '{0}% dari total wishlist {1}':'{0}% of your {1} wishlist',
  'Wishlist kamu apa?':'What’s on your wishlist?',
  'Udah full! Saatnya checkout 🎉':'All full! Time to checkout 🎉',
  'Kurang {0} lagi, semangat!':'{0} to go, you got this!',
  'Yuk Isi Celengan 💖':'Feed The Piggy Bank 💖',
  'Targetnya':'Target',
  'Sudah ada':'Saved',
  '+ Bikin Celengan Baru':'+ Start A New Fund',
  'Belum ada celengan nih':'No funds yet',
  'Bikin satu wishlist dulu yuk, biar nabungnya ada tujuannya 💖':'Add one wishlist so saving has a purpose 💖',
  'Sisa dompet kamu {0} — sisihin dikit yuk 💕':'You’ve got {0} left — stash a little 💕',

  /* --- navigasi --- */
  'Rumah':'Home','Celengan':'Wishlist','Stiker':'Badges','Rekap':'Summary',
  'Catat Jajan':'Log Jajan',

  /* --- tab stiker --- */
  'Streak Rajin Nyatet 🔥':'Logging Streak 🔥',
  '{0} hari':'{0} days',
  'Best record kamu {0} hari':'Your best run: {0} days',
  'Buku Stiker 🏆':'Sticker Book 🏆',
  '{0} dari {1} kekumpul':'{0} of {1} unlocked',
  'Stiker selanjutnya nih 👀':'Next sticker up 👀',
  'Masih dikunci nih':'Still locked',
  'Terus nyatet, nanti kebuka sendiri ✨':'Keep logging, it’ll pop open ✨',
  'Kebuka {0}':'Unlocked {0}',
  'Semua stiker kekumpul! 👑':'Every sticker unlocked! 👑',
  'Kamu resmi jadi Ratu Nyatet. Proud of you, Bestie! 💖':'Officially the logging queen. So proud! 💖',
  'Bikin Kartu Buat Story 📤':'Make A Story Card 📤',
  'Tutup':'Close',

  /* --- lemari washi --- */
  'Lemari Washi Tape 🎀':'Washi Tape Wardrobe 🎀',
  'Pilih motif buat kartu utama & kartu celengan':'Pick a look for your main & fund cards',
  '{0} dari {1} motif kebuka':'{0} of {1} designs unlocked',
  'Kartu Utama':'Main card',
  'Kartu Celengan':'Fund cards',
  'Terkunci':'Locked',
  'HADIAH BARU KEBUKA! 🎉':'NEW REWARD UNLOCKED! 🎉',
  'Motif washi tape baru buat jurnalmu':'A fresh washi tape for your journal',
  'Pasang Sekarang':'Wear It Now',
  'Nanti aja':'Maybe later',
  'Motif {0} udah dipasang di kartu utama 🎀':'{0} is now on your main card 🎀',

  /* --- rekap --- */
  'Cuan Masuk':'Money In',
  'Kejajanin':'Spent',
  'Ketabung':'Saved',
  'Sisa Dompet':'Left Over',
  'Duitmu Lari ke Mana? 👀':'Where Did It Go? 👀',
  'Bulan ini masih bersih, belum ada catatan 🌱':'Nothing logged this month yet 🌱',
  'Kalender Jajan 📅':'Spending Calendar 📅',
  'makin pink = makin boros':'pinker = pricier',
  'Cerita Bulan Ini':'This Month’s Story',
  'Kamu jajan di <b>{0} hari</b>, rata-rata {1} sekali jajan.':'You spent on <b>{0} days</b>, about {1} each time.',
  'Paling banyak kabur ke <b>{0}</b>, totalnya {1}.':'Most of it went to <b>{0}</b> — {1} total.',
  'Yang masuk celengan {0} bulan ini.':'{0} made it into your funds this month.',
  'Sisa dompet {0}, boleh banget dipindah ke celengan 💖':'{0} left over — perfect to move into a fund 💖',
  'Pengeluaran lebih gede {0} dari cuan masuk. Bulan depan kita fix ya 🥲':'You spent {0} more than you earned. We’ll fix it next month 🥲',

  /* --- sheet catat jajan --- */
  'Catat Jajan 🛍️':'Log A Spend 🛍️',
  'Berapa dan buat apa? Cuma dua ketukan kok.':'How much and what for? Two taps, done.',
  'Kapan?':'When?',
  'Catatannya':'Note',
  'boba sama bestie...':'boba with bestie...',
  'Simpan 💕':'Save it 💕',

  /* --- sheet celengan --- */
  'Isi Celengan {0}':'Feed {0}',
  'Kurang {0} lagi · sisa dompet {1}':'{0} to go · {1} left in wallet',
  'Masukin! 💰':'Drop it in! 💰',
  'Pilih Jenis Celengan':'Pick A Fund Type',
  'Warnanya ikut jenis yang kamu pilih 🎨':'The colour follows the type you pick 🎨',
  'Atur Urutan':'Reorder',
  'Selesai':'Done',
  'Susun celengan sesuai prioritas kamu. Yang paling penting taruh di atas ✨':'Arrange your funds by priority. Put the important one on top ✨',
  'Urutan celengan udah kesimpen ✨':'New order saved ✨',
  'Impian':'Wishlist',

  /* --- pengaturan --- */
  'Pengaturan ⚙️':'Settings ⚙️',
  'Bahasa aplikasi':'App language',
  'Panggil kamu siapa nih?':'What should I call you?',
  'Contoh: Kirana':'e.g. Kirana',
  'Pilih temen ngobrol kamu':'Pick your buddy',
  'Backup Data 💾':'Backup Data 💾',
  'Semua catatan cuma nyimpen di browser ini ({0} KB). Backup dulu sebelum ganti HP ya!':'Everything lives in this browser only ({0} KB). Back it up before switching phones!',
  'Unduh Backup':'Download Backup',
  'Restore Data':'Restore Data',
  'Pasang di Home Screen 📱':'Add To Home Screen 📱',
  'Buka di Safari → ketuk ikon Share → pilih “Add to Home Screen”. Jadi kayak app beneran!':'Open in Safari → tap Share → pick “Add to Home Screen”. Feels like a real app!',
  'Buka Lemari Washi Tape 🎀':'Open Washi Wardrobe 🎀',
  'Reset semua data':'Reset everything',
  'Pastels : Your Pocket Bestie 🎀':'Pastels : Your Pocket Bestie 🎀',
  'dibuat manis buat kamu':'made sweet, just for you',
  'Yakin mau reset semua? 🥺':'Reset everything? 🥺',
  'Semua catatan, celengan, sama stiker kamu bakal hilang. Backup dulu kalau masih sayang.':'All your logs, funds and stickers will be gone. Back them up if you still care.',
  'Nggak jadi':'Never mind',
  'Iya, hapus':'Yes, wipe it',

  /* --- pop up --- */
  'Noted! {0} buat {1}':'Noted! {0} on {1}',
  'Sip, jajanmu udah dicatat! Tetep stay on budget ya~ 🌸 Sisa jatah hari ini {0}.':'Logged! Stay cute & stay on budget ✨ {0} left for today.',
  'Streak kamu jadi {0} hari nih. Rajin banget sih! 🔥':'{0}-day streak now. You’re on fire! 🔥',
  'Catatan ini masuk ke {0}. Cek di tab Rekap ya 📊':'This one went to {0}. Peek at the Summary tab 📊',
  'Gokil! Celenganmu nambah {0} 💖':'Yay! Your fund grew by {0} 💖',
  'Selangkah lagi menuju {0}. Proud of you! 💖':'One step closer to your {0} 💖 So proud!',
  'Celengan {0} udah full! Saatnya checkout 🎉':'Your {0} fund is full! Time to checkout 🎉',
  'Setengah jalan! Tinggal {0} lagi. Bisa banget kamu 💪':'Halfway there! Just {0} to go 💪',
  'Yay, lanjut! 💕':'Yay, let’s go! 💕',
  'Stiker baru kebuka! 🎊':'New sticker unlocked! 🎊',
  'Tempel di buku stiker! ✨':'Stick it in the book! ✨',

  /* --- story card --- */
  'Kartu Story Kamu 📤':'Your Story Card 📤',
  'Ukurannya 9:16, pas banget buat IG Story atau TikTok 💕':'It’s 9:16 — perfect for IG Story or TikTok 💕',
  'Tahan gambarnya buat langsung save ke galeri.':'Long-press the image to save it straight to your gallery.',
  'Download PNG':'Download PNG',
  'Share':'Share',
  'Jurnal Jajan Harianku ✨':'My Daily Jajan Journal ✨',
  'jatah hari ini':'today’s allowance',
  'sisa dompet':'left in the vault',
  'streak':'streak',
  'total jajan kepake':'total jajan today',
  '🔥 {0} hari':'🔥 {0} days',
  'Share ke IG Story 📤':'Share to IG Story 📤',
  'Logged with Pastels : Your Pocket Bestie 🌸':'Logged with Pastels : Your Pocket Bestie 🌸',
  'Lagi rajin catat jajan pakai Pastels 🎀':'Keeping my jajan cute with Pastels 🎀',

  /* --- kategori pakai field en di CATS --- */

  /* --- toast --- */
  'Eh, nominalnya belum diisi 🥺':'Oops, the amount is still empty 🥺',
  'Mau nabung berapa nih? 💰':'How much are we stashing? 💰',
  'Oke siap, nanti dikabarin ya 💌':'Got it, I’ll ping you later 💌',
  'Backup-nya udah keunduh 💾':'Backup downloaded 💾',
  'Yah, gagal keunduh 🥲':'Hmm, the download failed 🥲',
  'Yeay, data kamu balik lagi 💕':'Yay, your data is back 💕',
  'Duh, filenya nggak kebaca. Pastiin file backup JSON ya 🥺':'Can’t read that file. Make sure it’s the JSON backup 🥺',
  'Yah, filenya gagal kebaca 🥲':'Hmm, that file wouldn’t open 🥲',
  'Oke, mulai dari nol lagi 🌱':'Alright, starting fresh 🌱',
  'Udah kesimpen! Cek galeri kamu 💕':'Saved! Check your gallery 💕',
  'Tahan gambarnya terus pilih Save ya 🌸':'Long-press the image and pick Save 🌸',
  'Udah kesalin! Tinggal paste 💕':'Copied! Just paste it 💕',
  'Tahan gambarnya terus pilih Copy ya 🌸':'Long-press the image and pick Copy 🌸',
  'Tahan gambarnya terus pilih Share ya 🌸':'Long-press the image and pick Share 🌸',
  'Memori browsernya penuh, backup dulu yuk 🥲':'Browser storage is full — let’s back up 🥲'
};

export function t(s){ return LANG==='en' ? (EN[s]!==undefined?EN[s]:s) : s; }
export function tf(s){
  let o=t(s);
  for(let i=1;i<arguments.length;i++) o=o.split('{'+(i-1)+'}').join(arguments[i]);
  return o;
}

export const BULAN_ID=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
export const BULAN_EN=['January','February','March','April','May','June','July','August','September','October','November','December'];
export const BS_ID=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];
export const BS_EN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export const HARI_ID=['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
export const HARI_EN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
export const BULAN=()=>LANG==='en'?BULAN_EN:BULAN_ID;
export const BULAN_S=()=>LANG==='en'?BS_EN:BS_ID;
export const HARI_S=()=>LANG==='en'?HARI_EN:HARI_ID;

export const QUOTES_ID=[
  'Nabung dikit-dikit, lama-lama bisa checkout wishlist',
  'Kamu bukan pelit, kamu lagi sayang sama masa depan sendiri',
  'Skip boba sekali, wishlist maju selangkah',
  'Dompet aman, hati tenang, tidur pun nyenyak',
  'Slow progress is still progress, Bestie',
  'Catat dulu, biar nggak bingung duitnya lari ke mana',
  'Duitmu punya tujuan, bukan cuma numpang lewat',
  'Hemat bukan nahan-nahan, tapi pilih yang beneran kamu mau',
  'Hari ini rajin nyatet, besok bangga sendiri',
  'Celengan penuh dimulai dari receh pertama'
];
export const QUOTES_EN=[
  'Save a little, checkout that wishlist a lot sooner',
  'You’re not stingy, you’re just loving future you',
  'Skip one boba, move one step closer',
  'Wallet calm, heart calm, sleep so good',
  'Slow progress is still progress, bestie',
  'Log it now so you never wonder where it went',
  'Your money has a destination, not just a exit',
  'Saving isn’t denying, it’s choosing what you truly want',
  'Log it today, feel proud tomorrow',
  'A full piggy bank starts with the first coin'
];
export const QUOTES=()=>LANG==='en'?QUOTES_EN:QUOTES_ID;

/* LANG hanya boleh diubah dari modul ini; binding hasil import bersifat read-only */
export function applyLang(l){ LANG = (l === 'en' || l === 'id') ? l : 'id'; return LANG; }
export function currentLang(){ return LANG; }
