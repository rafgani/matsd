---
title: "Bilangan sampai 20"
kuisId: "k1-bab-01-bilangan-sampai-20"
info: |
  Matematika Kelas 1 (Fase A) — Bab 1: Bilangan sampai 20
  Kurikulum Merdeka. Elemen: Bilangan. TP 1.BIL.1, 1.BIL.2
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
kelas: 1
fase: A
bab: 1
elemen: Bilangan
---

# Bilangan sampai 20

Ayo membilang, membaca, dan membandingkan bilangan! 🔢

---
layout: tujuan
---

# Hari ini kita belajar

- Membilang benda sampai 20 <span class="text-sm opacity-60">(1.BIL.1)</span>
- Membaca dan menulis lambang bilangan <span class="text-sm opacity-60">(1.BIL.1)</span>
- Membandingkan dan mengurutkan bilangan dengan garis bilangan <span class="text-sm opacity-60">(1.BIL.2)</span>

---

# Ayo berpikir! 🤔

<div class="grid grid-cols-2 gap-8 items-center">
<div>

Di kelas ada banyak pensil warna.

**Bagaimana cara kita tahu jumlahnya dengan cepat?**

<v-click>

Kita bisa **membilang** satu per satu, atau mengelompokkan per **10**!

</v-click>
</div>
<div class="text-6xl leading-relaxed text-center">
✏️✏️✏️✏️✏️<br>✏️✏️✏️✏️✏️<br>✏️✏️✏️
</div>
</div>

---

# Sepuluh dan satuan

Bilangan **13** artinya **1 puluhan** dan **3 satuan**.

<div class="flex gap-12 items-center justify-center mt-6">
<div class="text-center">
<div class="text-5xl">🟦🟦🟦🟦🟦<br>🟦🟦🟦🟦🟦</div>
<div class="mt-2">10 (sepuluh)</div>
</div>
<div class="text-6xl font-bold">+</div>
<div class="text-center">
<div class="text-5xl">🟧🟧🟧</div>
<div class="mt-2">3 (tiga)</div>
</div>
<div class="text-6xl font-bold">=</div>
<div class="text-8xl font-bold text-[#0072B2]">13</div>
</div>

<v-click>

<p class="text-center mt-6">Dibaca: <b>tiga belas</b></p>

</v-click>

---

# Garis bilangan

Bilangan di sebelah **kanan** selalu **lebih besar**.

<GarisBilangan :min="0" :max="20" :tandai="[8, 15]" />

<div class="text-center text-2xl mt-2">

8 ada di kiri 15, jadi **8 < 15** (8 kurang dari 15)

</div>

---

# Ayo geser! 👆

Geser titik merah ke bilangan yang disebut gurumu.

<GarisBilangan :min="0" :max="20" interaktif :nilai="5" />

<div class="text-center opacity-70">

Coba: 12 · 7 · 19 · lebih besar dari 10 tetapi kurang dari 13

</div>

---

# Maju dan mundur

Dari **9**, maju **4** langkah, sampai di **13**.

<GarisBilangan :min="0" :max="20" :lompatan="[[9, 13]]" :tandai="[9, 13]" />

<v-click>

Dari **17**, mundur **5** langkah, sampai di **12**.

<GarisBilangan :min="0" :max="20" :lompatan="[[17, 12]]" :tandai="[17, 12]" />

</v-click>

---

# Siapa yang paling banyak?

<Diagram judul="Buah di keranjang" jenis="piktogram" ikon="🍎" :data="{ Ani: 7, Budi: 12, Citra: 9 }" />

<div class="text-center mt-4">

Urutkan dari yang **paling sedikit**: 7, 9, 12

</div>

---
layout: latihan
---

# Coba sendiri

<div class="grid grid-cols-2 gap-x-10">

<IsianSingkat id="lat-1" soal="10 + 6 = ..." :jawaban="16" pembahasan="1 puluhan dan 6 satuan adalah 16." />

<IsianSingkat id="lat-2" soal="Bilangan sesudah 14 adalah ..." :jawaban="15" />

<IsianSingkat id="lat-3" soal="Bilangan sebelum 20 adalah ..." :jawaban="19" />

<IsianSingkat id="lat-4" soal="Lambang bilangan 'sebelas' adalah ..." :jawaban="11" />

</div>

---
layout: kuis
---

# Kuis 1

<PilihanGanda id="kuis-1" soal="Bilangan manakah yang paling besar?" :pilihan="['17', '12', '19', '9']" :jawaban="2" pembahasan="19 paling kanan di garis bilangan." />

<BenarSalah id="kuis-2" pernyataan="14 kurang dari 11" :jawaban="false" pembahasan="14 ada di sebelah kanan 11, jadi 14 lebih besar." />

---
layout: kuis
---

# Kuis 2

<Menjodohkan id="kuis-3" soal="Jodohkan bilangan dengan cara membacanya." :pasangan="[['12', 'dua belas'], ['15', 'lima belas'], ['18', 'delapan belas'], ['20', 'dua puluh']]" />

---
layout: kuis
---

# Kuis 3

<IsianSingkat id="kuis-4" soal="Urutan 6, 8, 10, ..., 14. Bilangan yang hilang adalah ..." :jawaban="12" />

<PilihanGanda id="kuis-5" soal="1 puluhan dan 7 satuan adalah ..." :pilihan="['8', '17', '71']" :jawaban="1" />

---
layout: kuis
---

# Skor kamu ⭐

<SkorKuis :jumlah="5" />

---
layout: refleksi
---

# Apa yang sudah kamu pelajari?

- Hari ini aku belajar ...
- Bagian yang paling mudah ...
- Bagian yang masih sulit ...

<div class="mt-8 text-2xl">Bagaimana perasaanmu? 😀 🙂 😐</div>
