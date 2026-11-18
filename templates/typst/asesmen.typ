#import "../../../templates/typst/matsd.typ": *

#show: dokumen.with(
  jenis: "Asesmen Sumatif",
  judul: "{{JUDUL}}",
  kelas: "{{KELAS}}",
  fase: "{{FASE}}",
  bab: "{{BAB}}",
  waktu: "60 menit",
)

#petunjuk[Berdoalah sebelum mengerjakan. Tulis nama dan nomor absen.]

#bagian[A. Pilihan ganda]

+ #pg[Soal …][…][…][…][…]

#bagian[B. Isian]

+ Soal … #kotak()

#bagian[C. Uraian]

+ Soal … #garis(n: 4)
