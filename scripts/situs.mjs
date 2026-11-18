// Generator halaman depan situs.
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
const LABEL = { 'slides.pdf': 'Slide (PDF)', 'soal.pdf': 'Soal (PDF)', 'lkpd.pdf': 'LKPD', 'asesmen.pdf': 'Asesmen' }

const unduh = b => (b.berkas ?? []).filter(f => LABEL[f]).map(f => `<a href="${b.rel}/${f}" download>${LABEL[f]}</a>`).join('')

const kartu = (b, no, judul, meta) => `
      <li class="bab">
        <a class="bab-utama" href="${esc(b.rel)}/">
          <span class="bab-no">${esc(no)}</span>
          <span class="bab-judul">${esc(judul)}</span>
          <span class="bab-elemen">${esc(meta)}</span>
        </a>
        <div class="bab-unduh">${unduh(b)}</div>
      </li>`

export function halamanDepan({ bab, paket, jenis }) {
  const perKelas = {}
  for (const b of bab) (perKelas[b.kelas] ??= []).push(b)
  const kelas = Object.keys(perKelas).sort((a, b) => a - b)

  const bagianPaket = Object.entries(jenis).map(([kode, j]) => {
    const daftar = paket.filter(p => p.jenis === kode).sort((a, b) => String(a.kelas ?? '').localeCompare(String(b.kelas ?? '')) || a.judul.localeCompare(b.judul))
    return daftar.length
      ? { kode, label: j.label, isi: `
    <section id="${kode}">
      <h2>${esc(j.label)}</h2>
      <ul class="daftar">${daftar.map(p => kartu(p, p.kelas ? `Kelas ${p.kelas}` : j.label, p.judul, [p.topik, `${p.jumlah} soal`, p.waktu].filter(Boolean).join(' · '))).join('')}
      </ul>
    </section>` }
      : null
  }).filter(Boolean)

  const nav = [
    ...kelas.map(k => ({ href: `#kelas-${k}`, t: `Kelas ${k}` })),
    ...bagianPaket.map(x => ({ href: `#${x.kode}`, t: x.label })),
  ]
  return `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Matematika SD</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Andika:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="gaya.css">
</head>
<body>
  <header>
    <h1>Matematika SD</h1>
    <p>Materi belajar Kurikulum Merdeka — slide interaktif, latihan, kuis, asesmen, soal TKA, dan soal kompetisi.</p>
    <nav>${nav.map(n => `<a href="${n.href}">${esc(n.t)}</a>`).join('')}</nav>
  </header>
  <main>
${kelas.map(k => `    <section id="kelas-${k}">
      <h2>Kelas ${k} <small>Fase ${esc(perKelas[k][0].fase)}</small></h2>
      <ul class="daftar">${perKelas[k].map(b => kartu(b, `Bab ${b.nomor}`, b.judul, b.elemen)).join('')}
      </ul>
    </section>`).join('\n')}
${bagianPaket.map(x => x.isi).join('\n')}
${!kelas.length && !bagianPaket.length ? '    <p>Belum ada materi.</p>' : ''}
  </main>
</body>
</html>
`
}
