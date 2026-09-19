# PastelsPocket — berkas untuk GitHub Pages

Semua berkas di bawah diletakkan di **folder paling atas** repo `PastelsPocket`, sejajar satu sama lain.

| Berkas | Guna | Wajib? |
|---|---|---|
| `index.html` | Aplikasi PWA Pastels | Wajib |
| `manifest.webmanifest` | Membuat aplikasi bisa dipasang ke Home Screen (nama, ikon, warna) | Wajib — `index.html` sudah merujuknya |
| `sw.js` | Service worker: aplikasi tetap terbuka saat offline | Wajib — `index.html` sudah merujuknya |
| `icon-192.png` | Ikon Home Screen dan apple-touch-icon | Wajib |
| `icon-512.png` | Ikon besar (splash, daftar aplikasi) | Wajib |
| `icon-512-maskable.png` | Ikon Android yang bisa dipotong bentuk apa pun | Disarankan |
| `privacy.html` | Kebijakan privasi (URL untuk App Store Connect) | Wajib sebelum TestFlight |
| `support.html` | Halaman dukungan (URL untuk App Store Connect) | Wajib sebelum TestFlight |

## Sebelum mengunggah
1. Ganti `{{EMAIL}}` di `privacy.html` dan `support.html` dengan alamat email dukungan. Kata itu muncul beberapa kali di tiap berkas.
2. Pastikan `index.html` di sini memang versi terbaru yang kamu pakai. Cek dengan membuka berkasnya dan membandingkan dengan aplikasi yang berjalan.

## Cara mengunggah lewat browser
1. Buka repo `PastelsPocket` di GitHub.
2. **Add file → Upload files**, seret semua berkas di atas.
3. Isi pesan commit, misalnya `chore: tambah manifest, service worker, ikon, privasi, dukungan`.
4. **Commit changes**, lalu tunggu satu dua menit.

Alamat yang akan hidup:
- `https://hello-hiralabs.github.io/PastelsPocket/`
- `https://hello-hiralabs.github.io/PastelsPocket/privacy.html`
- `https://hello-hiralabs.github.io/PastelsPocket/support.html`

## Setiap kali `index.html` diperbarui
Naikkan nomor `VERSI` di baris pertama `sw.js`, misalnya dari `pastels-v1` menjadi `pastels-v2`. Tanpa itu, sebagian pengguna masih melihat versi lama karena service worker menyajikan salinan yang tersimpan.

## Cara memastikan PWA-nya benar
Buka alamatnya di Chrome desktop → DevTools → **Application**:
- **Manifest** tampil tanpa error, ikon terlihat.
- **Service Workers** berstatus *activated and is running*.
- Di iPhone: Safari → Bagikan → **Tambahkan ke Layar Utama**, lalu buka dari ikonnya dan matikan internet. Aplikasi harus tetap terbuka.

## Catatan
- Nama kucing baru (The Snack Squad: Mallow, Boba, Churro, Earl, Chai, Bolu) **belum** diterapkan di PWA. Itu dikerjakan setelah uji nama selesai, sesuai keputusan K3 di dokumen 12.
- Data pengguna tersimpan di browser masing-masing, bukan di repo ini. Mengganti `index.html` tidak menghapus catatan siapa pun.
