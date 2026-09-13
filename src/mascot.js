import { LANG, t } from './i18n.js';
import { esc } from './utils.js';
import { db } from './state.js';

/* =========================================================
   9a. MASKOT "CAT ON CHAIR" — roster ras kucing + kamarnya
   ---------------------------------------------------------
   Tiap kucing punya ANATOMI sendiri, bukan cuma warna:
   bentuk muka, tinggi telinga, lebar badan, tingkat bulu,
   bentuk mata & pupil, jenis ekor, dan corak bulu.
   Kucing yang dipilih bentuknya tetap sama di semua level;
   yang berubah hanya pose, animasi, dan suasana kamarnya.
   ========================================================= */
export var csSeq = 0;

export function catState(left, jatah){
  var r = jatah > 0 ? left / jatah : (left > 0 ? 1 : 0);
  if(r >= .70) return 'lux';
  if(r >= .30) return 'chill';
  if(r >= .10) return 'watch';
  return 'box';
}
export var CAT_COL = { lux:'#A3C79B', chill:'#C0DCB4', watch:'#F5D96B', box:'#FF8299' };

/* ---------------------------------------------------------
   ROSTER
   face  : flat (pesek & lebar) | round | wedge (runcing)
   ears  : small | pointy | big | fold
   build : chonk | medium | sleek
   fluff : 0–3.4, tinggi gelombang bulu di siluet
   tail  : plume | whip | ring | tipped | point | bushy
   mark  : plain | solid | tabby | tuxedo | point | calico
   --------------------------------------------------------- */
export var CAT_KINDS = [
  { id:'mochi', n:'Mochi', en:'Mochi', jenis:'Persia putih', ejenis:'White Persian',
    fur:'#FFFFFF', fur2:'#F6EAE6', shade:'#E8D5D2', line:'#A66172',
    ear:'#FFC0D3', eye:'#93AEC2', pupil:'round', nose:'#E8908F',
    face:'flat', ears:'small', build:'chonk', fluff:3.2, tail:'plume', mark:'plain',
    tone:'#FFD9E4', room:'susu' },

  { id:'jinx', n:'Jinx', en:'Jinx', jenis:'Hitam bermata emas', ejenis:'Golden-eyed Black',
    fur:'#3B3734', fur2:'#2C2926', shade:'#57524D', line:'#1F1C1A',
    ear:'#FFAEC2', eye:'#F4C430', pupil:'slit', nose:'#E8A0A0',
    face:'wedge', ears:'big', build:'sleek', fluff:.5, tail:'whip', mark:'solid',
    tone:'#E8D8E8', room:'loteng' },

  { id:'kopi', n:'Kopi', en:'Kopi', jenis:'Tabby oranye', ejenis:'Orange Tabby',
    fur:'#EBAC60', fur2:'#D89440', shade:'#B4762C', line:'#8A5A22',
    ear:'#FFC0D3', eye:'#A3C79B', pupil:'round', nose:'#D98F7E',
    face:'round', ears:'pointy', build:'medium', fluff:1.3, tail:'ring', mark:'tabby',
    tone:'#F7E7B8', room:'kayu' },

  { id:'biru', n:'Biru', en:'Biru', jenis:'Abu tuksedo', ejenis:'Grey Tuxedo',
    fur:'#9EABB3', fur2:'#87949C', shade:'#6F7C84', line:'#525C63',
    ear:'#FFC0D3', eye:'#7FB8A6', pupil:'round', nose:'#C99C9C',
    face:'round', ears:'pointy', build:'medium', fluff:1.9, tail:'tipped', mark:'tuxedo',
    tone:'#C6DEEA', room:'teras' },

  { id:'siam', n:'Siam', en:'Siam', jenis:'Siam ujung gelap', ejenis:'Seal Point Siamese',
    fur:'#F7EDE2', fur2:'#EADCCC', shade:'#D6C4B4', line:'#A88B80',
    point:'#5E4B41', ear:'#D9A49C', eye:'#6FA8D6', pupil:'slit', nose:'#9E7C6E',
    face:'wedge', ears:'big', build:'sleek', fluff:.7, tail:'point', mark:'point',
    tone:'#E6D5C6', room:'teh' },

  { id:'bolu', n:'Bolu', en:'Bolu', jenis:'Belang tiga', ejenis:'Calico',
    fur:'#FFFDF9', fur2:'#F4E8DC', shade:'#E4D4C4', line:'#B89A88',
    patchA:'#E8A85C', patchB:'#4C443F', ear:'#FFC0D3', eye:'#A3C79B', pupil:'round', nose:'#D9948C',
    face:'flat', ears:'fold', build:'chonk', fluff:2.1, tail:'bushy', mark:'calico',
    tone:'#F5D96B', room:'roti' }
];
export var CAT_WHITE = '#FFFDF9';
export var CKMAP = {};
for(var _ci = 0; _ci < CAT_KINDS.length; _ci++) CKMAP[CAT_KINDS[_ci].id] = CAT_KINDS[_ci];
export function catKind(id){ return CKMAP[id] || CAT_KINDS[0]; }
export function catPicked(){ try{ return catKind(db.profile.cat); }catch(e){ return CAT_KINDS[0]; } }
export function ckName(c){ return LANG === 'en' ? (c.ejenis || c.jenis) : c.jenis; }

/* ukuran badan & kepala diturunkan dari anatomi di atas */
export var BUILD = { chonk:{ bw:34, bh:31 }, medium:{ bw:30, bh:30 }, sleek:{ bw:26, bh:32 } };
export var FACE  = { flat:{ hw:17.5, hh:15, er:6.9, es:.40 },
              round:{ hw:15.5, hh:15, er:6.4, es:.43 },
              wedge:{ hw:14,   hh:15.8, er:6, es:.45 } };

/* ---------------------------------------------------------
   KAMAR
   --------------------------------------------------------- */
export var ROOMS = {
  /* kamar bawaan Mochi, diselaraskan ke palet strawberry-matcha */
  susu:   { nama:'Kamar Susu', en:'Milk Room',
            wall:'#FFF3F6', wall2:'#FFE7EE', floor:'#FFF7EC', tile:'#F6E6D8',
            line:'#A66172', seat:'sofa', seatA:'#FFC0D3', seatB:'#FFAEC2', seatLine:'#D4788F',
            wood:'#E0B894', glow:'#FFF3CD', ink:'#7E7271', dark:false },
  loteng: { nama:'Loteng Malam', en:'Night Attic',
            wall:'#3F4C45', wall2:'#35413B', floor:'#2A302D', tile:'#333C38',
            line:'#A3C79B', seat:'wing', seatA:'#E79FAC', seatB:'#D4899A', seatLine:'#F3C3CD',
            wood:'#8C7A63', glow:'#F7DFA2', ink:'#CBD8C6', dark:true },
  kayu:   { nama:'Sudut Kayu', en:'Wood Corner',
            wall:'#EADCC0', wall2:'#DCC9A2', floor:'#D8B183', tile:'#C79C68',
            line:'#8A5F2C', seat:'kantor', seatA:'#A9754F', seatB:'#946243', seatLine:'#6E452A',
            wood:'#8A5F2C', glow:'#F7DFA2', ink:'#7A5A34', dark:false },
  teras:  { nama:'Teras Biru', en:'Blue Porch',
            wall:'#D7ECF5', wall2:'#B4DCEC', floor:'#FFF7EC', tile:'#E6D8C4',
            line:'#5D93A8', seat:'pantai', seatA:'#F2F8FB', seatB:'#8FC3DA', seatLine:'#5D93A8',
            wood:'#E0B894', glow:'#FFF3CD', ink:'#5D93A8', dark:false },
  teh:    { nama:'Kamar Teh', en:'Tea Room',
            wall:'#E4EFE0', wall2:'#CFE0C8', floor:'#F0E6CE', tile:'#DCCBAA',
            line:'#5D7C58', seat:'papasan', seatA:'#DCBC8E', seatB:'#C5A474', seatLine:'#8A6E48',
            wood:'#A98457', glow:'#FFF3CD', ink:'#5F7A5A', dark:false },
  roti:   { nama:'Sudut Roti', en:'Bakery Nook',
            wall:'#FFF3CD', wall2:'#F7E3AC', floor:'#FFF7EC', tile:'#F0DCBE',
            line:'#C4884B', seat:'pouf', seatA:'#FFC9B8', seatB:'#F0AE96', seatLine:'#C4805F',
            wood:'#E0B894', glow:'#FFF3CD', ink:'#A87A46', dark:false }
};
export function roomName(r){ return LANG === 'en' ? r.en : r.nama; }

/* ---------------------------------------------------------
   SUARA TIAP KUCING
   --------------------------------------------------------- */
export var CAT_LINES = {
  mochi: { lux:['Bantal anget, dompet anget. Tidur dulu ya~','Warm pillow, warm wallet. Nap time~'],
           chill:['Santai aja, masih banyak jatah kok 🐾','Relax, there is plenty left 🐾'],
           watch:['Eh eh, mangkukku mulai keliatan dasarnya!','Hey, I can see the bottom of my bowl!'],
           box:['Aku ngumpet dulu ya... dompetnya serem 📦','Hiding for a bit... the wallet is scary 📦'] },
  jinx:  { lux:['Gelap-gelap gini paling enak buat rebahan.','Nothing beats a dark room and a full bowl.'],
           chill:['Aku jagain layarmu, jangan kabur jajan.','I am watching the screen. No sneaky snacks.'],
           watch:['Mataku nggak kedip lho. Rem, sekarang.','My eyes are not blinking. Brake. Now.'],
           box:['Kardus ini rumah baruku sampai gajian.','This box is home until payday.'] },
  kopi:  { lux:['Kerjaan kelar, kopi anget, jatah aman ☕','Work done, coffee hot, budget safe ☕'],
           chill:['Pelan-pelan aja, yang penting kecatat 🐈','Slow and steady, just keep logging 🐈'],
           watch:['Anggarannya udah mepet, aku pantau nih.','Budget is tight. I am keeping score.'],
           box:['Aku pindah kantor ke dalam kardus dulu.','I relocated my office into this box.'] },
  biru:  { lux:['Angin laut, dompet tenang. Sempurna 🌊','Sea breeze, calm wallet. Perfect 🌊'],
           chill:['Ombaknya adem, jajanmu juga masih adem.','Waves are calm, and so is your spending.'],
           watch:['Airnya surut nih, jatahmu juga. Hati-hati.','The tide is low. So is your budget. Careful.'],
           box:['Liburan ditunda. Aku di kardus dulu 🥲','Vacation postponed. Box life for now 🥲'] },
  siam:  { lux:['Tehnya masih anget. Tidak ada yang perlu dicemaskan.','Tea is still warm. Nothing to worry about.'],
           chill:['Aku duduk manis. Kamu catat, aku awasi.','I sit pretty. You log, I supervise.'],
           watch:['Maaf ya, aku harus bilang: jatahmu menipis.','I must say it plainly: your budget is thinning.'],
           box:['Aku menolak keluar sampai kondisinya membaik.','I refuse to come out until this improves.'] },
  bolu:  { lux:['Wangi roti, dompet penuh. Hari yang baik 🍞','Fresh bread, full wallet. Good day 🍞'],
           chill:['Sisain satu buat aku ya, yang bulat itu.','Save me one. The round one.'],
           watch:['Roti tinggal separuh, jatahmu juga nih!','Half a loaf left, and half a budget too!'],
           box:['Kardus roti kosong. Aku tinggal di dalamnya.','The bread box is empty. I live here now.'] }
};
export function catQuote(st, catId){
  var c = catId ? catKind(catId) : catPicked();
  var l = (CAT_LINES[c.id] || CAT_LINES.mochi)[st] || CAT_LINES.mochi.chill;
  return l[LANG === 'en' ? 1 : 0];
}

/* =========================================================
   ALAT GAMBAR
   ========================================================= */
export function pth(d, fill, stroke, w, extra){
  return '<path d="' + d + '" fill="' + (fill || 'none') + '"' +
    (stroke ? ' stroke="' + stroke + '" stroke-width="' + (w || 2.2) + '" stroke-linecap="round" stroke-linejoin="round"' : '') +
    (extra || '') + '/>';
}
export function strk(d, stroke, w, extra){
  return '<path d="' + d + '" fill="none" stroke="' + stroke + '" stroke-width="' + (w || 2.2) +
    '" stroke-linecap="round" stroke-linejoin="round"' + (extra || '') + '/>';
}
export function n1(v){ return (Math.round(v * 10) / 10).toString(); }

/* Siluet berbulu: separuh atas elips dipecah jadi gelombang.
   amp = tinggi gelombang, jadi kucing gembul terlihat beda
   siluetnya dari kucing berbulu pendek.                      */
export function blob(w, h, n, amp, bot){
  var P = function(t){ return [-w * Math.cos(Math.PI * t), -h * Math.sin(Math.PI * t)]; };
  var d = 'M' + n1(-w) + ' 0', i;
  for(i = 1; i <= n; i++){
    var t1 = i / n, tm = (i - .5) / n;
    var p1 = P(t1), pm = P(tm);
    var nx = pm[0] / (w * w), ny = pm[1] / (h * h);
    var len = Math.sqrt(nx * nx + ny * ny) || 1;
    d += ' Q' + n1(pm[0] + nx / len * amp) + ' ' + n1(pm[1] + ny / len * amp) +
         ' ' + n1(p1[0]) + ' ' + n1(p1[1]);
  }
  if(bot === 'round')    d += ' C' + n1(w * .94) + ' ' + n1(h * .6) + ' ' + n1(-w * .94) + ' ' + n1(h * .6) + ' ' + n1(-w) + ' 0';
  else if(bot === 'sag') d += ' Q0 ' + n1(h * .2) + ' ' + n1(-w) + ' 0';
  else                   d += ' L' + n1(-w) + ' 0';
  return d + ' Z';
}

/* warna kaki & ekor ikut corak: tuksedo putih, siam gelap */
export function pawCol(C){ return C.mark === 'tuxedo' ? CAT_WHITE : (C.mark === 'point' ? C.point : C.fur); }
export function tipCol(C){ return C.mark === 'point' ? C.point : C.fur; }

/* garis gerak ala stiker — dipakai saat kucing panik */
export function motion(x, y, dir, n, col){
  var o = '', i;
  for(i = 0; i < n; i++)
    o += strk('M' + n1(x + dir * i * 2.5) + ' ' + n1(y + i * 5.5) + ' l' + n1(dir * 7) + ' ' + n1(-1.5),
      col, 1.9, ' opacity=".5"');
  return o;
}

/* =========================================================
   TELINGA — empat bentuk, dibedakan tinggi & lengkungnya
   ========================================================= */
export function earPath(C, F, s){
  var hw = F.hw, hh = F.hh;
  var p = function(a, b){ return n1(s * hw * a) + ' ' + n1(hh * b); };
  if(C.ears === 'small')
    return 'M' + p(.18, -.88) + ' L' + p(.92, -1.22) + ' L' + p(.94, -.52) + ' Z';
  if(C.ears === 'big')
    return 'M' + p(.1, -.94) + ' L' + p(.74, -2.02) + ' L' + p(1.0, -.5) + ' Z';
  if(C.ears === 'fold')
    return 'M' + p(.2, -.86) + ' L' + p(.6, -1.34) + ' Q' + p(1.08, -1.3) + ' ' + p(.98, -.92) +
           ' L' + p(.96, -.5) + ' Z';
  return 'M' + p(.16, -.9) + ' L' + p(.78, -1.66) + ' L' + p(.98, -.52) + ' Z';
}
export function catEars(C, F){
  var o = '', s, i;
  for(i = 0; i < 2; i++){
    s = i ? 1 : -1;
    var d = earPath(C, F, s);
    /* siam telinganya gelap, belang tiga sebelah kiri belang oranye */
    var col = C.mark === 'point' ? C.point : (C.mark === 'calico' && s < 0 ? C.patchA : C.fur);
    var bx = s * F.hw * .58, by = -F.hh * .72;
    o += '<g class="cs-ear' + (i ? ' cs-ear-2' : '') + '">' +
      pth(d, col, C.line, 2.1) +
      '<g transform="translate(' + n1(bx) + ',' + n1(by) + ') scale(.52) translate(' + n1(-bx) + ',' + n1(-by) + ')">' +
      pth(d, C.ear) + '</g></g>';
  }
  return o;
}

/* =========================================================
   MATA — besar ala stiker, dua kilau, pupil bulat atau sipit
   ========================================================= */
export function catEyes(C, F, mode){
  var ex = F.hw * .44, ey = -F.hh * .04, r = F.er;
  var garis = (C.mark === 'solid' || C.mark === 'point') ? '#FFFDF9' : '#7E7271';
  var o = '', i;
  if(mode === 'tidur' || mode === 'senang'){
    for(i = 0; i < 2; i++){
      var s = i ? 1 : -1, cx = s * ex;
      var d = mode === 'tidur'
        ? 'M' + n1(cx - r * .78) + ' ' + n1(ey - 1) + ' q' + n1(r * .78) + ' ' + n1(r * .82) + ' ' + n1(r * 1.56) + ' 0'
        : 'M' + n1(cx - r * .78) + ' ' + n1(ey + 2) + ' q' + n1(r * .78) + ' ' + n1(-r * .95) + ' ' + n1(r * 1.56) + ' 0';
      o += '<g class="cs-blink' + (i ? ' cs-blink-2' : '') + '">' + strk(d, garis, 2.6) + '</g>';
    }
    o += '<ellipse cx="' + n1(-ex - r * .75) + '" cy="' + n1(ey + r * .75) + '" rx="' + n1(r * .55) + '" ry="' + n1(r * .34) + '" fill="' + C.ear + '" opacity=".6"/>';
    o += '<ellipse cx="' + n1(ex + r * .75) + '" cy="' + n1(ey + r * .75) + '" rx="' + n1(r * .55) + '" ry="' + n1(r * .34) + '" fill="' + C.ear + '" opacity=".6"/>';
    return o;
  }
  var cemas = mode === 'cemas';
  for(i = 0; i < 2; i++){
    var sg = i ? 1 : -1, x = sg * ex;
    var pr = C.pupil === 'slit'
      ? '<ellipse cx="' + n1(x) + '" cy="' + n1(ey) + '" rx="' + n1(r * .2) + '" ry="' + n1(r * .68) + '" fill="#241F1D"/>'
      : '<ellipse cx="' + n1(x) + '" cy="' + n1(ey) + '" rx="' + n1(r * .38) + '" ry="' + n1(r * .5) + '" fill="#241F1D"/>';
    o += '<g class="cs-blink' + (i ? ' cs-blink-2' : '') + '">' +
      '<circle cx="' + n1(x) + '" cy="' + n1(ey) + '" r="' + n1(r) + '" fill="#FFFDF9" stroke="' + C.line + '" stroke-width="1.8"/>' +
      '<g class="cs-pupil"><circle cx="' + n1(x) + '" cy="' + n1(ey) + '" r="' + n1(r * .8) + '" fill="' + C.eye + '"/>' + pr + '</g>' +
      '<circle cx="' + n1(x + r * .3) + '" cy="' + n1(ey - r * .42) + '" r="' + n1(r * .27) + '" fill="#fff"/>' +
      '<circle cx="' + n1(x - r * .38) + '" cy="' + n1(ey + r * .34) + '" r="' + n1(r * .15) + '" fill="#fff" opacity=".85"/>' +
      (cemas ? strk('M' + n1(x - r * 1.05) + ' ' + n1(ey - r * .8) + ' q' + n1(r * .55) + ' ' + n1(-r * .45) + ' ' + n1(r * 1.1) + ' ' + n1(r * .1), C.line, 1.9) : '') +
      '</g>';
  }
  return o;
}

/* =========================================================
   KEPALA — satu fungsi untuk semua pose, jadi mukanya konsisten
   ========================================================= */
export function catHead(C, U, eyes){
  var F = FACE[C.face] || FACE.round;
  var hd = blob(F.hw, F.hh, C.fluff > 1.6 ? 7 : 6, C.fluff * .8, 'round');
  var cid = 'hd' + U + (csSeq++);
  var o = catEars(C, F) + pth(hd, C.fur, C.line, 2.2);

  /* corak muka, dipotong mengikuti bentuk kepala */
  var m = '';
  if(C.mark === 'tabby'){
    m += strk('M' + n1(-F.hw * .34) + ' ' + n1(-F.hh * .96) + ' v' + n1(F.hh * .34) +
              ' M0 ' + n1(-F.hh * 1.02) + ' v' + n1(F.hh * .36) +
              ' M' + n1(F.hw * .34) + ' ' + n1(-F.hh * .96) + ' v' + n1(F.hh * .34), C.shade, 2.4);
    m += pth('M' + n1(-F.hw * .5) + ' ' + n1(F.hh * .18) + ' q' + n1(F.hw * .5) + ' ' + n1(F.hh * .42) + ' ' + n1(F.hw) + ' 0' +
             ' q' + n1(-F.hw * .12) + ' ' + n1(F.hh * .44) + ' ' + n1(-F.hw * .5) + ' ' + n1(F.hh * .44) +
             ' q' + n1(-F.hw * .38) + ' 0 ' + n1(-F.hw * .5) + ' ' + n1(-F.hh * .44) + ' Z', C.fur2, '', 0, ' opacity=".6"');
  } else if(C.mark === 'tuxedo'){
    m += pth('M' + n1(-F.hw * .56) + ' ' + n1(F.hh * .1) + ' q' + n1(F.hw * .56) + ' ' + n1(F.hh * .5) + ' ' + n1(F.hw * 1.12) + ' 0' +
             ' q' + n1(-F.hw * .1) + ' ' + n1(F.hh * .56) + ' ' + n1(-F.hw * .56) + ' ' + n1(F.hh * .56) +
             ' q' + n1(-F.hw * .46) + ' 0 ' + n1(-F.hw * .56) + ' ' + n1(-F.hh * .56) + ' Z', CAT_WHITE);
    m += pth('M' + n1(-F.hw * .14) + ' ' + n1(-F.hh * 1.02) + ' q' + n1(F.hw * .14) + ' -2 ' + n1(F.hw * .28) + ' 0' +
             ' L' + n1(F.hw * .1) + ' ' + n1(F.hh * .12) + ' q' + n1(-F.hw * .1) + ' 2 ' + n1(-F.hw * .2) + ' 0 Z', CAT_WHITE);
  } else if(C.mark === 'point'){
    m += '<ellipse cx="0" cy="' + n1(F.hh * .2) + '" rx="' + n1(F.hw * .86) + '" ry="' + n1(F.hh * .74) + '" fill="' + C.point + '" opacity=".92"/>';
    m += '<ellipse cx="0" cy="' + n1(-F.hh * .12) + '" rx="' + n1(F.hw * 1.05) + '" ry="' + n1(F.hh * .42) + '" fill="' + C.point + '" opacity=".55"/>';
  } else if(C.mark === 'calico'){
    m += pth('M' + n1(-F.hw * 1.1) + ' ' + n1(-F.hh * 1.1) + ' q' + n1(F.hw * .9) + ' ' + n1(-F.hh * .1) + ' ' + n1(F.hw * .95) + ' ' + n1(F.hh * .55) +
             ' q' + n1(-F.hw * .5) + ' ' + n1(F.hh * .5) + ' ' + n1(-F.hw * 1.05) + ' ' + n1(F.hh * .1) + ' Z', C.patchA, '', 0, ' opacity=".95"');
    m += pth('M' + n1(F.hw * .42) + ' ' + n1(-F.hh * 1.16) + ' q' + n1(F.hw * .8) + ' ' + n1(F.hh * .3) + ' ' + n1(F.hw * .55) + ' ' + n1(F.hh * .82) +
             ' q' + n1(-F.hw * .55) + ' ' + n1(-F.hh * .1) + ' ' + n1(-F.hw * .55) + ' ' + n1(-F.hh * .82) + ' Z', C.patchB, '', 0, ' opacity=".95"');
  } else if(C.mark === 'plain'){
    m += pth('M' + n1(-F.hw * .5) + ' ' + n1(F.hh * .16) + ' q' + n1(F.hw * .5) + ' ' + n1(F.hh * .44) + ' ' + n1(F.hw) + ' 0' +
             ' q' + n1(-F.hw * .12) + ' ' + n1(F.hh * .46) + ' ' + n1(-F.hw * .5) + ' ' + n1(F.hh * .46) +
             ' q' + n1(-F.hw * .38) + ' 0 ' + n1(-F.hw * .5) + ' ' + n1(-F.hh * .46) + ' Z', C.fur2, '', 0, ' opacity=".75"');
  } else {
    m += strk('M' + n1(-F.hw * .62) + ' ' + n1(-F.hh * .76) + ' q' + n1(F.hw * .5) + ' ' + n1(-F.hh * .26) + ' ' + n1(F.hw * .95) + ' ' + n1(F.hh * .06), C.shade, 3, ' opacity=".5"');
  }
  if(m) o += '<clipPath id="' + cid + '"><path d="' + hd + '"/></clipPath>' +
             '<g clip-path="url(#' + cid + ')">' + m + '</g>';

  o += pth(hd, 'none', C.line, 2.2);
  o += catEyes(C, F, eyes);

  /* hidung, mulut, kumis */
  var ny = F.hh * .36;
  o += pth('M' + n1(-2.6) + ' ' + n1(ny) + ' L2.6 ' + n1(ny) + ' L0 ' + n1(ny + 2.8) + ' Z', C.nose);
  o += strk('M0 ' + n1(ny + 2.8) + ' q-3.6 3.6 -7 .8 M0 ' + n1(ny + 2.8) + ' q3.6 3.6 7 .8',
        C.mark === 'point' ? '#F0E4D6' : C.nose, 1.6);
  var wl = C.face === 'wedge' ? 13 : 11, wy = F.hh * .3;
  var wc = (C.mark === 'solid' || C.mark === 'point') ? '#FFFDF9' : C.line;
  o += strk('M' + n1(-F.hw * .8) + ' ' + n1(wy) + ' q-6 -1.5 -' + wl + ' -3' +
            ' M' + n1(-F.hw * .8) + ' ' + n1(wy + 4) + ' q-6 1 -' + wl + ' 3' +
            ' M' + n1(F.hw * .8) + ' ' + n1(wy) + ' q6 -1.5 ' + wl + ' -3' +
            ' M' + n1(F.hw * .8) + ' ' + n1(wy + 4) + ' q6 1 ' + wl + ' 3', wc, 1.3, ' opacity=".66"');
  return o;
}

/* =========================================================
   EKOR — enam jenis, tebal & lengkungnya beda-beda
   ========================================================= */
export function catTail(C, w, h, pose){
  var t = C.tail, col = tipCol(C), lw = { plume:15, bushy:13, ring:10, tipped:10, point:9, whip:7 }[t] || 10;
  var d, ex, ey;
  if(pose === 'sprawl'){
    ex = w * 1.12; ey = -h * 1.3;
    d = 'M' + n1(w * .84) + ' ' + n1(-h * .2) + ' C' + n1(w * 1.55) + ' ' + n1(-h * .38) +
        ' ' + n1(w * 1.66) + ' ' + n1(-h * 1.0) + ' ' + n1(ex) + ' ' + n1(ey);
  } else if(pose === 'loaf'){
    ex = w * .06; ey = h * .3;
    d = 'M' + n1(w * .8) + ' ' + n1(-h * .12) + ' C' + n1(w * 1.42) + ' ' + n1(h * .2) +
        ' ' + n1(w * .7) + ' ' + n1(h * .48) + ' ' + n1(ex) + ' ' + n1(ey);
  } else {
    ex = w * 1.32; ey = -h * .72;
    d = 'M' + n1(w * .72) + ' ' + n1(h * .04) + ' C' + n1(w * 1.95) + ' ' + n1(h * .14) +
        ' ' + n1(w * 2.1) + ' ' + n1(-h * .44) + ' ' + n1(ex) + ' ' + n1(ey);
  }
  var o = strk(d, C.line, lw + 4) + strk(d, col, lw);
  if(t === 'ring'){
    o += strk(pose === 'loaf'
      ? 'M' + n1(w * 1.16) + ' ' + n1(h * .18) + ' l1 4 M' + n1(w * .82) + ' ' + n1(h * .4) + ' l1 4'
      : 'M' + n1(w * 1.3) + ' ' + n1(-h * .28) + ' l4 1.5 M' + n1(w * 1.48) + ' ' + n1(-h * .7) + ' l4 1',
      C.shade, 3.4);
  }
  if(t === 'tipped' || t === 'point'){
    o += '<circle cx="' + n1(ex) + '" cy="' + n1(ey) + '" r="' + n1(lw * .58) + '" fill="' +
      (t === 'tipped' ? CAT_WHITE : C.point) + '" stroke="' + C.line + '" stroke-width="2"/>';
  }
  if(t === 'plume' || t === 'bushy'){
    o += '<circle cx="' + n1(ex) + '" cy="' + n1(ey) + '" r="' + n1(lw * .72) + '" fill="' + col + '" stroke="' + C.line + '" stroke-width="2.1"/>';
  }
  return o;
}

/* =========================================================
   CORAK BADAN — dipotong mengikuti siluet tiap pose
   ========================================================= */
export function catMarks(C, U, pose, body, w, h){
  var id = 'bd' + U + pose + (csSeq++), o = '';
  if(C.mark === 'tabby'){
    var i, k = 4;
    for(i = 0; i < k; i++){
      var x = -w * .58 + i * (w * 1.16 / (k - 1));
      o += strk('M' + n1(x) + ' ' + n1(-h * 1.02) + ' q' + n1(w * .1) + ' ' + n1(h * .34) + ' ' + n1(w * .02) + ' ' + n1(h * .6), C.shade, 3.6, ' opacity=".85"');
    }
  } else if(C.mark === 'tuxedo'){
    o += pth('M' + n1(-w * .5) + ' ' + n1(-h * .5) + ' q' + n1(w * .52) + ' ' + n1(-h * .24) + ' ' + n1(w * 1.02) + ' ' + n1(h * .06) +
             ' q' + n1(-w * .06) + ' ' + n1(h * .66) + ' ' + n1(-w * .52) + ' ' + n1(h * .7) +
             ' q' + n1(-w * .46) + ' ' + n1(-h * .06) + ' ' + n1(-w * .5) + ' ' + n1(-h * .76) + ' Z', CAT_WHITE, '', 0, ' opacity=".96"');
  } else if(C.mark === 'calico'){
    o += pth('M' + n1(-w * 1.05) + ' ' + n1(-h * .5) + ' q' + n1(w * .6) + ' ' + n1(-h * .55) + ' ' + n1(w * .95) + ' ' + n1(-h * .05) +
             ' q' + n1(-w * .35) + ' ' + n1(h * .6) + ' ' + n1(-w * .95) + ' ' + n1(h * .5) + ' Z', C.patchA, '', 0, ' opacity=".95"');
    o += pth('M' + n1(w * .18) + ' ' + n1(-h * 1.12) + ' q' + n1(w * .66) + ' ' + n1(h * .16) + ' ' + n1(w * .72) + ' ' + n1(h * .72) +
             ' q' + n1(-w * .6) + ' ' + n1(h * .24) + ' ' + n1(-w * .78) + ' ' + n1(-h * .34) + ' Z', C.patchB, '', 0, ' opacity=".95"');
    o += pth('M' + n1(-w * .3) + ' ' + n1(h * .34) + ' q' + n1(w * .3) + ' ' + n1(-h * .3) + ' ' + n1(w * .56) + ' ' + n1(h * .06) +
             ' q' + n1(-w * .2) + ' ' + n1(h * .3) + ' ' + n1(-w * .56) + ' ' + n1(-h * .06) + ' Z', C.patchA, '', 0, ' opacity=".8"');
  } else if(C.mark === 'point'){
    o += strk('M' + n1(-w * .7) + ' ' + n1(h * .12) + ' q' + n1(w * .7) + ' ' + n1(h * .3) + ' ' + n1(w * 1.4) + ' 0', C.shade, 3, ' opacity=".35"');
  } else if(C.mark === 'plain'){
    o += strk('M' + n1(-w * .66) + ' ' + n1(-h * .06) + ' q' + n1(w * .66) + ' ' + n1(h * .34) + ' ' + n1(w * 1.3) + ' ' + n1(-h * .04), C.fur2, 3.4, ' opacity=".85"');
  } else {
    o += strk('M' + n1(-w * .5) + ' ' + n1(-h * .94) + ' q' + n1(w * .6) + ' ' + n1(-h * .12) + ' ' + n1(w * 1.05) + ' ' + n1(h * .18), C.shade, 3.6, ' opacity=".5"');
  }
  return '<clipPath id="' + id + '"><path d="' + body + '"/></clipPath>' +
         '<g clip-path="url(#' + id + ')">' + o + '</g>';
}

/* =========================================================
   POSE — ukuran badan & posisi kepala ikut anatomi kucingnya
   ========================================================= */
export function bodyGeom(C, pose){
  var B = BUILD[C.build] || BUILD.medium;
  if(pose === 'sprawl') return { w:B.bw * 1.28, h:B.bh * .78, bot:'sag',  n:7 };
  if(pose === 'loaf')   return { w:B.bw * 1.02, h:B.bh * .84, bot:'flat', n:7 };
  return { w:B.bw * .76, h:B.bh * 1.06, bot:'flat', n:6 };
}
export function paw(C, x, y, r){
  return pth('M' + n1(x - r) + ' ' + n1(y) + ' q' + n1(r) + ' ' + n1(-r * 1.5) + ' ' + n1(r * 2) + ' 0' +
             ' q' + n1(-r * .1) + ' ' + n1(r * .9) + ' ' + n1(-r) + ' ' + n1(r * .9) +
             ' q' + n1(-r * .9) + ' 0 ' + n1(-r) + ' ' + n1(-r * .9) + ' Z', pawCol(C), C.line, 1.9);
}

export function poseSprawl(C, U){
  var g = bodyGeom(C, 'sprawl'), F = FACE[C.face] || FACE.round;
  var body = blob(g.w, g.h, g.n, C.fluff, g.bot);
  var hx = -g.w + F.hw * .5, hy = -g.h * .46;
  var o = '<g class="cs-tail-slow">' + catTail(C, g.w, g.h, 'sprawl') + '</g>';
  o += '<g class="cs-breathe">' + pth(body, C.fur, C.line, 2.2) + catMarks(C, U, 'sprawl', body, g.w, g.h);
  o += '<g class="cs-knead">' + paw(C, -g.w * .28, g.h * .16, 8) + '</g>';
  o += '<g class="cs-knead cs-knead-2">' + paw(C, g.w * .06, g.h * .2, 8) + '</g>';
  o += '</g>';
  o += '<g transform="translate(' + n1(hx) + ',' + n1(hy) + ')">' + catHead(C, U, 'tidur') + '</g>';
  o += '<g fill="' + C.line + '" font-family="Shantell Sans, Comic Sans MS, cursive" font-weight="700" opacity=".85">' +
    '<text class="cs-z" x="' + n1(hx + 14) + '" y="' + n1(hy - 26) + '" font-size="11">z</text>' +
    '<text class="cs-z cs-z-2" x="' + n1(hx + 25) + '" y="' + n1(hy - 34) + '" font-size="14">z</text>' +
    '<text class="cs-z cs-z-3" x="' + n1(hx + 37) + '" y="' + n1(hy - 42) + '" font-size="17">z</text></g>';
  return o;
}

export function poseLoaf(C, U){
  var g = bodyGeom(C, 'loaf'), F = FACE[C.face] || FACE.round;
  var body = blob(g.w, g.h, g.n, C.fluff, g.bot);
  var hx = -g.w * .34, hy = -g.h * .82;
  var o = '<g class="cs-tail">' + catTail(C, g.w, g.h, 'loaf') + '</g>';
  o += '<g class="cs-breathe">' + pth(body, C.fur, C.line, 2.2) + catMarks(C, U, 'loaf', body, g.w, g.h);
  o += paw(C, -g.w * .34, g.h * .04, 8.5) + paw(C, g.w * .06, g.h * .04, 8.5);
  o += '<g transform="translate(' + n1(hx) + ',' + n1(hy) + ')"><g class="cs-groom">' + catHead(C, U, 'senang') + '</g></g>';
  o += '</g>';
  return o;
}

export function poseSit(C, U){
  var g = bodyGeom(C, 'sit'), F = FACE[C.face] || FACE.round;
  var body = blob(g.w, g.h, g.n, C.fluff, g.bot);
  var hy = -g.h - F.hh * .48;
  var o = '<g class="cs-tail-flick">' + catTail(C, g.w, g.h, 'sit') + '</g>';
  o += '<g class="cs-breathe-fast">' + pth(body, C.fur, C.line, 2.2) + catMarks(C, U, 'sit', body, g.w, g.h);
  o += paw(C, -g.w * .42, g.h * .02, 8.5) + paw(C, g.w * .42, g.h * .02, 8.5);
  o += '<g transform="translate(0,' + n1(hy) + ')">' + catHead(C, U, 'melek') + '</g>';
  o += '</g>';
  o += motion(g.w * 1.5, -g.h * .5, 1, 3, C.line);
  o += '<path class="cs-drop" d="M' + n1(g.w * .9) + ' ' + n1(hy - 12) + ' q3.4 5.4 0 7.4 q-3.4 -2 0 -7.4 z" fill="#93AEC2"/>';
  o += '<g transform="translate(' + n1(-g.w * 1.12) + ',' + n1(hy - 14) + ')"><g class="cs-bob">' +
    strk('M0 -6 V4', '#FF8299', 3) + '<circle cy="8" r="1.9" fill="#FF8299"/></g></g>';
  return o;
}

export function posePeek(C, U){
  return '<g class="cs-peek"><g class="cs-shiver">' +
    '<g transform="translate(0,-2)">' + catHead(C, U, 'cemas') + '</g></g>' +
    motion(20, -18, 1, 2, C.line) + motion(-26, -18, -1, 2, C.line) +
    '<path class="cs-drop" d="M20 -16 q3.4 5.4 0 7.4 q-3.4 -2 0 -7.4 z" fill="#93AEC2"/></g>';
}
export function catPaws(C){ return paw(C, -11, 10, 7) + paw(C, 11, 10, 7); }

/* =========================================================
   KAMAR — latar, lantai, perabot, pernak-pernik
   ========================================================= */
export var HOR = 118;                 /* batas dinding & lantai */

export function floorLines(R, n, spread, w, op){
  var o = '', i;
  for(i = 0; i <= n; i++){
    var x = -40 + (i * (400 + spread) / n);
    o += strk('M' + (160 + (x - 160) * .34).toFixed(1) + ' ' + HOR + ' L' + x.toFixed(1) + ' 196', R.line, w || 1.3, ' opacity="' + (op || .3) + '"');
  }
  return o;
}

export function roomSusu(R, st, U){
  var o = '';
  o += '<rect x="-12" y="-12" width="344" height="' + (HOR + 12) + '" fill="' + R.wall + '"/>';
  for(var i = 0; i < 13; i++) o += '<rect x="' + (-8 + i * 27) + '" y="-12" width="11" height="' + (HOR + 12) + '" fill="' + R.wall2 + '" opacity=".5"/>';
  o += '<rect x="-12" y="94" width="344" height="24" fill="' + R.wall2 + '"/>';
  o += strk('M-12 94 H332', R.line, 2, ' opacity=".4"');
  o += '<rect x="-12" y="' + HOR + '" width="344" height="74" fill="' + R.floor + '"/>';
  o += '<rect x="-12" y="' + HOR + '" width="344" height="74" fill="url(#tl' + U + ')"/>';
  o += strk('M-12 ' + HOR + ' H332', R.line, 2.6);
  if(st !== 'box'){
    o += '<g opacity=".92">' + strk('M-6 12 Q80 30 160 22 Q244 13 326 24', R.line, 1.8);
    var fl = ['#FFC0D3', '#F5D96B', '#A3C79B', '#FFC0D3', '#F5D96B', '#A3C79B', '#FFC0D3'];
    var sg = [[-6,12,80,30,160,22,.18],[-6,12,80,30,160,22,.5],[-6,12,80,30,160,22,.82],
              [160,22,244,13,326,24,.14],[160,22,244,13,326,24,.37],[160,22,244,13,326,24,.61],[160,22,244,13,326,24,.85]];
    for(var b = 0; b < sg.length; b++){
      var q = sg[b], t = q[6], u = 1 - t;
      var bx = u*u*q[0] + 2*u*t*q[2] + t*t*q[4], by = u*u*q[1] + 2*u*t*q[3] + t*t*q[5];
      o += pth('M' + (bx-7).toFixed(1) + ' ' + (by-1).toFixed(1) + ' L' + (bx+7).toFixed(1) + ' ' + (by+1).toFixed(1) +
               ' L' + bx.toFixed(1) + ' ' + (by+15).toFixed(1) + ' Z', fl[b], R.line, 1.6);
    }
    o += '</g>';
  }
  o += frameArt(R, 28, 36, '#FFC0D3');
  if(st === 'lux'){
    o += '<g transform="translate(240,0)"><g class="cs-bob-2">' +
      strk('M0 58 C5 70 -4 78 1 90', R.line, 1.6, ' opacity=".6"') +
      '<circle cy="40" r="17" fill="#F5D96B" stroke="' + R.line + '" stroke-width="2.4"/>' +
      '<circle cy="40" r="6" fill="' + R.wall + '" stroke="' + R.line + '" stroke-width="2"/>' +
      strk('M-14 34 q5 4 10 -1 q5 5 11 0', '#FFFDF9', 2) +
      strk('M-9 48 q4 4 9 0', '#FFFDF9', 1.8, ' opacity=".8"') + '</g></g>';
  } else o += wallClock(R, 240, 42);
  o += sideTable(R, 44, st === 'box' ? 'layu' : 'bunga');
  o += floorLamp(R, 288, st, U);
  return o;
}

export function roomLoteng(R, st, U){
  var o = '';
  o += '<rect x="-12" y="-12" width="344" height="' + (HOR + 12) + '" fill="' + R.wall + '"/>';
  o += '<rect x="-12" y="86" width="344" height="32" fill="' + R.wall2 + '"/>';
  o += strk('M-12 86 H332', R.line, 2, ' opacity=".35"');
  o += '<rect x="-12" y="' + HOR + '" width="344" height="74" fill="' + R.floor + '"/>';
  o += floorLines(R, 11, 120, 1.4, .34);
  o += strk('M-12 132 H332 M-12 150 H332 M-12 174 H332', R.line, 1.4, ' opacity=".3"');
  o += strk('M-12 ' + HOR + ' H332', R.line, 2.6);
  o += '<g transform="translate(252,42)">' +
    '<circle r="26" fill="#26312C" stroke="' + R.line + '" stroke-width="2.6"/>' +
    '<path d="M7 -10 a11 11 0 1 0 0 20 a13 13 0 0 1 0 -20 z" fill="#FFF3CD"/>' +
    strk('M0 -26 V26 M-26 0 H26', R.line, 2.2) + '</g>';
  if(st !== 'box'){
    o += '<g class="cs-twinkle"><circle cx="196" cy="22" r="2" fill="#FFF3CD"/></g>' +
         '<g class="cs-twinkle cs-twinkle-2"><circle cx="300" cy="18" r="1.6" fill="#FFF3CD"/></g>' +
         '<g class="cs-twinkle cs-twinkle-3"><circle cx="212" cy="60" r="1.4" fill="#FFF3CD"/></g>';
    o += strk('M-6 16 Q70 40 150 28', R.line, 1.6, ' opacity=".55"');
    for(var k = 0; k < 6; k++){
      var t2 = (k + .6) / 6.4, u2 = 1 - t2;
      var lx = u2*u2*-6 + 2*u2*t2*70 + t2*t2*150, ly = u2*u2*16 + 2*u2*t2*40 + t2*t2*28;
      o += '<g class="cs-twinkle' + (k % 3 ? ' cs-twinkle-' + (k % 3 + 1) : '') + '">' +
           '<circle cx="' + lx.toFixed(1) + '" cy="' + (ly + 7).toFixed(1) + '" r="3.4" fill="#FFF3CD"/></g>' +
           strk('M' + lx.toFixed(1) + ' ' + ly.toFixed(1) + ' v5', R.line, 1.2, ' opacity=".5"');
    }
  }
  o += frameArt(R, 26, 40, '#FFAEC2');
  o += sideTable(R, 48, st === 'box' ? 'layu' : 'mug');
  o += floorLamp(R, 290, st, U);
  return o;
}

export function roomKayu(R, st, U){
  var o = '';
  o += '<rect x="-12" y="-12" width="344" height="' + (HOR + 12) + '" fill="' + R.wall + '"/>';
  o += '<rect x="-12" y="90" width="344" height="28" fill="' + R.wall2 + '"/>';
  o += strk('M-12 90 H332', R.line, 2.2, ' opacity=".45"');
  o += '<rect x="-12" y="' + HOR + '" width="344" height="74" fill="' + R.floor + '"/>';
  o += strk('M-12 130 H332 M-12 144 H332 M-12 160 H332 M-12 178 H332', R.line, 1.6, ' opacity=".35"');
  o += strk('M60 118 V130 M210 118 V130 M120 130 V144 M268 130 V144 M40 144 V160 M180 144 V160 M96 160 V178 M250 160 V178', R.line, 1.4, ' opacity=".3"');
  o += strk('M-12 ' + HOR + ' H332', R.line, 2.6);
  if(st !== 'box'){
    o += '<g transform="translate(44,0)">' + strk('M-26 52 H26', R.line, 3);
    var bc = ['#FF9EAA', '#A3C79B', '#F5D96B', '#C9974F'];
    for(var i2 = 0; i2 < 4; i2++) o += pth('M' + (-20 + i2 * 11) + ' 52 v-' + (16 + (i2 % 2) * 5) + ' h8 v' + (16 + (i2 % 2) * 5) + ' z', bc[i2], R.line, 1.8);
    o += '</g>';
  }
  o += frameArt(R, 230, 26, '#A3C79B');
  o += '<g transform="translate(292,0)">' +
    pth('M-15 118 h30 l-5 26 h-20 z', '#E8A392', R.line, 2.2) +
    strk('M0 118 V88', '#5D7C58', 2.6) +
    pth('M0 96 C-18 94 -26 78 -14 70 C-2 72 2 86 0 96 Z', '#A3C79B', R.line, 1.8) +
    pth('M0 92 C16 88 24 72 12 66 C1 70 -2 82 0 92 Z', '#C0DCB4', R.line, 1.8) +
    pth('M0 84 C-12 76 -10 62 2 60 C10 66 8 78 0 84 Z', '#8FB886', R.line, 1.8) + '</g>';
  o += sideTable(R, 48, st === 'box' ? 'layu' : 'mug');
  return o;
}

export function roomTeras(R, st, U){
  var o = '';
  o += '<rect x="-12" y="-12" width="344" height="' + (HOR + 12) + '" fill="' + R.wall + '"/>';
  o += '<rect x="-12" y="52" width="344" height="26" fill="' + R.wall2 + '"/>';
  o += strk('M-12 60 q18 -5 34 0 t34 0 t34 0 t34 0 t34 0 t34 0 t34 0 t34 0 t34 0', '#F2F8FB', 2, ' opacity=".8"');
  o += strk('M-12 70 q22 -5 42 0 t42 0 t42 0 t42 0 t42 0 t42 0 t42 0', '#F2F8FB', 1.8, ' opacity=".6"');
  if(st !== 'box'){
    o += '<circle cx="268" cy="28" r="15" fill="#FFF3CD" stroke="' + R.line + '" stroke-width="2.2"/>';
    o += '<g class="cs-bob"><path d="M56 30 q-10 0 -10 -8 q0 -8 10 -7 q3 -9 13 -6 q9 -6 15 4 q10 0 9 9 q-1 8 -11 8 z" fill="#FFFDFB" stroke="' + R.line + '" stroke-width="2"/></g>';
  }
  o += '<rect x="-12" y="78" width="344" height="40" fill="' + R.floor + '"/>';
  o += strk('M-12 82 H332 M-12 108 H332', R.line, 2.4);
  for(var p = 0; p < 14; p++) o += strk('M' + (-4 + p * 25) + ' 82 V108', R.line, 1.8, ' opacity=".55"');
  o += '<rect x="-12" y="' + HOR + '" width="344" height="74" fill="' + R.floor + '"/>';
  o += floorLines(R, 13, 90, 1.5, .38);
  o += strk('M-12 ' + HOR + ' H332', R.line, 2.6);
  o += '<g><ellipse cx="162" cy="150" rx="112" ry="20" fill="#F2F8FB" stroke="' + R.line + '" stroke-width="2.2"/>' +
    '<clipPath id="mt' + U + '"><ellipse cx="162" cy="150" rx="112" ry="20"/></clipPath>' +
    '<g clip-path="url(#mt' + U + ')">';
  for(var s2 = 0; s2 < 7; s2++) o += '<path d="M' + (66 + s2 * 32) + ' 128 v44" stroke="#8FC3DA" stroke-width="9" fill="none" opacity=".7"/>';
  o += '</g><ellipse cx="162" cy="150" rx="112" ry="20" fill="none" stroke="' + R.line + '" stroke-width="2.2"/></g>';
  o += sideTable(R, 46, st === 'box' ? 'layu' : 'kelapa');
  if(st !== 'box') o += '<g transform="translate(292,0)"><g class="cs-bob-2">' +
    strk('M0 16 V44', R.line, 1.6) +
    pth('M-11 44 h22 l-3 22 h-16 z', '#FFF3CD', R.line, 2.2) +
    strk('M-8 52 H8', R.line, 1.6, ' opacity=".6"') + '</g></g>';
  return o;
}

/* ---- Kamar Teh · dinding tenang, lantai tatami ---- */
export function roomTeh(R, st, U){
  var o = '', i;
  o += '<rect x="-12" y="-12" width="344" height="' + (HOR + 12) + '" fill="' + R.wall + '"/>';
  o += '<rect x="-12" y="92" width="344" height="26" fill="' + R.wall2 + '"/>';
  o += strk('M-12 92 H332', R.line, 2.2, ' opacity=".45"');
  o += '<rect x="-12" y="' + HOR + '" width="344" height="74" fill="' + R.floor + '"/>';
  for(i = 0; i < 5; i++){
    o += '<rect x="' + (-20 + i * 76) + '" y="122" width="70" height="26" rx="2" fill="none" stroke="' + R.line + '" stroke-width="2" opacity=".4"/>';
    o += '<rect x="' + (-46 + i * 88) + '" y="152" width="82" height="32" rx="2" fill="none" stroke="' + R.line + '" stroke-width="2" opacity=".34"/>';
  }
  o += strk('M-12 ' + HOR + ' H332', R.line, 2.6);
  o += '<g transform="translate(248,44)">' +
    '<circle r="27" fill="#F1F7EE" stroke="' + R.line + '" stroke-width="2.6"/>' +
    strk('M-27 0 H27 M0 -27 V27', R.line, 2) +
    strk('M-16 14 q10 -16 22 -6', '#8FB886', 2.4) + '</g>';
  if(st !== 'box'){
    o += '<g transform="translate(60,0)">' +
      strk('M0 -4 V16', R.line, 1.6) +
      '<rect x="-17" y="16" width="34" height="46" rx="3" fill="#FFFDF9" stroke="' + R.line + '" stroke-width="2.4"/>' +
      strk('M-7 26 q9 6 2 14 q-6 6 3 12', R.line, 2.2, ' opacity=".65"') + '</g>';
    o += '<g transform="translate(158,0)"><g class="cs-bob">' +
      strk('M0 -6 V14', R.line, 1.6) +
      '<ellipse cx="0" cy="28" rx="16" ry="14" fill="#FFDFC4" stroke="' + R.line + '" stroke-width="2.4"/>' +
      strk('M-15 22 H15 M-16 28 H16 M-15 34 H15', R.line, 1.4, ' opacity=".5"') +
      strk('M0 42 V50', '#A66172', 2) + '</g></g>';
  }
  o += '<g transform="translate(294,0)">' +
    pth('M-14 112 h28 l-4 20 h-20 z', '#A98457', R.line, 2.2) +
    strk('M0 112 V96 M0 104 L-10 96 M0 100 L10 92', '#8A6E48', 2.4) +
    '<ellipse cx="-13" cy="92" rx="12" ry="8" fill="#A3C79B" stroke="' + R.line + '" stroke-width="2"/>' +
    '<ellipse cx="11" cy="87" rx="13" ry="9" fill="#C0DCB4" stroke="' + R.line + '" stroke-width="2"/></g>';
  o += sideTable(R, 46, st === 'box' ? 'layu' : 'mug');
  return o;
}

/* ---- Sudut Roti · dinding mentega, lantai kotak-kotak ---- */
export function roomRoti(R, st, U){
  var o = '', i, j;
  o += '<rect x="-12" y="-12" width="344" height="' + (HOR + 12) + '" fill="' + R.wall + '"/>';
  for(i = 0; i < 10; i++) for(j = 0; j < 4; j++)
    o += '<circle cx="' + (-4 + i * 36 + (j % 2) * 18) + '" cy="' + (4 + j * 30) + '" r="3.2" fill="' + R.wall2 + '"/>';
  o += '<rect x="-12" y="94" width="344" height="24" fill="' + R.wall2 + '" opacity=".8"/>';
  o += strk('M-12 94 H332', R.line, 2.2, ' opacity=".45"');
  o += '<rect x="-12" y="' + HOR + '" width="344" height="74" fill="' + R.floor + '"/>';
  o += '<rect x="-12" y="' + HOR + '" width="344" height="74" fill="url(#tl' + U + ')"/>';
  o += strk('M-12 ' + HOR + ' H332', R.line, 2.6);
  if(st !== 'box'){
    o += '<g transform="translate(58,0)">' + strk('M-34 58 H34 M-34 24 H34', R.line, 3);
    var rt = ['#E8B36A', '#D89A4E', '#F0C88A'];
    for(i = 0; i < 3; i++) o += pth('M' + (-28 + i * 21) + ' 58 q4 -14 16 -14 q12 0 16 14 z', rt[i], R.line, 2);
    for(i = 0; i < 2; i++) o += '<ellipse cx="' + (-14 + i * 28) + '" cy="17" rx="12" ry="7" fill="' + rt[i] + '" stroke="' + R.line + '" stroke-width="2"/>';
    o += '</g>';
    o += '<g transform="translate(216,0)"><g class="cs-bob-2">' +
      strk('M0 -4 V12', R.line, 1.6) +
      '<ellipse cx="0" cy="24" rx="15" ry="12" fill="#D8CCC0" stroke="' + R.line + '" stroke-width="2.4"/>' +
      strk('M13 30 L26 42', R.line, 3) + '</g></g>';
  }
  o += frameArt(R, 268, 40, '#FFC0D3');
  o += sideTable(R, 46, st === 'box' ? 'layu' : 'mug');
  return o;
}

/* ---- elemen kamar yang dipakai bareng ---- */
export function frameArt(R, x, y, col){
  return '<g transform="translate(' + x + ',' + y + ') rotate(-3)">' +
    '<rect x="0" y="0" width="42" height="34" rx="3" fill="#FFFDF9" stroke="' + R.line + '" stroke-width="2.4"/>' +
    '<rect x="4" y="4" width="34" height="26" rx="2" fill="' + col + '"/>' +
    '<ellipse cx="21" cy="22" rx="7.5" ry="6" fill="#FFFDF9"/>' +
    '<ellipse cx="13" cy="13" rx="3" ry="3.8" fill="#FFFDF9"/>' +
    '<ellipse cx="19" cy="10" rx="3" ry="4" fill="#FFFDF9"/>' +
    '<ellipse cx="25" cy="10" rx="3" ry="4" fill="#FFFDF9"/>' +
    '<ellipse cx="30" cy="13" rx="3" ry="3.8" fill="#FFFDF9"/></g>';
}
export function wallClock(R, x, y){
  return '<g transform="translate(' + x + ',' + y + ')">' +
    '<circle r="16" fill="#FFFDF9" stroke="' + R.line + '" stroke-width="2.4"/>' +
    strk('M0 -11 V0', R.line, 1.6, ' opacity=".5"') +
    '<g class="cs-tick">' + strk('M0 2 V-9', R.line, 2) + '</g>' +
    strk('M0 0 L7 4', R.line, 1.8) + '<circle r="1.8" fill="' + R.line + '"/></g>';
}
export function sideTable(R, x, atas){
  var o = '<g transform="translate(' + x + ',0)">' +
    '<rect x="-22" y="106" width="44" height="7" rx="3" fill="' + R.wood + '" stroke="' + R.line + '" stroke-width="2.2"/>' +
    strk('M-16 113 L-19 146 M16 113 L19 146', R.line, 2.4);
  if(atas === 'bunga'){
    o += pth('M-8 106 L-6 92 H6 L8 106 Z', '#C6DEEA', R.line, 2.2) +
      strk('M0 92 V78 M0 84 C-8 82 -10 74 -6 70 M0 82 C8 80 10 72 6 68', '#A3C79B', 1.8) +
      '<g class="cs-bob"><circle cx="-7" cy="68" r="5" fill="#FFC0D3" stroke="' + R.line + '" stroke-width="1.8"/>' +
      '<circle cx="7" cy="66" r="4.5" fill="#F5D96B" stroke="' + R.line + '" stroke-width="1.8"/></g>';
  } else if(atas === 'mug'){
    o += pth('M-9 94 H7 L5 106 H-7 Z', '#FFFDF9', R.line, 2.2) +
      strk('M7 97 q6 3 -1 7', R.line, 2) + strk('M-8 98 H6', R.line, 1.6, ' opacity=".5"') +
      '<g stroke="' + R.line + '" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".75">' +
      '<path class="cs-steam" d="M-4 90 q3 -4 0 -8"/>' +
      '<path class="cs-steam cs-steam-2" d="M1 90 q3 -4 0 -8"/>' +
      '<path class="cs-steam cs-steam-3" d="M-2 90 q4 -5 1 -9"/></g>';
  } else if(atas === 'kelapa'){
    o += '<circle cx="0" cy="98" r="9" fill="#A3C79B" stroke="' + R.line + '" stroke-width="2.2"/>' +
      strk('M2 90 q6 -9 12 -10', '#F2F8FB', 2.4) + '<circle cx="15" cy="79" r="2.4" fill="#FFC0D3"/>';
  } else {
    o += pth('M-7 106 L-5 94 H5 L7 106 Z', '#E6D8C4', R.line, 2.2) +
      strk('M0 94 V84 M0 88 C-6 88 -9 82 -12 86 M0 86 C6 88 9 82 12 88', '#B8B8A4', 1.8);
  }
  return o + '</g>';
}
export function floorLamp(R, x, st, U){
  return '<g transform="translate(' + x + ',0)">' +
    (st === 'box' ? '' : '<circle cx="-2" cy="80" r="46" fill="url(#lg' + U + ')" class="cs-glow"/>') +
    strk('M0 146 L-4 76', R.line, 2.6) +
    '<ellipse cx="0" cy="147" rx="13" ry="4.5" fill="' + R.wall2 + '" stroke="' + R.line + '" stroke-width="2.2"/>' +
    pth('M-18 76 L-12 54 H8 L14 76 Z', st === 'box' ? '#DCD2CE' : R.glow, R.line, 2.4) +
    strk('M-18 76 H14', R.line, 2.4) + '</g>';
}
export function bowl(R, st){
  var lvl = { lux:9, chill:6, watch:2.5, box:0 }[st];
  return '<g transform="translate(102,144)">' +
    pth('M-17 0 H17 L13 13 H-13 Z', '#FFFDF9', R.line, 2.2) +
    (lvl > 0 ? pth('M' + (-16 + (9 - lvl) * .45) + ' ' + (13 - lvl) + ' H' + (16 - (9 - lvl) * .45) + ' L13 13 H-13 Z', '#FFB7C6') : '') +
    (lvl > 4 ? pth('M-4 ' + (16 - lvl) + ' l5 -3 l5 3 l-5 3 z', '#FFFDF9', '', 0, ' opacity=".8"') : '') +
    strk('M-17 0 H17', R.line, 2.2) +
    (st === 'box' ? strk('M-22 4 q5 5 11 1 M22 4 q-5 5 -11 1', R.line, 1.6, ' opacity=".6"') : '') + '</g>';
}

/* =========================================================
   TEMPAT DUDUK — satu gaya per kamar.
   ========================================================= */
export function seatFor(R, st, U){
  var pudar = st === 'box' ? ' opacity=".92"' : '';
  var geser = (st === 'box' && (R.seat === 'sofa' || R.seat === 'wing')) ? ' transform="translate(-26,0)"' : '';
  var o, cx = 160, cy = 104;

  if(R.seat === 'sofa'){
    o = '<g' + geser + pudar + '>' +
      pth('M106 114 L110 74 Q160 63 210 74 L214 114 Z', R.seatA, R.seatLine, 2.4) +
      strk('M136 72 V112 M184 72 V112', R.seatLine, 1.8, ' opacity=".5"') +
      '<rect x="94" y="102" width="132" height="25" rx="11" fill="' + R.seatB + '" stroke="' + R.seatLine + '" stroke-width="2.4"/>' +
      '<rect x="86" y="86" width="22" height="41" rx="10" fill="' + R.seatA + '" stroke="' + R.seatLine + '" stroke-width="2.4"/>' +
      '<rect x="212" y="86" width="22" height="41" rx="10" fill="' + R.seatA + '" stroke="' + R.seatLine + '" stroke-width="2.4"/>' +
      strk('M104 127 L102 144 M216 127 L218 144', R.wood, 4.6) + '</g>';
    cx = 158; cy = 104;

  } else if(R.seat === 'wing'){
    o = '<g' + geser + pudar + '>' +
      pth('M120 114 L124 64 Q160 54 196 64 L200 114 Z', R.seatA, R.seatLine, 2.4) +
      pth('M108 60 q14 -6 18 4 L124 110 h-16 z', R.seatB, R.seatLine, 2.4) +
      pth('M212 60 q-14 -6 -18 4 L196 110 h16 z', R.seatB, R.seatLine, 2.4) +
      strk('M148 62 V110 M172 62 V110', R.seatLine, 1.8, ' opacity=".45"') +
      '<rect x="106" y="100" width="108" height="25" rx="11" fill="' + R.seatB + '" stroke="' + R.seatLine + '" stroke-width="2.4"/>' +
      strk('M118 125 L116 144 M202 125 L204 144', R.wood, 4.6) + '</g>';
    cx = 160; cy = 102;

  } else if(R.seat === 'kantor'){
    o = '<g' + geser + pudar + '>' +
      '<rect x="126" y="50" width="68" height="52" rx="16" fill="' + R.seatA + '" stroke="' + R.seatLine + '" stroke-width="2.4"/>' +
      strk('M126 68 H194 M126 86 H194', R.seatLine, 1.8, ' opacity=".45"') +
      '<rect x="112" y="98" width="96" height="20" rx="9" fill="' + R.seatB + '" stroke="' + R.seatLine + '" stroke-width="2.4"/>' +
      strk('M160 118 V132', R.seatLine, 3.4) +
      strk('M160 132 L128 146 M160 132 L192 146 M160 132 V148', R.seatLine, 3) +
      '<circle cx="126" cy="148" r="4" fill="' + R.seatA + '" stroke="' + R.seatLine + '" stroke-width="2"/>' +
      '<circle cx="194" cy="148" r="4" fill="' + R.seatA + '" stroke="' + R.seatLine + '" stroke-width="2"/>' +
      '<circle cx="160" cy="150" r="4" fill="' + R.seatA + '" stroke="' + R.seatLine + '" stroke-width="2"/></g>';
    cx = 160; cy = 100;

  } else {
    o = '<g' + geser + pudar + '>' +
      strk('M136 54 L126 118', R.seatLine, 2.6) +
      pth('M114 114 L136 52 L196 62 L178 118 Z', R.seatA, R.seatLine, 2.4) +
      strk('M126 110 L142 58 M142 112 L156 60 M158 114 L172 62 M174 116 L186 64', R.seatB, 6, ' opacity=".85"') +
      pth('M114 114 L220 106 L224 128 L120 136 Z', R.seatA, R.seatLine, 2.4) +
      strk('M136 112 L140 134 M158 110 L162 132 M180 109 L184 131 M202 107 L206 129', R.seatB, 6, ' opacity=".85"') +
      strk('M124 136 L116 152 M220 128 L226 150', R.seatLine, 2.8) + '</g>';
    cx = 168; cy = 114;
  }
  return { svg:o, cx:cx, cy:cy };
}

/* kardus tempat ngumpet, dipakai di semua kamar */
export function boxWithCat(C, R, U){
  return '<g transform="translate(240,0)">' +
    '<g transform="translate(0,84)">' + posePeek(C, U) + '</g>' +
    pth('M-34 96 L-26 86 H26 L34 96 Z', '#F0DBB4', R.line, 2.4) +
    pth('M-34 96 H34 L29 140 H-29 Z', '#F7E6C6', R.line, 2.4) +
    pth('M-34 96 L-26 86 H-2 L0 96 Z', '#E4C99B', R.line, 2.2) +
    pth('M34 96 L26 86 H2 L0 96 Z', '#E4C99B', R.line, 2.2) +
    '<rect x="-19" y="108" width="38" height="10" rx="2" fill="#EED8AE" stroke="' + R.line + '" stroke-width="2"/>' +
    strk('M-12 126 h24', R.line, 2, ' opacity=".5"') +
    '<g transform="translate(0,86)">' + catPaws(C) + '</g></g>' +
    '<g fill="#FFF6EC" stroke="' + R.line + '" stroke-width="1.8">' +
    '<circle cx="150" cy="142" r="7"/><circle cx="174" cy="148" r="5"/></g>' +
    strk('M146 140 l4 3 l4 -4 M171 147 l3 2 l3 -3', R.line, 1.6);
}

/* ---- dua tempat duduk tambahan ---- */
export function seatPapasan(R, st){
  return pth('M104 100 q56 -34 112 0 q-4 34 -56 34 q-52 0 -56 -34 Z', R.seatA, R.seatLine, 2.4) +
    strk('M112 96 q48 -26 96 0 M118 108 q42 -20 84 0 M124 120 q36 -14 72 0', R.seatB, 2, ' opacity=".7"') +
    strk('M132 132 L118 150 M188 132 L202 150 M120 146 H200', R.seatLine, 3);
}
export function seatPouf(R, st){
  return '<ellipse cx="160" cy="118" rx="58" ry="24" fill="' + R.seatA + '" stroke="' + R.seatLine + '" stroke-width="2.4"/>' +
    pth('M102 118 q58 -40 116 0 q-6 26 -58 26 q-52 0 -58 -26 Z', R.seatA, R.seatLine, 2.4) +
    strk('M126 104 q34 -14 68 0 M118 114 q42 -10 84 0', R.seatB, 2, ' opacity=".65"') +
    '<circle cx="160" cy="94" r="5" fill="' + R.seatB + '" stroke="' + R.seatLine + '" stroke-width="2"/>' +
    (st === 'box' ? '' : '<g transform="translate(246,0)">' +
      '<rect x="-16" y="128" width="32" height="7" rx="2" fill="#C4884B" stroke="' + R.line + '" stroke-width="2"/>' +
      '<rect x="-14" y="121" width="28" height="7" rx="2" fill="#A3C79B" stroke="' + R.line + '" stroke-width="2"/>' +
      '<rect x="-12" y="114" width="24" height="7" rx="2" fill="#E8B36A" stroke="' + R.line + '" stroke-width="2"/></g>');
}

/* =========================================================
   PERAKIT ADEGAN
   Latar kamar difilter (goyangan cat air), tapi kursi, kucing,
   dan mangkuk TIDAK — biar animasinya tetap ringan di iPhone.
   ========================================================= */
export var ROOM_FN = { susu:roomSusu, loteng:roomLoteng, kayu:roomKayu, teras:roomTeras, teh:roomTeh, roti:roomRoti };

export function catScene(st, catId){
  if(['lux','chill','watch','box'].indexOf(st) < 0) st = 'chill';
  var C = catId ? catKind(catId) : catPicked();
  var R = ROOMS[C.room] || ROOMS.susu;
  var U = 'cs' + (++csSeq);
  var W = 320, H = 180, bg = '', fg = '';

  bg += (ROOM_FN[C.room] || roomSusu)(R, st, U);

  if(C.room !== 'teras'){
    bg += '<ellipse cx="162" cy="150" rx="112" ry="19" fill="' + R.tile + '" opacity=".8"/>' +
      '<ellipse cx="162" cy="150" rx="112" ry="19" fill="none" stroke="' + R.line + '" stroke-width="2.2"/>' +
      '<ellipse cx="162" cy="150" rx="86" ry="13" fill="none" stroke="' + R.line +
      '" stroke-width="1.6" stroke-dasharray="5 5" opacity=".5"/>';
  }
  bg += '<ellipse cx="162" cy="141" rx="66" ry="9" fill="' + R.line + '" opacity=".14"/>';

  var seat, cx = 160, cy = 104;
  if(R.seat === 'papasan'){ seat = seatPapasan(R, st); cx = 160; cy = 102; }
  else if(R.seat === 'pouf'){ seat = seatPouf(R, st); cx = 160; cy = 106; }
  else { var s = seatFor(R, st, U); seat = s.svg; cx = s.cx; cy = s.cy; }
  if(st === 'box' && (R.seat === 'papasan' || R.seat === 'pouf')) seat = '<g transform="translate(-24,0)">' + seat + '</g>';
  fg += seat;

  if(st === 'box'){
    fg += boxWithCat(C, R, U);
  } else {
    var pose = st === 'lux' ? poseSprawl : (st === 'chill' ? poseLoaf : poseSit);
    fg += '<g transform="translate(' + cx + ',' + cy + ')">' + pose(C, U) + '</g>';
  }
  fg += bowl(R, st);

  if(st !== 'box'){
    fg += '<g fill="' + R.line + '" opacity=".4">' +
      '<circle class="cs-dust" cx="88" cy="86" r="1.6"/>' +
      '<circle class="cs-dust cs-dust-2" cx="216" cy="74" r="1.4"/>' +
      '<circle class="cs-dust cs-dust-3" cx="178" cy="50" r="1.2"/></g>';
  }

  var tint = '';
  if(st === 'watch') tint = '<rect x="-12" y="-12" width="344" height="204" fill="#E8A55A" opacity=".13" style="mix-blend-mode:multiply"/>';
  if(st === 'box')   tint = '<rect x="-12" y="-12" width="344" height="204" fill="#808080" opacity=".42" style="mix-blend-mode:saturation"/>' +
                            '<rect x="-12" y="-12" width="344" height="204" fill="#7A7068" opacity=".1" style="mix-blend-mode:multiply"/>';
  if(st === 'lux')   tint = '<rect x="-12" y="-12" width="344" height="204" fill="url(#wm' + U + ')" opacity=".5"/>';

  var grain = '<rect x="-12" y="-12" width="344" height="204" filter="url(#gr' + U + ')" opacity="' +
    (R.dark ? '.22' : '.14') + '" style="mix-blend-mode:multiply"/>';

  return '<svg viewBox="0 0 ' + W + ' ' + H + '" class="cs-svg" role="img" aria-label="' +
      esc(catQuote(st, C.id)) + '">' +
    '<defs>' +
      '<filter id="wb' + U + '" x="-8%" y="-8%" width="116%" height="116%">' +
        '<feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="7" result="n"/>' +
        '<feDisplacementMap in="SourceGraphic" in2="n" scale="1.7" xChannelSelector="R" yChannelSelector="G"/></filter>' +
      '<filter id="gr' + U + '" x="0%" y="0%" width="100%" height="100%">' +
        '<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="3"/>' +
        '<feColorMatrix type="saturate" values="0"/></filter>' +
      '<pattern id="tl' + U + '" width="34" height="18" patternUnits="userSpaceOnUse">' +
        '<path d="M17 0 L34 9 L17 18 L0 9 Z" fill="' + R.tile + '" opacity=".6"/></pattern>' +
      '<radialGradient id="lg' + U + '">' +
        '<stop offset="0" stop-color="' + R.glow + '" stop-opacity="' + (R.dark ? '.85' : '.9') + '"/>' +
        '<stop offset="1" stop-color="' + R.glow + '" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="wm' + U + '" cx=".5" cy=".3" r=".8">' +
        '<stop offset="0" stop-color="#FFF6DE" stop-opacity=".55"/>' +
        '<stop offset="1" stop-color="#FFF6DE" stop-opacity="0"/></radialGradient>' +
      '<clipPath id="cp' + U + '"><rect x="0" y="0" width="' + W + '" height="' + H + '"/></clipPath>' +
    '</defs>' +
    '<g clip-path="url(#cp' + U + ')">' +
      /* Jaring pengaman: kalau filter gagal dirender, ruangan tidak jadi
         kotak kosong — warna dinding & lantai sudah ada di bawahnya. */
      '<rect x="-12" y="-12" width="344" height="' + (HOR + 12) + '" fill="' + R.wall + '"/>' +
      '<rect x="-12" y="' + HOR + '" width="344" height="80" fill="' + R.floor + '"/>' +
      '<g filter="url(#wb' + U + ')">' + bg + '</g>' +
      fg + tint + grain +
    '</g></svg>';
}

/* ---- foto wajah untuk layar pemilihan ---- */
export function catAvatar(catId){
  var C = catKind(catId), R = ROOMS[C.room] || ROOMS.susu, U = 'av' + (++csSeq);
  return '<svg viewBox="-30 -34 60 54" class="cs-svg" role="img" aria-label="' + esc(C.n) + '">' +
    '<rect x="-30" y="-34" width="60" height="54" fill="' + R.wall + '"/>' +
    '<circle cx="0" cy="-2" r="27" fill="' + R.wall2 + '" opacity=".6"/>' +
    '<g transform="translate(0,-2)">' + catHead(C, U, 'melek') + '</g></svg>';
}
