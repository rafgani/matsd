#import "../../../templates/typst/matsd.typ": *

#show: dokumen.with(
  jenis: "Kunci Jawaban & Rubrik (Guru)",
  judul: "{{JUDUL}}",
  kelas: "{{KELAS}}",
  fase: "{{FASE}}",
  bab: "{{BAB}}",
  identitas: false,
)

#bagian[Kunci jawaban]

#table(columns: (auto, 1fr, auto), inset: 6pt,
  [*No*], [*Jawaban*], [*Skor*],
  [A1], […], [1],
)

#bagian[Rubrik uraian]

#table(columns: (auto, 1fr, 1fr, 1fr), inset: 6pt,
  [*Kriteria*], [*Baik (3)*], [*Cukup (2)*], [*Perlu bimbingan (1)*],
  […], […], […], […],
)

#bagian[Pengolahan nilai]
Nilai = (skor diperoleh ÷ skor maksimum) × 100. KKTP: …
