---
# ====== Headmatter deck (diisi otomatis oleh `npm run new`) ======
title: "{{JUDUL}}"
kuisId: "{{ID}}"
info: |
  Matematika Kelas {{KELAS}} (Fase {{FASE}}) — Bab {{BAB}}: {{JUDUL}}
  Kurikulum Merdeka. Elemen: {{ELEMEN}}
addons:
  - slidev-addon-matsd
theme: default
fonts:
  sans: Andika
  mono: Fira Code
colorSchema: light
aspectRatio: 16/9
canvasWidth: 1024
transition: slide-left
drawings:
  persist: false
exportFilename: slides
download: slides.pdf
routerMode: hash
layout: sampul
kelas: {{KELAS}}
fase: {{FASE}}
bab: {{BAB}}
elemen: {{ELEMEN}}
---

# {{JUDUL}}

Matematika untuk Kelas {{KELAS}}

---
layout: tujuan
---

# Hari ini kita belajar

- {{TP1}}
- {{TP2}}

---

# Ayo berpikir! 🤔

<!-- Pertanyaan pemantik: kaitkan dengan kehidupan sehari-hari siswa. -->

Pertanyaan pemantik di sini.

---

# Materi

<!-- Konsep inti. Gunakan alat peraga: GarisBilangan, PecahanBatang, PecahanLingkaran, Jam, BangunDatar, Diagram, JsxBoard. -->

<GarisBilangan :min="0" :max="10" />

---

# Contoh

Tulis contoh langkah demi langkah. Gunakan `v-click` untuk memunculkan bertahap.

<v-clicks>

- Langkah 1
- Langkah 2

</v-clicks>

---
layout: latihan
---

# Coba sendiri

<IsianSingkat id="latihan-1" soal="Soal latihan ..." :jawaban="0" />

---
layout: kuis
---

# Kuis

<PilihanGanda id="kuis-1" soal="Soal kuis ..." :pilihan="['A', 'B', 'C']" :jawaban="0" />

---
layout: kuis
---

# Skor kamu

<SkorKuis :jumlah="1" />

---
layout: refleksi
---

# Apa yang sudah kamu pelajari?

- Hari ini aku belajar ...
- Bagian yang paling mudah ...
- Bagian yang masih sulit ...
