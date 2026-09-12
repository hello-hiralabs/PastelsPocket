import { CATS, CAT_MIGRATE, EMO2ICON, ENVS, WASHI, WMAP } from './constants.js';
import { $, clamp, daysIn, mkNow, num, pad2, sanitizeAmount, today, uid } from './utils.js';
import { save } from './data-service.js';
import { CKMAP } from './mascot.js';

/* =========================================================
   4. STATE
   ========================================================= */
export let db=null;
export let ui={ tab:'home', mk:'', hmk:'', histLvl:0, sortMode:false,
  q:'', fcat:'',            /* filter riwayat: keadaan tampilan, tidak disimpan */
  quick:{cat:'makan',amount:''}, mascot:0 };

export function blankMonth(){ return { income:[], tx:[] }; }

export function seed(){
  const now=new Date(), y=now.getFullYear(), m=now.getMonth()+1, dnow=now.getDate();
  const mk=y+'-'+pad2(m);
  const pd=new Date(y,m-2,1), pmk=pd.getFullYear()+'-'+pad2(pd.getMonth()+1);
  const d={
    v:2,
    profile:{ name:'', ava:'cat-face', cat:'mochi' },
    months:{},
    goals:[
      { id:uid(), name:'Tiket Konser',     e:'admission-tickets', target:1200000, saved:430000, tone:0 },
      { id:uid(), name:'Skincare Set',     e:'lipstick',          target:800000,  saved:260000, tone:1 },
      { id:uid(), name:'Liburan ke Jogja', e:'airplane',          target:3000000, saved:540000, tone:2 }
    ],
    streak:{count:0,best:0,last:''},
    badges:{},
    stats:{pagi:false,iritDay:false},
    washi:{ owned:['yellow','pink'], main:'yellow', goal:'pink' },
    env:{ bills:{pct:50,nom:null}, wants:{pct:30,nom:null}, save:{pct:20,nom:null} },
    dayLimit:{},
    recurring:[
      { id:uid(), label:'Kos bulanan',  amount:1200000, cat:'kos', day:1, active:true, lastRun:'' },
      { id:uid(), label:'Langganan streaming', amount:65000, cat:'fun', day:5, active:true, lastRun:'' }
    ]
  };
  const jajan=[
    ['makan',22000,'Ayam geprek'],['boba',24000,'Boba brown sugar'],['ojol',12000,'Ojek online'],
    ['makan',18000,'Sarapan bubur'],['ootd',89000,'Sunscreen baru'],['boba',20000,'Matcha latte'],
    ['makan',25000,'Makan siang'],['sweets',27000,'Croffle pandan'],['ootd',135000,'Thrift kemeja'],
    ['makan',20000,'Seblak'],['fun',75000,'Nonton bioskop'],['ojol',15000,'Ongkos pulang'],
    ['makan',23000,'Nasi padang'],['boba',22000,'Es kopi susu'],['lain',30000,'Kado ultah bestie'],
    ['makan',19000,'Mie ayam'],['sweets',18000,'Donat gula'],['ojol',10000,'Angkot'],
    ['makan',24000,'Dimsum'],['boba',18000,'Thai tea']
  ];
  function fill(key,dayCount,pocket,bonus){
    const M=blankMonth();
    M.income.push({id:uid(),date:key+'-01',label:'Gaji bulanan',amount:pocket});
    if(bonus) M.income.push({id:uid(),date:key+'-14',label:'Hasil freelance',amount:bonus});
    let i=0;
    for(let day=1;day<=dayCount;day++){
      /* hari terakhir dibuat ringan biar jatah hari ini masih longgar */
      const per=(day===dayCount)?1:((day%4===0)?1:2);
      for(let j=0;j<per;j++){
        const it=jajan[(i++)%jajan.length];
        M.tx.push({id:uid(),date:key+'-'+pad2(day),cat:it[0],amount:it[1],note:it[2],h:9+((i*3)%11)});
      }
    }
    return M;
  }
  d.months[pmk]=fill(pmk,daysIn(pmk),4500000,700000);
  d.months[mk]=fill(mk,Math.max(1,dnow),4500000,600000);
  d.months[mk].tx.push({id:uid(),date:mk+'-'+pad2(Math.max(1,dnow-3)),cat:'celengan',goal:d.goals[0].id,amount:150000,note:'Isi celengan Tiket Konser',h:20});
  d.months[mk].tx.push({id:uid(),date:mk+'-'+pad2(Math.max(1,dnow-1)),cat:'celengan',goal:d.goals[1].id,amount:100000,note:'Isi celengan Skincare Set',h:21});
  d.streak={count:Math.min(2,dnow),best:2,last:today()};
  d.stats={pagi:false,iritDay:true};
  return d;
}

export function fixIcon(v,def){
  if(!v) return def;
  if(EMO2ICON[v]) return EMO2ICON[v];
  return /^[a-z0-9-]+$/.test(v)?v:def;
}
export function migrate(d){
  if(!d||typeof d!=='object') return seed();
  d.v=2;
  d.profile=Object.assign({name:'',ava:'cat-face'},d.profile||{});
  d.profile.ava=fixIcon(d.profile.ava,'cat-face');
  d.profile.cat=CKMAP[d.profile.cat]?d.profile.cat:'mochi';
  d.months=(d.months&&typeof d.months==='object')?d.months:{};
  Object.keys(d.months).forEach(k=>{
    const M=d.months[k]||{};
    M.income=Array.isArray(M.income)?M.income:[];
    M.income.forEach(r=>{ r.id=r.id||uid(); r.amount=sanitizeAmount(r.amount); });
    M.tx=Array.isArray(M.tx)?M.tx:[];
    M.tx.forEach(t2=>{t2.id=t2.id||uid();t2.amount=sanitizeAmount(t2.amount);t2.cat=t2.cat||'lain';
      if(CAT_MIGRATE[t2.cat]) t2.cat=CAT_MIGRATE[t2.cat];
      t2.date=t2.date||k+'-01';});
    d.months[k]=M;
  });
  d.goals=Array.isArray(d.goals)?d.goals:[];
  d.goals.forEach(g=>{g.id=g.id||uid();g.target=sanitizeAmount(g.target);g.saved=sanitizeAmount(g.saved);
    g.e=fixIcon(g.e,'money-bag'); if(g.e==='pig-face') g.e='money-bag'; g.tone=num(g.tone);});
  d.streak=Object.assign({count:0,best:0,last:''},d.streak||{});
  d.badges=(d.badges&&typeof d.badges==='object')?d.badges:{};
  d.stats=Object.assign({pagi:false,iritDay:false},d.stats||{});
  /* washi wardrobe */
  const w=d.washi||{};
  let owned=Array.isArray(w.owned)?w.owned.filter(x=>WMAP[x]):[];
  if(owned.indexOf('yellow')<0) owned.unshift('yellow');
  if(owned.indexOf('pink')<0) owned.push('pink');
  d.washi={ owned, main: WMAP[w.main]?w.main:'yellow', goal: WMAP[w.goal]?w.goal:'pink' };
  /* amplop & limit harian */
  const ev=(d.env&&typeof d.env==='object')?d.env:{};
  d.env={};
  ENVS.forEach(e=>{
    const cur=ev[e.k]||{};
    d.env[e.k]={ pct: cur.pct==null?e.def:clamp(num(cur.pct),0,100),
                 nom: (cur.nom==null||cur.nom==='')?null:num(cur.nom) };
  });
  d.dayLimit=(d.dayLimit&&typeof d.dayLimit==='object')?d.dayLimit:{};
  /* buang kunci tanggal yang tidak wajar supaya tidak mengacaukan limit harian */
  Object.keys(d.dayLimit).forEach(k=>{
    if(!/^\d{4}-\d{2}-\d{2}$/.test(k) || sanitizeAmount(d.dayLimit[k])<=0) delete d.dayLimit[k];
    else d.dayLimit[k]=sanitizeAmount(d.dayLimit[k]);
  });
  /* transaksi berulang */
  d.recurring=Array.isArray(d.recurring)?d.recurring:[];
  d.recurring=d.recurring.filter(r=>r&&typeof r==='object').map(r=>({
    id:r.id||uid(),
    label:typeof r.label==='string'?r.label.slice(0,60):'',
    amount:sanitizeAmount(r.amount),
    cat:CATS.some(c=>c.k===r.cat)?r.cat:'kos',
    day:clamp(num(r.day)||1,1,28),
    active:r.active!==false,
    lastRun:/^\d{4}-\d{2}$/.test(r.lastRun)?r.lastRun:''
  })).slice(0,40);
  return d;
}
export function MO(mk){ mk=mk||ui.mk; if(!db.months[mk]) db.months[mk]=blankMonth(); return db.months[mk]; }

/* satu-satunya pintu untuk menukar seluruh isi db (reset / restore) */
export function setDb(next){ db = next; return db; }
export function getDb(){ return db; }

/* Gaya washi tape untuk sebuah kartu.
   Tinggal di sini, bukan di utils, karena membaca db.washi —
   kalau di utils, utils jadi bergantung pada state dan siklus
   impornya memicu TDZ saat modul dievaluasi. */
export function tapeStyle(slot,tx,tw,tr){
  const id = slot==='goal' ? db.washi.goal : db.washi.main;
  const w = WMAP[id] || WASHI[0];
  return '--tape:'+w.bg+';--tx:'+tx+';--tw:'+tw+'px;--tr:'+tr+'deg';
}

/* Nilai awal yang butuh util lain diisi di sini, dipanggil sekali dari boot().
   Memanggilnya saat evaluasi modul berisiko TDZ kalau ada siklus impor. */
export function initUi(){
  ui.mk = ui.mk || mkNow();
  ui.hmk = ui.hmk || mkNow();
  return ui;
}
