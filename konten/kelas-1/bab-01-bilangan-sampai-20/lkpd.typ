#import "../../../templates/typst/matsd.typ": *

#show: dokumen.with(
  jenis: "Lembar Kerja Peserta Didik",
  judul: "Bilangan sampai 20",
  kelas: "1",
  fase: "A",
  bab: "1",
)

#petunjuk[Kerjakan dengan teliti. Tanyakan pada guru jika ada yang belum jelas.]

#bagian[A. Ayo membilang]

+ Hitung bintangnya, lalu tulis bilangannya. \
  #text(22pt)[★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★] #h(1em) #kotak()
+ Hitung bulatannya, lalu tulis bilangannya. \
  #text(22pt)[● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ●] #h(1em) #kotak()

#bagian[B. Lengkapi garis bilangan]

Beri tanda pada bilangan *7* dan *16*.

#garis-bilangan(min: 0, max: 20, lebar: 16cm)

#bagian[C. Isilah dengan > , < , atau =]

#grid(columns: (1fr, 1fr, 1fr), gutter: 14pt,
  [12 #kotak(lebar: 1cm) 9], [15 #kotak(lebar: 1cm) 18], [20 #kotak(lebar: 1cm) 20],
)

#bagian[D. Tulis cara membacanya]

+ 13 = #box(width: 7cm, repeat[.])
+ 19 = #box(width: 7cm, repeat[.])
