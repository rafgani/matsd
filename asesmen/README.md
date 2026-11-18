# Asesmen

| Folder | Isi | Buat baru |
|---|---|---|
| `topik/kelas-N/<paket>/` | Asesmen per topik/bab (formatif–sumatif) | `npm run paket -- --jenis topik --kelas 4 --topik Pecahan --judul "Asesmen Pecahan 1" --tp 4.BIL.3` |
| `tka/<paket>/` | Latihan format TKA (PG, PG kompleks, Benar/Salah, isian) | `npm run paket -- --jenis tka --judul "Latihan TKA 1"` |

Setiap paket berisi `paket.yaml` (sumber tunggal) dan `public/` (gambar). Dari `paket.yaml` dibangun otomatis
`slides.md` (web interaktif), `soal.typ` dan `kunci.typ` (PDF). Format lengkap: [templates/paket/paket.yaml](../templates/paket/paket.yaml).

- Pratinjau: `npm run dev -- asesmen/tka/<paket>`
- Hanya bangun ulang: `npm run gen`
- Validasi: `npm run check`

Catatan TKA: soal di `referensi/` adalah contoh format dari Pusmendik — tulis soal sendiri, jangan disalin.
