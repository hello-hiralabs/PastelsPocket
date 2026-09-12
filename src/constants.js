import { LANG, t } from './i18n.js';
import { rp } from './utils.js';

/* =========================================================
   2. DATA STATIS
   ========================================================= */
export const LSKEY='jajanku-v1';   /* jangan diganti: data lama nempel di kunci ini */

/* 7 kategori jajan + 1 kantong serba-guna.
   env: 'wants' masuk jatah jajan harian, 'bills' masuk amplop tagihan */
export const CATS=[
  { k:'boba',   i:'bubble-tea',        f:'🧋', n:'Boba & Caffeine',    en:'Boba & Caffeine',   c:'#FFE8DC', s:'#D9A57E', env:'wants' },
  { k:'makan',  i:'bento-box',         f:'🍱', n:'Nasi & Makan Berat', en:'Rice & Real Meals', c:'#FFE4D4', s:'#E29A86', env:'wants' },
  { k:'sweets', i:'shortcake',         f:'🍰', n:'Sweets & Treats',    en:'Sweets & Treats',   c:'#FFE0E6', s:'#EE93A4', env:'wants' },
  { k:'ootd',   i:'shopping-bags',     f:'🛍️', n:'OOTD & Beauty',      en:'OOTD & Beauty',     c:'#FCDCE8', s:'#D992AE', env:'wants' },
  { k:'ojol',   i:'motor-scooter',     f:'🛵', n:'Ojol & Commute',     en:'Ride & Commute',    c:'#E1E9F5', s:'#93A9C6', env:'wants' },
  { k:'fun',    i:'admission-tickets', f:'🎟️', n:'Hangout & Fun',      en:'Hangout & Fun',     c:'#FFF3CD', s:'#DCBB55', env:'wants' },
  { k:'kos',    i:'house-with-garden', f:'🏠', n:'Kos & Tagihan',      en:'Rent & Bills',      c:'#E2F0D9', s:'#A3C79B', env:'bills' },
  { k:'lain',   i:'ribbon',            f:'🎀', n:'Lain-lain',          en:'Random',            c:'#F3E9EE', s:'#C0A9B4', env:'wants' }
];
/* kategori lama -> kategori baru, supaya catatan pengguna tidak hilang */
export const CAT_MIGRATE={ skincare:'ootd', baju:'ootd', transport:'ojol', pulsa:'kos', sehat:'lain' };
export const CATMAP=Object.fromEntries(CATS.map(c=>[c.k,c]));
export const CELENGAN={ k:'celengan', i:'money-bag', f:'💰', n:'Celengan', en:'Savings', c:'#E2F0D9', s:'#8FB886', env:'save' };
export const cName=c=>LANG==='en'?(c.en||c.n):c.n;
/* tiga amplop utama · def = persen bawaan 50/30/20 */
export const ENVS=[
  { k:'bills', i:'house-with-garden', f:'🏠', n:'Kos & Tagihan', en:'Rent & Bills', tone:'#E2F0D9', solid:'#A3C79B', def:50 },
  { k:'wants', i:'bubble-tea',        f:'🧋', n:'Jatah Jajan',   en:'Jajan Money',  tone:'#FFE8DC', solid:'#D9A57E', def:30 },
  { k:'save',  i:'money-bag',         f:'💰', n:'Celengan',      en:'Savings',      tone:'#FCE9B8', solid:'#DCBB55', def:20 }
];
export const EMAP=Object.fromEntries(ENVS.map(e=>[e.k,e]));
export const CAT_ENV=Object.fromEntries(CATS.map(c=>[c.k,c.env]));
export const envOfCat=k=> k==='celengan' ? 'save' : (CAT_ENV[k]||'wants');
export const catOf=k=> k==='celengan'?CELENGAN:(CATMAP[k]||CATS[CATS.length-1]);

/* Setiap jenis celengan punya tema warnanya sendiri:
   tone = bingkai stiker · solid = isi progress bar · soft = warna kertas kartu */
export const GOAL_KINDS=[
  { i:'admission-tickets', f:'🎟️', n:'Konser & Tiket',   en:'Tickets & Shows',   tone:'#FFC2BE', solid:'#F08C82', soft:'#FFF6F8', dark:'#D26F66' },
  { i:'lipstick',          f:'💄', n:'Skincare & Makeup',en:'Beauty',            tone:'#F9C2DA', solid:'#E177AC', soft:'#FFF3F7', dark:'#C25E92' },
  { i:'handbag',           f:'👜', n:'Tas & Aksesori',   en:'Bags & Accessories',tone:'#E8CFA9', solid:'#C29A5C', soft:'#FBF6EC', dark:'#8A7565' },
  { i:'mobile-phone',      f:'📱', n:'Gadget',           en:'Gadgets',           tone:'#C6D2EA', solid:'#7A90C6', soft:'#F7F6F2', dark:'#6076A9' },
  { i:'airplane',          f:'✈️', n:'Liburan',          en:'Travel',            tone:'#B4DDF0', solid:'#559FC4', soft:'#EEF7FC', dark:'#3F84A7' },
  { i:'headphone',         f:'🎧', n:'Musik & Audio',    en:'Music & Audio',     tone:'#D5C9F0', solid:'#8D7ECB', soft:'#FBF5F9', dark:'#7265AE' },
  { i:'running-shoe',      f:'👟', n:'Olahraga',         en:'Sports',            tone:'#BFE2C6', solid:'#6BAB7F', soft:'#F1F8EC', dark:'#548F66' },
  { i:'ring',              f:'💍', n:'Impian Besar',     en:'Big Dreams',        tone:'#FBE7AE', solid:'#D8A83F', soft:'#FFFBEC', dark:'#B78B2C' },
  { i:'books',             f:'📚', n:'Buku & Kelas',     en:'Books & Classes',   tone:'#F0C0AC', solid:'#CE7E62', soft:'#FFF5F8', dark:'#AE644A' },
  { i:'teddy-bear',        f:'🧸', n:'Hadiah',           en:'Gifts',             tone:'#FBD3B3', solid:'#DE9A63', soft:'#FFF5F8', dark:'#BC7C49' },
  { i:'birthday-cake',     f:'🎂', n:'Perayaan',         en:'Celebration',       tone:'#FCC9E2', solid:'#E97FB4', soft:'#FFF3F7', dark:'#C86495' },
  { i:'tulip',             f:'🌷', n:'Self-care',        en:'Self-care',         tone:'#B9E4DC', solid:'#5FAFA2', soft:'#EEF8F6', dark:'#479387' },
  { i:'money-bag',         f:'💰', n:'Tabungan Umum',    en:'General Savings',   tone:'#CDE4C0', solid:'#7FAE86', soft:'#F1F8EC', dark:'#66916D' }
];
export const KIND_FALLBACK=GOAL_KINDS[GOAL_KINDS.length-1];
export const KMAP=Object.fromEntries(GOAL_KINDS.map(k=>[k.i,k]));
export const kindOf=i=>KMAP[i]||KIND_FALLBACK;
export const kName=k=>LANG==='en'?k.en:k.n;
/* tombol clay yang ikut tema celengan */
export const clayVars=k=>'--c1:'+k.tone+';--c2:'+k.solid+';--c3:'+k.dark+';--cg:'+k.tone+'99;--ci:'+k.dark+'55;--ct:#fff';
export const AVATARS=[
  ['cat-face','🐱'],['rabbit','🐰'],['teddy-bear','🧸'],['panda','🐼'],
  ['penguin','🐧'],['fox','🦊'],['koala','🐨'],['hamster','🐹'],
  ['duck','🦆'],['dove','🕊️'],['strawberry','🍓'],['cupcake','🧁']
];

/* ---- Washi tape: motif + syarat unlock ---- */
export const WASHI=[
  { id:'yellow', n:'Kuning Garis', en:'Yellow Stripe', tone:'#F5D96B', pat:'stripe',
    bg:'repeating-linear-gradient(48deg, rgba(255,224,138,.95) 0 7px, rgba(255,247,220,.92) 7px 14px)', need:null },
  { id:'pink', n:'Pink Polka', en:'Pink Polka', tone:'#FFC0D3', pat:'dot',
    bg:'radial-gradient(circle, rgba(255,255,255,.9) 1.6px, transparent 1.7px) 0 0/9px 9px, linear-gradient(rgba(255,178,199,.95), rgba(255,198,215,.95))', need:null },
  { id:'matcha', n:'Kotak Matcha', en:'Checkered Matcha', tone:'#A3C79B', pat:'grid',
    bg:'linear-gradient(rgba(255,255,255,.85) 1px, transparent 1px) 0 0/100% 7px, linear-gradient(90deg, rgba(255,255,255,.85) 1px, transparent 1px) 0 0/7px 100%, linear-gradient(rgba(168,206,186,.92), rgba(200,228,212,.92))',
    need:{k:'streak',v:3} },
  { id:'lavender', n:'Lavender Kelap-kelip', en:'Lavender Sparkle', tone:'#D6BEE0', pat:'dot',
    bg:'radial-gradient(circle at 30% 30%, rgba(255,255,255,.95) 1.3px, transparent 1.4px) 0 0/11px 11px, radial-gradient(circle at 70% 70%, rgba(255,255,255,.72) 1px, transparent 1.1px) 0 0/8px 8px, linear-gradient(-42deg, rgba(214,190,224,.95), rgba(240,228,246,.92))',
    need:{k:'goal50'} },
  { id:'strawberry', n:'Polka Stroberi', en:'Strawberry Polka', tone:'#FF9EAA', pat:'dot',
    bg:'radial-gradient(circle, rgba(255,120,150,.5) 2.2px, transparent 2.3px) 0 0/12px 12px, linear-gradient(rgba(255,225,232,.96), rgba(255,205,218,.96))',
    need:{k:'streak',v:7} },
  { id:'gold', n:'Foil Emas', en:'Gold Foil', tone:'#E9C46A', pat:'stripe',
    bg:'repeating-linear-gradient(115deg, rgba(240,199,101,.95) 0 5px, rgba(255,238,192,.95) 5px 10px, rgba(214,169,74,.9) 10px 13px)',
    need:{k:'goal100'} },
  { id:'sky', n:'Awan Biru', en:'Cloudy Sky', tone:'#93AEC2', pat:'dot',
    bg:'radial-gradient(circle at 50% 125%, rgba(255,255,255,.95) 6px, transparent 6.6px) 0 0/18px 12px, linear-gradient(rgba(198,223,241,.95), rgba(228,241,248,.95))',
    need:{k:'log',v:100} },
  { id:'rainbow', n:'Pelangi Pastel', en:'Pastel Rainbow', tone:'#FFC0D3', pat:'stripe',
    bg:'linear-gradient(100deg, rgba(255,190,200,.95) 0 20%, rgba(255,224,150,.95) 20% 40%, rgba(190,224,200,.95) 40% 60%, rgba(190,214,240,.95) 60% 80%, rgba(220,196,232,.95) 80% 100%)',
    need:{k:'saved',v:2000000} }
];
export const WMAP=Object.fromEntries(WASHI.map(w=>[w.id,w]));
export function wName(w){ return LANG==='en'?w.en:w.n; }
export function wNeedText(w){
  if(!w.need) return LANG==='en'?'Unlocked from the start':'Kebuka dari awal';
  const nd=w.need;
  if(nd.k==='streak') return LANG==='en'?('Reach a '+nd.v+'-day streak'):('Capai streak '+nd.v+' hari');
  if(nd.k==='log')    return LANG==='en'?('Log '+nd.v+' spendings'):('Catat '+nd.v+' jajan');
  if(nd.k==='goal50') return LANG==='en'?'Fill any fund to 50%':'Isi satu celengan sampai 50%';
  if(nd.k==='goal100')return LANG==='en'?'Complete one wishlist':'Selesaikan satu wishlist';
  if(nd.k==='saved')  return LANG==='en'?('Save '+rp(nd.v)+' in total'):('Total celengan '+rp(nd.v));
  return '';
}

export const BADGES=[
  { id:'first',    i:'cherry-blossom', f:'🌸', n:'First Catat',      en:'First Log',        d:'Nyatet jajan buat pertama kalinya',  ed:'Logged your very first spend',      t:c=>c.txCount>=1 },
  { id:'log20',    i:'books',          f:'📚', n:'Rajin Banget',     en:'Super Consistent', d:'Udah 20 catatan, konsisten!',        ed:'20 logs in. Consistency queen!',    t:c=>c.txCount>=20 },
  { id:'log100',   i:'unicorn',        f:'🦄', n:'Ratu Nyatet',      en:'Logging Legend',   d:'100 catatan. Level dewa!',           ed:'100 logs. Absolute legend!',        t:c=>c.txCount>=100 },
  { id:'streak3',  i:'fire',           f:'🔥', n:'3 Hari Rajin',     en:'3-Day Streak',     d:'Nyatet 3 hari berturut-turut',       ed:'Logged 3 days in a row',            t:c=>c.best>=3 },
  { id:'streak7',  i:'trophy',         f:'🏆', n:'Seminggu Nonstop', en:'Week Warrior',     d:'Nyatet 7 hari nonstop',              ed:'Logged 7 days straight',            t:c=>c.best>=7 },
  { id:'streak30', i:'crown',          f:'👑', n:'Sebulan Penuh',    en:'Full Month Flex',  d:'30 hari nonstop. Respect!',          ed:'30 days nonstop. Respect!',         t:c=>c.best>=30 },
  { id:'goal1',    i:'money-bag',      f:'💰', n:'Punya Wishlist',   en:'Dream Starter',    d:'Bikin celengan impian pertama',      ed:'Started your first dream fund',     t:c=>c.goals>=1 },
  { id:'goal50',   i:'glowing-star',   f:'🌟', n:'Setengah Jalan',   en:'Halfway Hero',     d:'Ada celengan yang tembus 50%',       ed:'A fund crossed the 50% mark',       t:c=>c.maxPct>=50 },
  { id:'goal100',  i:'party-popper',   f:'🎉', n:'Wishlist Beres',   en:'Wishlist Cleared', d:'Celengan kamu full 100%!',           ed:'A fund hit a full 100%!',           t:c=>c.maxPct>=100 },
  { id:'saver',    i:'gem-stone',      f:'💎', n:'Nabung 500rb',     en:'Half A Mill',      d:'Total celengan tembus Rp 500.000',   ed:'Total savings passed Rp 500.000',   t:c=>c.saved>=500000 },
  { id:'irit',     i:'green-heart',    f:'💚', n:'Irit Mode',        en:'Frugal Mode',      d:'Sehari cuma jajan di bawah 25rb',    ed:'Spent under Rp 25.000 in a day',    t:c=>c.iritDay },
  { id:'pagi',     i:'sunrise',        f:'🌅', n:'Morning Person',   en:'Morning Person',   d:'Nyatet sebelum jam 9 pagi',          ed:'Logged before 9 in the morning',    t:c=>c.pagi }
];
export const bName=b=>LANG==='en'?b.en:b.n;
export const bDesc=b=>LANG==='en'?b.ed:b.d;

export const EMO2ICON={'🎟️':'admission-tickets','💄':'lipstick','👜':'handbag','📱':'mobile-phone','✈️':'airplane',
  '🎧':'headphone','👟':'running-shoe','💍':'ring','📚':'books','🧸':'teddy-bear','🎂':'birthday-cake',
  '🌷':'tulip','🍓':'strawberry','🧁':'cupcake','🐰':'rabbit','🦢':'dove','🌙':'crescent-moon',
  '🫧':'cat-face','🐻':'panda','🦋':'butterfly','🍒':'cherries','🐷':'money-bag','💰':'money-bag'};
