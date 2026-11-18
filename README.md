# Matematika SD — Kurikulum Merdeka

Workspace untuk merencanakan, merancang, dan membuat materi Matematika SD (Kelas 1–6):
kurikulum (CP, ATP), modul ajar, slide presentasi interaktif, bacaan, latihan, kuis, LKPD, dan asesmen.

- **Web:** slide interaktif Slidev + alat peraga JSXGraph, kuis dengan umpan balik langsung.
- **PDF:** slide (ekspor Slidev) serta LKPD, asesmen, kunci jawaban (Typst).

## Mulai

```bash
npm install
npm run dev -- konten/kelas-1/bab-01-bilangan-sampai-20
```

Bab baru:

```bash
npm run new -- --kelas 1 --bab 2 --judul "Penjumlahan sampai 20" --elemen Bilangan --tp 1.BIL.3
```

Paket soal (asesmen topik, latihan TKA, soal kompetisi):

```bash
npm run paket -- --jenis tka --judul "Latihan TKA 2"
npm run dev -- asesmen/tka/latihan-tka-2
```

Bangun situs + PDF ke `dist/` lalu pratinjau:

```bash
npm run build && npm run serve
```

Alur kerja per bab: **ATP** (`kurikulum/atp/`) → **modul ajar** → **slides** → **bacaan** → **LKPD/asesmen** → `npm run check`.

Panduan lengkap konvensi ada di [CLAUDE.md](CLAUDE.md).

## Publikasi (GitHub Pages)

Workflow `.github/workflows/pages.yml` membangun semua bab saat push ke `main`.
Aktifkan di *Settings → Pages → Source: GitHub Actions*.
