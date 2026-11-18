// Template bersama MatSD untuk dokumen cetak (LKPD, asesmen, kunci jawaban).
#import "@preview/mitex:0.2.7": mi  // rumus LaTeX: #mi("\\frac{1}{2}")
// Dipakai dengan: #import "../../../templates/typst/matsd.typ": *

#let biru = rgb("#0072B2")
#let oranye = rgb("#E69F00")
#let hijau = rgb("#009E73")

#let dokumen(
  jenis: "Lembar Kerja Peserta Didik",
  judul: "",
  kelas: "",
  fase: "",
  bab: "",
  waktu: none,
  identitas: true,
  info: none,
  kaki: none,
  body,
) = {
  set document(title: jenis + " — " + judul)
  set page(
    paper: "a4",
    margin: (x: 2cm, top: 2cm, bottom: 2cm),
    footer: context [
      #set text(9pt, fill: gray)
      #if kaki != none [#kaki] else [Matematika Kelas #kelas · Bab #bab — #judul] #h(1fr) #counter(page).display("1")
    ],
  )
  set text(font: ("Andika", "Noto Sans", "Liberation Sans"), size: 13pt, lang: "id")
  set par(leading: 0.8em, justify: false)
  set enum(numbering: "1.", spacing: 1.2em)

  block(width: 100%, fill: biru.lighten(88%), inset: 12pt, radius: 8pt)[
    #text(10pt, fill: biru, weight: "bold", upper(jenis)) \
    #text(20pt, weight: "bold", judul) \
    #text(10pt)[#if info != none [#info] else [Kelas #kelas · Fase #fase · Bab #bab] #if waktu != none [· Waktu: #waktu]]
  ]
  if identitas {
    v(4pt)
    grid(columns: (1fr, auto), gutter: 12pt,
      [Nama: #box(width: 1fr, repeat[.])],
      [No. absen: #box(width: 2cm, repeat[.])],
    )
  }
  v(8pt)
  body
}

/// Kotak petunjuk.
#let petunjuk(isi) = block(width: 100%, stroke: (left: 3pt + oranye), inset: (left: 10pt, y: 6pt))[
  #text(weight: "bold")[Petunjuk:] #isi
]

/// Garis jawaban kosong.
#let garis(n: 1) = for _ in range(n) { v(0.6em); line(length: 100%, stroke: 0.5pt + gray); }

/// Kotak jawaban kecil (untuk angka).
#let kotak(lebar: 1.6cm) = box(width: lebar, height: 0.9cm, stroke: 0.8pt, radius: 3pt, baseline: 30%)

/// Pilihan ganda: #pg[Soal][A][B][C][D]
#let pg(soal, ..pilihan) = [
  #soal
  #grid(columns: (1fr,) * calc.min(pilihan.pos().len(), 4), gutter: 6pt,
    ..pilihan.pos().enumerate().map(((i, p)) => [#box(circle(radius: 6pt, stroke: 0.8pt)) #h(3pt) #str.from-unicode(65 + i). #p]))
]

/// Bagian bertajuk.
#let bagian(judul) = {
  v(10pt)
  block(text(15pt, weight: "bold", fill: biru, judul))
}

/// Garis bilangan statis untuk cetak.
#let garis-bilangan(min: 0, max: 10, lebar: 15cm, tandai: ()) = {
  let n = max - min
  let s = lebar / n
  box(width: lebar + 1cm, height: 1.4cm, {
    place(dx: 0cm, dy: 0.5cm, line(length: lebar + 1cm, stroke: 1.2pt))
    for i in range(n + 1) {
      let x = 0.5cm + s * i
      place(dx: x, dy: 0.3cm, line(start: (0pt, 0pt), end: (0pt, 0.4cm), stroke: 1pt))
      place(dx: x - 0.3cm, dy: 0.85cm, box(width: 0.6cm, align(center, text(10pt, str(min + i)))))
      if (min + i) in tandai { place(dx: x - 4pt, dy: 0.5cm - 4pt, circle(radius: 4pt, fill: oranye)) }
    }
  })
}


// ---------- Paket soal (dibuat otomatis oleh scripts/paket.mjs dari paket.yaml) ----------

#let _huruf(i) = str.from-unicode(65 + i)
#let _bulat = box(circle(radius: 6pt, stroke: 0.8pt), baseline: 20%)
#let _persegi = box(rect(width: 11pt, height: 11pt, stroke: 0.8pt), baseline: 15%)

/// Satu soal bernomor. #soal-blok(1)[isi soal]
#let soal-blok(n, body) = block(breakable: false, width: 100%, above: 1.3em, below: 0.4em)[
  #grid(columns: (1.1cm, 1fr), text(weight: "bold", [#n.]), body)
]

/// Catatan kecil bercetak miring.
#let catatan(body) = block(above: 0.5em, below: 0.5em, text(10.5pt, style: "italic", fill: luma(90), body))

/// Pilihan ganda (satu jawaban).
#let pilihan-pg(kolom: 1, ..item) = block(above: 0.7em, grid(
  columns: (1fr,) * kolom, row-gutter: 8pt, column-gutter: 10pt,
  ..item.pos().enumerate().map(((i, p)) => [#_bulat #h(4pt) #_huruf(i). #p]),
))

/// Pilihan ganda kompleks (jawaban bisa lebih dari satu).
#let pilihan-pgk(..item) = block(above: 0.7em, grid(
  columns: 1fr, row-gutter: 8pt,
  ..item.pos().map(p => [#_persegi #h(4pt) #p]),
))

/// Tabel Benar/Salah.
#let tabel-bs(..baris) = block(above: 0.7em, table(
  columns: (auto, 1fr, 1.8cm, 1.8cm), inset: 7pt,
  align: (center + horizon, left + horizon, center + horizon, center + horizon),
  table.header([*\#*], [*Pernyataan*], [*Benar*], [*Salah*]),
  ..baris.pos().enumerate().map(((i, r)) => ([#_huruf(i)], r, _bulat, _bulat)).flatten(),
))

/// Isian singkat dengan kotak jawaban.
#let isian(satuan: none) = block(above: 0.8em)[Jawaban: #kotak(lebar: 3.2cm) #if satuan != none [ #satuan]]

/// Menjodohkan: tulis huruf pasangan di kotak.
#let jodoh(kiri, kanan) = block(above: 0.7em, grid(
  columns: (1fr, 1fr), column-gutter: 1.5cm, row-gutter: 9pt,
  ..kiri.zip(kanan).enumerate().map(((i, (a, b))) => ([#box(rect(width: 1cm, height: 0.8cm, stroke: 0.8pt, radius: 3pt), baseline: 25%) #h(4pt) #a], [#_huruf(i). #b])).flatten(),
))

/// Tabel kunci jawaban. #kunci-tabel(([1], [Pilihan ganda], [B], [1], [pembahasan]), ...)
#let kunci-tabel(..baris) = table(
  columns: (1cm, 2.6cm, 3.4cm, 1.2cm, 1fr), inset: 6pt, align: (center + top, left + top, left + top, center + top, left + top),
  table.header([*No*], [*Bentuk*], [*Kunci*], [*Skor*], [*Pembahasan*]),
  ..baris.pos().flatten(),
)

/// Kisi-kisi.
#let kisi-tabel(..baris) = table(
  columns: (auto, 1fr, auto, 1fr), inset: 6pt, align: (center, left, left, left),
  table.header([*No*], [*Topik / TP*], [*Level*], [*Sumber / catatan*]),
  ..baris.pos().flatten(),
)
