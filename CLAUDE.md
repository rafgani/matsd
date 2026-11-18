# MatSD — Workspace Materi Matematika SD

Materi Matematika SD Kelas 1–6 (Fase A–C) **Kurikulum Merdeka**, berbahasa **Indonesia**.
Siswa memakai lewat **browser** (situs statis GitHub Pages) atau **PDF**.

## Bahasa & gaya
- Semua teks untuk siswa/guru dalam Bahasa Indonesia baku yang ramah anak: kalimat pendek, sapaan "kamu", ajakan "Ayo ...".
- Angka gaya Indonesia: koma desimal (2,5), titik ribuan (10.000), jam "07.30".
- Kode, nama komponen, dan prop memakai istilah Indonesia (`pembilang`, `jawaban`, `interaktif`).
- Warna hanya dari palet Okabe–Ito di `packages/slidev-addon-matsd/lib/jsx.ts` (`warna`).

## Struktur
- `kurikulum/` — perencanaan: `capaian-pembelajaran.md` (CP Fase A–C), `atp/kelas-N.md` (TP berkode `N.ELEMEN.n`, elemen BIL/ALJ/PGK/GEO/ADP), `peta-materi.yaml` (daftar bab = sumber kebenaran situs).
- `konten/kelas-N/bab-NN-slug/` — satu bab: `slides.md` (Slidev: presentasi, latihan, kuis), `modul-ajar.md` (guru), `bacaan.md`, `lkpd.typ`, `asesmen.typ`, `kunci.typ` (Typst → PDF), `public/` (gambar).
- `packages/slidev-addon-matsd/` — addon Slidev bersama: `components/` (otomatis tersedia di semua deck), `layouts/`, `styles/index.css`, `lib/`.
- `asesmen/topik/kelas-N/<paket>/` — asesmen per topik; `asesmen/tka/<paket>/` — latihan format TKA; `kompetisi/<paket>/` — soal kompetisi/olimpiade. Tiap paket = `paket.yaml` (sumber tunggal) + `public/` (gambar). Format & contoh: `templates/paket/paket.yaml`.
- `templates/` — sumber untuk `npm run new` / `npm run paket`. `templates/typst/matsd.typ` = fungsi cetak bersama.
- `scripts/` — `new-bab`, `dev`, `build-all`, `check`, `situs` (halaman depan).
- `referensi/` — bahan rujukan (buku, soal, LKS pihak lain). Di-gitignore: jangan disalin utuh ke materi atau diterbitkan; pakai hanya sebagai inspirasi dan buat soal sendiri.
- `konten/_galeri/` — deck contoh semua komponen (tidak diterbitkan): `npm run dev -- konten/_galeri`.

## Perintah
- `npm run new -- --kelas 2 --bab 3 --judul "Perkalian" --elemen Bilangan --tp 2.BIL.4,2.BIL.5`
- `npm run paket -- --jenis topik --kelas 4 --topik Pecahan --judul "Asesmen Pecahan 1" --tp 4.BIL.3` (jenis: `topik` | `tka` | `kompetisi`)
- `npm run gen` → bangun ulang slides.md/soal.typ/kunci.typ semua paket dari paket.yaml (hasil generator di-gitignore, jangan diedit tangan)
- `npm run dev -- konten/kelas-1/bab-01-bilangan-sampai-20` atau `-- asesmen/tka/latihan-tka-1` → http://localhost:3030 (paket dibangun ulang otomatis saat paket.yaml diubah)
- `npm run build` (web + PDF) · `npm run build:web` · `npm run build -- --bab <slug>` · `--kunci` ikut sertakan kunci jawaban (jangan dipublikasikan ke siswa)
- `npm run serve` → pratinjau `dist/` · `npm run check` → validasi kelengkapan
- Ekspor PDF slide memakai Chromium sistem (`/usr/bin/chromium`) atau `CHROME_PATH`; di CI memakai Chromium Playwright.
- Deck memakai `routerMode: hash` agar tautan langsung jalan di GitHub Pages; tombol unduh deck mengarah ke `slides.pdf` hasil build.
- PDF Typst saja: `typst compile --root . konten/.../lkpd.typ out.pdf`

## Komponen (lihat komentar di atas tiap .vue untuk contoh)
Alat peraga (JSXGraph): `GarisBilangan`, `Jam`, `PecahanLingkaran`, `BangunDatar`, `JsxBoard` (umum, prop `init(board, JXG)`).
Alat peraga (HTML): `PecahanBatang`, `Diagram` (batang/piktogram).
Kuis: `PilihanGanda`, `PilihanGandaKompleks` (>1 jawaban benar), `TabelBenarSalah`, `IsianSingkat`, `BenarSalah`, `Menjodohkan`, `Uraian`, `SkorKuis`; `Soal` memilih widget menurut `tipe` (dipakai generator paket). Teks soal mendukung rumus `$\\frac{1}{2}$` (KaTeX di web, mitex di Typst), `**tebal**`. Hasil disimpan di localStorage per `kuisId` deck.
Layout: `sampul`, `tujuan`, `bacaan`, `latihan`, `kuis`, `refleksi`.

## Aturan
- Soal TKA/kompetisi/asesmen ditulis di `paket.yaml`, bukan langsung di slides.md. Tulis soal sendiri; `referensi/` hanya untuk contoh format (TKA Pusmendik memakai PG, PG kompleks, tabel Benar/Salah, isian).
- Setiap soal kuis butuh `id` unik dalam deck; `SkorKuis :jumlah` = banyak soal kuis.
- Bab baru selalu lewat `npm run new` agar terdaftar di `peta-materi.yaml`; kode TP harus ada di tabel ATP kelasnya.
- Komponen baru masuk ke addon (bukan ke folder bab) supaya dipakai ulang; beri komentar contoh pemakaian di atas file.
- Board JSXGraph: ukuran px tetap, tanpa zoom/pan (pakai `buatPapan`), harus tampil benar di PDF (export = tangkapan layar).
- Jalankan `npm run check` setelah menambah/mengubah bab.
- CP di `capaian-pembelajaran.md` adalah ringkasan; cocokkan dengan dokumen resmi BSKAP sebelum dipakai.
- Font Andika belum terpasang di sistem → Typst memakai Noto Sans (peringatan `unknown font family: andika` aman). Pasang Andika agar cetakan sama dengan slide.
- Typst memakai paket `@preview/mitex` (diunduh otomatis; butuh internet saat pertama kali). Typst 0.15 butuh mitex ≥ 0.2.7.
- Kunci jawaban (`kunci.pdf`) tidak ikut `npm run build` kecuali `--kunci`. Catatan: jawaban soal interaktif ada di kode web, jadi paket TKA/asesmen sumatif sebaiknya tidak dipublikasikan bila dipakai sebagai ujian.
