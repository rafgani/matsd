# Soal Kompetisi

Kumpulan soal pengayaan/olimpiade (OSN, KSN, KoSSMI, AMC 8, dll.), disusun per paket.

Buat paket baru:

```bash
npm run paket -- --jenis kompetisi --judul "Latihan OSN 1" --kelas 4-6
```

Pakai `paket.yaml` yang sama dengan asesmen (lihat [templates/paket/paket.yaml](../templates/paket/paket.yaml)).
Isi kolom `level` (mis. Mudah / Sedang / Sulit), `topik` (Teka-teki bilangan, Pola, Geometri, Kombinatorika, Logika)
dan `sumber` (soal karangan sendiri, atau rujukan: nama kompetisi dan tahun).
Jangan menyalin soal berhak cipta dari `referensi/`; buat soal baru dengan gagasan serupa.
