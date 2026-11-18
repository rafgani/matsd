---
title: "Galeri Komponen MatSD"
kuisId: "galeri"
info: Contoh semua komponen addon. Hanya untuk penulis materi (tidak diterbitkan).
addons:
  - slidev-addon-matsd
theme: default
fonts:
  sans: Andika
colorSchema: light
canvasWidth: 1024
layout: sampul
---

# Galeri Komponen

Contoh pemakaian setiap komponen `slidev-addon-matsd`. Lihat kode di `konten/_galeri/slides.md`.

---

# GarisBilangan

<GarisBilangan :min="0" :max="10" :lompatan="[[2, 6]]" :tandai="[2, 6]" />
<GarisBilangan :min="0" :max="1" :langkah="0.1" :label="0.5" interaktif :nilai="0.3" />

---

# Jam

<div class="flex justify-around items-center">
  <Jam :jam="3" :menit="30" :ukuran="260" />
  <Jam :jam="7" :menit="15" interaktif digital :ukuran="260" />
</div>

---

# Pecahan

<div class="flex justify-around items-center">
  <PecahanLingkaran :penyebut="4" :pembilang="3" :ukuran="170" />
  <PecahanLingkaran :penyebut="8" :pembilang="0" interaktif :ukuran="170" />
</div>

<PecahanBatang :baris="[{ penyebut: 2, pembilang: 1 }, { penyebut: 4, pembilang: 2 }, { penyebut: 8, pembilang: 4 }]" :lebar="520" />

---

# BangunDatar

<div class="flex justify-around items-start">
  <BangunDatar :titik="[[1,1],[6,1],[6,4],[1,4]]" :lebar="7" :tinggi="5" :width="400" :tampilkan="['keliling','luas','sisi']" />
  <BangunDatar :titik="[[1,1],[6,1],[2,4]]" interaktif :lebar="7" :tinggi="5" :width="400" />
</div>

---

# Diagram

<div class="grid grid-cols-2 gap-8">
  <Diagram judul="Hewan peliharaan" :data="{ Kucing: 8, Ikan: 5, Burung: 3, Kelinci: 4 }" :tinggi="240" />
  <Diagram judul="Buku dibaca" jenis="piktogram" ikon="📘" :data="{ Senin: 3, Selasa: 5, Rabu: 2 }" />
</div>

---

# JsxBoard (bebas)

<script setup>
const grafik = (b) => {
  const p = b.create('point', [2, 1], { name: 'A', size: 6 })
  const q = b.create('point', [-2, -1], { name: 'B', size: 6 })
  b.create('segment', [p, q], { strokeWidth: 3 })
  b.create('text', [-4.5, 4, () => `Panjang AB = ${p.Dist(q).toFixed(1).replace('.', ',')}`], { fontSize: 20 })
}
</script>

<JsxBoard :bbox="[-5, 5, 5, -5]" grid :width="420" :height="340" :init="grafik" />

---
layout: kuis
---

# Widget kuis

<div class="grid grid-cols-2 gap-x-10">
<div>
<PilihanGanda id="kuis-1" soal="3 × 4 = ..." :pilihan="['7', '12', '34']" :jawaban="1" pembahasan="3 + 3 + 3 + 3 = 12" />
<BenarSalah id="kuis-2" pernyataan="½ sama dengan 2/4" :jawaban="true" />
</div>
<div>
<IsianSingkat id="kuis-3" soal="2,5 + 1,5 = ..." :jawaban="4" />
<Menjodohkan id="kuis-4" :pasangan="[['½', '0,5'], ['¼', '0,25']]" />
</div>
</div>

---
layout: kuis
---

# SkorKuis

<SkorKuis :jumlah="4" />
