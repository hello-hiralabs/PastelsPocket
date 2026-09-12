# Pastels : Your Pocket Bestie — struktur modul

Satu sumber kode, dua bentuk keluaran:

- **`dev.html`** memuat `src/app.js` sebagai modul ES6 asli. Dipakai saat ngoding.
- **`index.html`** hasil `node build.mjs` — semua modul digabung jadi satu file.
  Ini yang di-upload ke GitHub Pages.

Kenapa dua-duanya: `import`/`export` butuh berkas terpisah yang dilayani lewat
HTTP. Kalau dipaksa jadi satu berkas, itu bukan modul ES6 lagi. Jadi modulnya
nyata saat dikembangkan, dan digabung hanya saat mau dikirim.

---

## Perintah

```bash
node rewire.mjs     # hitung ulang semua import dari tabel simbol
node build.mjs      # kompilasi Tailwind + gabungkan src/ menjadi index.html
node esm-test.mjs   # jalankan graf modul asli (mencari import yang kurang)
node css-test.mjs   # pastikan tiap kelas di markup punya wujud di CSS
```

Sekali saja di awal: `npm install` (butuh `tailwindcss` untuk build,
`jsdom` untuk esm-test).

Berkas yang harus diunggah ke hosting: `index.html`, `manifest.webmanifest`,
`sw.js`, `icon-192.png`, `icon-512.png`.

Untuk `dev.html` butuh server lokal, karena `file://` menolak modul:

```bash
python3 -m http.server 8080      # lalu buka http://localhost:8080/dev.html
```

---

## Urutan modul

Topologis — yang di atas tidak boleh bergantung pada yang di bawah.
Urutan ini tersimpan di `modules.mjs` dan dipakai `rewire.mjs` maupun `build.mjs`.

| # | Modul | Tanggung jawab |
|---|---|---|
| 1 | `i18n.js` | `LANG`, kamus EN, `t()`, `tf()`, nama bulan/hari, kutipan |
| 2 | `constants.js` | kategori, amplop, washi, stiker, jenis celengan, avatar |
| 3 | `utils.js` | format angka, tanggal, stiker ikon, toast, **sanitasi nominal**, **parsing backup** |
| 4 | `state.js` | `db`, `ui`, `seed()`, `migrate()`, `MO()`, `setDb()`, `tapeStyle()` |
| 5 | `data-service.js` | **lapisan penyimpanan**: `LocalAdapter`, `CloudAdapter`, `load()`, `save()` |
| 6 | `calc.js` | total bulanan, amplop, jatah harian, limit manual |
| 7 | `rewards.js` | streak, stiker, unlock washi, antrean hadiah |
| 8 | `recurring.js` | **tagihan berulang** |
| 9 | `csv.js` | **ekspor CSV** |
| 10 | `filter.js` | **filter & pencarian riwayat** |
| 11 | `fx.js` | confetti |
| 12 | `sheet.js` | bottom sheet, pop-up perayaan |
| 13 | `mascot.js` | 6 ras kucing + 6 kamar, SVG |
| 14 | `history.js` | riwayat bertingkat, cerita bulanan |
| 15 | `views/header.js` | header, maskot, `cardHead()` |
| 16 | `views/home.js` | tab Rumah, kartu amplop, struk |
| 17 | `views/goals.js` | tab Celengan |
| 18 | `views/badges.js` | tab Stiker, dinding polaroid, lemari washi |
| 19 | `views/recap.js` | tab Rekap |
| 20 | `sheets.js` | seluruh bottom sheet (catat jajan, limit, tagihan, pengaturan) |
| 21 | `story.js` | kartu IG Story 9:16 |
| 22 | `render.js` | `render()`, `refresh()`, `setLang()` |
| 23 | `actions.js` | seluruh event listener |
| 24 | `app.js` | `boot()` |

---

## Dua aturan yang wajib dipatuhi

**1. Jangan pernah menugaskan ulang binding hasil import.**
Di modul ES6 itu error. Pakai setter dari modul pemiliknya:

| Ganti | Dengan |
|---|---|
| `db = x` | `setDb(x)` |
| `LANG = 'en'` | `applyLang('en')` |
| `rotN = 0` | `resetRot()` |
| `queue = []` | `clearQueue()` |

**2. Jangan memanggil fungsi modul lain saat evaluasi tingkat atas.**
Kalau ada siklus impor, fungsinya belum terinisialisasi dan JS melempar
`Cannot access 'x' before initialization`. Inilah sebabnya `ui.mk` diisi di
`initUi()` yang dipanggil dari `boot()`, bukan langsung di deklarasi `ui`.

---

## Menyalakan sinkronisasi cloud

Semua yang perlu disentuh ada di `src/data-service.js`.

1. Tambahkan di `<head>` `shell.html`:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

2. Buat tabelnya di Supabase SQL editor:

```sql
create table pastels_state (
  user_id uuid primary key references auth.users on delete cascade,
  payload jsonb not null,
  updated_at timestamptz default now()
);
alter table pastels_state enable row level security;
create policy "pemilik saja" on pastels_state
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

3. Isi `SUPABASE_URL` dan `SUPABASE_ANON_KEY` di `data-service.js`.
4. Aktifkan provider Google di Supabase → Authentication → Providers.
5. `node build.mjs`, lalu unggah ulang.

Tombol **Hubungkan Akun Google** di Pengaturan akan aktif sendiri begitu
`CloudAdapter.ready()` bernilai benar. Selama belum disetel, tombolnya
nonaktif dan diberi keterangan.

Data lokal tetap ditulis sebagai cache offline (`DS.mirrorLocal`), jadi
aplikasi tidak mati saat jaringan hilang.

Mau pakai Firebase? Tulis adapter ketiga dengan bentuk yang sama
(`read`, `write`, `signIn`, `signOut`, `user`) lalu daftarkan di `DS.use()`.
Tidak ada berkas lain yang perlu diubah.

---

## Perubahan terakhir (ronde amplop, reset, tema kucing)

| Berkas | Yang diubah |
|---|---|
| `src/constants.js` | `envOfCat` dipindah keluar (dulu statis) |
| `src/calc.js` | `envOfCat` baru: membaca `db.catEnv`, jatuh ke bawaan `CATS[].env` |
| `src/state.js` | tambah `db.catEnv` + validasinya di `migrate()` |
| `src/views/home.js` | kartu Amplop: penanda `data-live` untuk sinkron Rp, `<details>` dropdown kategori, tombol "Ganti" di adegan dihapus |
| `src/views/goals.js` | kartu jembatan alokasi amplop celengan + tombol setor |
| `src/views/header.js` | ikon kucing jadi pemicu ganti tema, sapaan pindah ke bubble |
| `src/sheets.js` | `resetSheet()` baru; tombol Pengaturan jadi "Reset Data" |
| `src/actions.js` | `refreshEnv()`, auto-balance persen, aksi `catenv`, `setor-alokasi`, `reset-open`, `reset-month-ask/ok`, `reset-all-ask` |
| `src/i18n.js` | ~20 entri kamus baru |

### Catatan keputusan

**Persen amplop: auto-balance, bukan "kosongkan yang lain".**
Permintaannya mengosongkan dua amplop lain jadi 0 saat satu diisi. Itu
membuat pengisian kedua menghapus yang pertama, jadi ketiganya tidak
akan pernah bisa terisi. Yang dipakai sekarang: dua amplop lain
disesuaikan proporsional sehingga total selalu 100% — tujuannya sama
(tidak bisa lewat 100) tanpa efek saling hapus.

**Amplop celengan butuh satu ketukan untuk jadi saldo.**
Alokasi amplop itu rencana, setoran itu uang yang benar-benar pindah.
Kalau alokasi otomatis ditambahkan ke saldo celengan, saldonya jadi
menggelembung tiap kali pengguna mengubah persen. Jadi ada kartu
jembatan di tab Celengan yang menampilkan alokasi vs yang sudah
tersetor, plus tombol "Setor Alokasi ke Celengan" yang membagi sisanya
proporsional ke kebutuhan tiap celengan dan mencatatnya sebagai
transaksi nyata.
