#import "../../../templates/typst/matsd.typ": *

#show: dokumen.with(
  jenis: "Kunci Jawaban & Rubrik (Guru)",
  judul: "Bilangan sampai 20",
  kelas: "1",
  fase: "A",
  bab: "1",
  identitas: false,
)

#bagian[Kunci jawaban]

#table(columns: (auto, 1fr, auto), inset: 6pt,
  [*No*], [*Jawaban*], [*Skor*],
  [A1], [B. 19], [1],
  [A2], [B. 18], [1],
  [A3], [C. 15], [1],
  [B1], [11], [1],
  [B2], [18], [1],
  [B3], [9, 12, 15, 20], [2],
  [C1], [Doni, karena 16 > 13 (16 ada di sebelah kanan 13 pada garis bilangan)], [3],
)

#bagian[Rubrik uraian (C1)]

#table(columns: (auto, 1fr, 1fr, 1fr), inset: 6pt,
  [*Kriteria*], [*Baik (3)*], [*Cukup (2)*], [*Perlu bimbingan (1)*],
  [Membandingkan], [Jawaban benar dengan alasan tepat], [Jawaban benar tanpa alasan], [Jawaban belum tepat],
)

#bagian[Pengolahan nilai]
Skor maksimum = 10. Nilai = skor × 10. KKTP: 70.
