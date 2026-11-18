#import "../../../templates/typst/matsd.typ": *

#show: dokumen.with(
  jenis: "Lembar Kerja Peserta Didik",
  judul: "{{JUDUL}}",
  kelas: "{{KELAS}}",
  fase: "{{FASE}}",
  bab: "{{BAB}}",
)

#petunjuk[Kerjakan soal di bawah ini dengan teliti.]

#bagian[A. Ayo mencoba]

+ Soal pertama … #kotak()
+ Soal kedua … #garis(n: 2)

#bagian[B. Ayo menjawab]

+ #pg[Pilih jawaban yang benar.][…][…][…][…]
