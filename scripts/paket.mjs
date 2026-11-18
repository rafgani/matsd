#!/usr/bin/env node
// Paket soal: baca <folder>/paket.yaml → hasilkan slides.md (web), soal.typ dan kunci.typ (cetak).
// CLI: node scripts/paket.mjs [folder ...]   (tanpa argumen: semua paket)
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import YAML from 'yaml'
import { FASE, JENIS_PAKET, ROOT, semuaPaket } from './lib.mjs'

export const TIPE = {
  pg: 'Pilihan ganda',
  pgk: 'PG kompleks',
  bs: 'Benar/Salah',
  isian: 'Isian',
  jodoh: 'Menjodohkan',
  uraian: 'Uraian',
}
const huruf = i => String.fromCharCode(65 + i)

export function bacaPaket(dir) {
  const p = YAML.parse(readFileSync(join(dir, 'paket.yaml'), 'utf8')) ?? {}
  p.soal = (p.soal ?? []).map((s, i) => ({
    ...s,
    nomor: i + 1,
    id: `kuis-${String(i + 1).padStart(2, '0')}`,
    skor: s.skor ?? (s.tipe === 'uraian' ? 2 : 1),
  }))
  return p
}

/** Daftar pesan kesalahan; kosong bila paket valid. */
export function validasi(p, dir) {
  const e = []
  if (!p.judul)
    e.push('judul kosong')
  if (!p.soal.length)
    e.push('belum ada soal')
  for (const s of p.soal) {
    const n = `soal ${s.nomor}`
    if (!TIPE[s.tipe]) {
      e.push(`${n}: tipe "${s.tipe}" tidak dikenal (${Object.keys(TIPE).join(', ')})`)
      continue
    }
    if (!s.soal)
      e.push(`${n}: teks soal kosong`)
    const adaSvgPng = s.gambar ? existsSync(join(dir, 'public', s.gambar)) : true
    if (!adaSvgPng)
      e.push(`${n}: gambar public/${s.gambar} tidak ada`)
    if (s.tipe === 'pg') {
      if (!Array.isArray(s.pilihan) || s.pilihan.length < 2)
        e.push(`${n}: pilihan minimal 2`)
      else if (!Number.isInteger(s.jawaban) || s.jawaban < 0 || s.jawaban >= s.pilihan.length)
        e.push(`${n}: jawaban harus indeks pilihan (mulai 0)`)
    }
    if (s.tipe === 'pgk') {
      if (!Array.isArray(s.pilihan) || s.pilihan.length < 2)
        e.push(`${n}: pilihan minimal 2`)
      else if (!Array.isArray(s.jawaban) || !s.jawaban.length || s.jawaban.some(j => !Number.isInteger(j) || j < 0 || j >= s.pilihan.length))
        e.push(`${n}: jawaban harus daftar indeks pilihan`)
    }
    if (s.tipe === 'bs') {
      if (!Array.isArray(s.pernyataan) || !s.pernyataan.length)
        e.push(`${n}: pernyataan kosong`)
      else if (!Array.isArray(s.jawaban) || s.jawaban.length !== s.pernyataan.length || s.jawaban.some(j => typeof j !== 'boolean'))
        e.push(`${n}: jawaban harus daftar true/false sebanyak pernyataan`)
    }
    if (s.tipe === 'isian' && (s.jawaban === undefined || s.jawaban === '' || (Array.isArray(s.jawaban) && !s.jawaban.length)))
      e.push(`${n}: jawaban isian kosong`)
    if (s.tipe === 'jodoh' && (!Array.isArray(s.pasangan) || s.pasangan.length < 2 || s.pasangan.some(x => !Array.isArray(x) || x.length !== 2)))
      e.push(`${n}: pasangan harus daftar [kiri, kanan], minimal 2`)
  }
  return e
}

// ---------- Typst ----------
const tstr = s => `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
const komaDesimal = s => s.replace(/(\d),(\d)/g, '$1{,}$2')

/** Teks soal ($rumus$, **tebal**, baris baru) → markup Typst. */
export function typ(s) {
  return String(s ?? '').split(/(\$[^$]+\$)/g).map((bag) => {
    if (bag.length > 2 && bag.startsWith('$') && bag.endsWith('$'))
      return `#mi(${tstr(komaDesimal(bag.slice(1, -1)))})`
    return bag.split(/(\*\*[^*]+\*\*)/g).map((b) => {
      if (b.length > 4 && b.startsWith('**') && b.endsWith('**'))
        return `#strong(${tstr(b.slice(2, -2))})`
      return b.split('\n').map(l => l ? `#${tstr(l)}` : '').join('#linebreak()')
    }).join('')
  }).join('')
}
const blok = s => `[${typ(s)}]`

function opsiTypst(s) {
  switch (s.tipe) {
    case 'pg': {
      const pendek = s.pilihan.every(p => String(p).length <= 18)
      return `#pilihan-pg(kolom: ${pendek ? 2 : 1}, ${s.pilihan.map(blok).join(', ')})`
    }
    case 'pgk':
      return `#catatan[Pilih semua jawaban yang benar.]\n#pilihan-pgk(${s.pilihan.map(blok).join(', ')})`
    case 'bs':
      return `#tabel-bs(${s.pernyataan.map(blok).join(', ')})`
    case 'isian':
      return `#isian(${s.satuan ? `satuan: ${tstr(s.satuan)}` : ''})`
    case 'jodoh': {
      const n = s.pasangan.length
      const kanan = s.pasangan.map((_, j) => s.pasangan[(j + 1) % n][1])
      return `#catatan[Tulis huruf pasangan yang tepat di dalam kotak.]\n#jodoh((${s.pasangan.map(p => blok(p[0])).join(', ')},), (${kanan.map(blok).join(', ')},))`
    }
    default:
      return `#garis(n: ${s.baris ?? 4})`
  }
}

function kunciTeks(s) {
  switch (s.tipe) {
    case 'pg': return huruf(s.jawaban)
    case 'pgk': return s.jawaban.map(huruf).join(', ')
    case 'bs': return s.jawaban.map((b, i) => `${huruf(i)}: ${b ? 'Benar' : 'Salah'}`).join('; ')
    case 'isian': return `${[].concat(s.jawaban)[0]}${s.satuan ? ` ${s.satuan}` : ''}`
    case 'jodoh': {
      const n = s.pasangan.length
      return s.pasangan.map((_, i) => `${i + 1}–${huruf((i - 1 + n) % n)}`).join(', ')
    }
    default: return s.jawaban ? String(s.jawaban) : '(lihat pembahasan)'
  }
}

function infoPaket(p) {
  const kelas = p.kelas ? `Kelas ${p.kelas}` : null
  const fase = p.fase ?? (FASE[p.kelas] ? FASE[p.kelas] : null)
  return [kelas, fase ? `Fase ${fase}` : null, p.topik ?? null].filter(Boolean).join(' · ')
}

function bangunSoalTyp(p, jenis) {
  const j = JENIS_PAKET[jenis]
  const petunjuk = p.petunjuk ?? 'Berdoalah sebelum mengerjakan. Bacalah setiap soal dengan teliti.'
  const lines = [
    '// DIHASILKAN OTOMATIS dari paket.yaml oleh scripts/paket.mjs — jangan diedit tangan.',
    '#import "/templates/typst/matsd.typ": *',
    '',
    '#show: dokumen.with(',
    `  jenis: ${tstr(j.label.replace('Asesmen per Topik', 'Asesmen Topik'))},`,
    `  judul: ${tstr(p.judul)},`,
    `  info: ${tstr(infoPaket(p) || j.label)},`,
    `  kaki: ${tstr(`${p.judul}`)},`,
    p.waktu ? `  waktu: ${tstr(p.waktu)},` : '',
    ')',
    '',
    `#petunjuk[${typ(petunjuk)}]`,
    '',
  ]
  for (const s of p.soal) {
    lines.push(`#soal-blok(${s.nomor})[`)
    lines.push(`  ${typ(s.soal)}`)
    if (s.gambar)
      lines.push(`  #align(center, image(${tstr(`public/${s.gambar}`)}, height: ${s.tinggiGambar ?? 5}cm))`)
    lines.push(`  ${opsiTypst(s).split('\n').join('\n  ')}`)
    lines.push(']', '')
  }
  return lines.join('\n')
}

function bangunKunciTyp(p, jenis) {
  const j = JENIS_PAKET[jenis]
  const total = p.soal.reduce((a, s) => a + s.skor, 0)
  const lines = [
    '// DIHASILKAN OTOMATIS dari paket.yaml oleh scripts/paket.mjs — jangan diedit tangan.',
    '#import "/templates/typst/matsd.typ": *',
    '',
    '#show: dokumen.with(',
    `  jenis: ${tstr(`Kunci & Pembahasan — ${j.label.replace('Asesmen per Topik', 'Asesmen Topik')} (Guru)`)},`,
    `  judul: ${tstr(p.judul)},`,
    `  info: ${tstr(infoPaket(p) || j.label)},`,
    `  kaki: ${tstr(`Kunci — ${p.judul}`)},`,
    '  identitas: false,',
    ')',
    '',
    '#bagian[Kunci jawaban]',
    '#kunci-tabel(',
    ...p.soal.map(s => `  ([${s.nomor}], ${blok(TIPE[s.tipe])}, ${blok(kunciTeks(s))}, [${s.skor}], ${blok(s.pembahasan ?? '')}),`),
    ')',
    '',
    `Skor maksimum: *${total}*. Nilai = skor diperoleh ÷ ${total} × 100.`,
    '',
    '#bagian[Kisi-kisi]',
    '#kisi-tabel(',
    ...p.soal.map(s => `  ([${s.nomor}], ${blok([s.topik, ...(s.tp ? [`(${[].concat(s.tp).join(', ')})`] : [])].filter(Boolean).join(' ') || '—')}, ${blok(s.level ?? '—')}, ${blok(s.sumber ?? '')}),`),
    ')',
  ]
  return lines.join('\n')
}

// ---------- Slidev ----------
/** JSON aman untuk atribut HTML bertanda kutip tunggal di Markdown. */
const attr = o => JSON.stringify(o).replace(/&/g, '\\u0026').replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/'/g, '\\u0027')

function bangunSlides(p, jenis, slug) {
  const j = JENIS_PAKET[jenis]
  const info = infoPaket(p)
  const otomatis = p.soal.filter(s => s.tipe !== 'uraian').length
  const head = [
    '---',
    `title: ${JSON.stringify(p.judul)}`,
    `kuisId: ${JSON.stringify(`${jenis}-${slug}`)}`,
    `info: ${JSON.stringify(`${j.label}: ${p.judul}. ${info}`)}`,
    'addons:',
    '  - slidev-addon-matsd',
    'theme: default',
    'fonts:',
    '  sans: Andika',
    '  mono: Fira Code',
    'colorSchema: light',
    'aspectRatio: 16/9',
    'canvasWidth: 1024',
    'transition: slide-left',
    'drawings:',
    '  persist: false',
    'exportFilename: slides',
    'download: slides.pdf',
    'routerMode: hash',
    'layout: sampul',
    ...(p.kelas ? [`kelas: ${JSON.stringify(String(p.kelas))}`] : []),
    ...((p.fase ?? FASE[p.kelas]) ? [`fase: ${p.fase ?? FASE[p.kelas]}`] : []),
    `elemen: ${JSON.stringify(p.topik ? `${j.label} · ${p.topik}` : j.label)}`,
    '---',
    '',
    `# ${p.judul}`,
    '',
    [`${p.soal.length} soal`, p.waktu].filter(Boolean).join(' · '),
    '',
    '---',
    'layout: tujuan',
    '---',
    '',
    '# Petunjuk',
    '',
    ...(p.petunjuk ?? 'Bacalah setiap soal dengan teliti. Pilih atau tulis jawabanmu, lalu tekan Periksa.').split('\n').map(l => `- ${l}`),
    '',
  ]
  const body = []
  for (const s of p.soal) {
    const { nomor, ...sisa } = s
    const props = { ...sisa, nomor }
    if (s.tipe === 'uraian')
      props.pembahasan = [s.jawaban ? `Jawaban: ${s.jawaban}` : '', s.pembahasan ?? ''].filter(Boolean).join('\n')
    body.push('---', 'layout: kuis', '---', '', `<Soal v-bind='${attr(props)}' />`, '')
  }
  body.push('---', 'layout: kuis', '---', '', '# Skor kamu ⭐', '', `<SkorKuis :jumlah="${otomatis}" />`, '')
  if (p.soal.some(s => s.tipe === 'uraian'))
    body.push('<div class="text-center opacity-70 mt-4">Soal uraian tidak dinilai otomatis.</div>', '')
  return [...head, ...body].join('\n')
}

/** Hasilkan slides.md, soal.typ, kunci.typ di dalam folder paket. Mengembalikan daftar kesalahan. */
export function buatPaket(dir, jenis) {
  const p = bacaPaket(dir)
  const salah = validasi(p, dir)
  if (salah.length)
    return salah
  const slug = dir.split('/').filter(Boolean).pop()
  writeFileSync(join(dir, 'slides.md'), bangunSlides(p, jenis, slug))
  writeFileSync(join(dir, 'soal.typ'), bangunSoalTyp(p, jenis))
  writeFileSync(join(dir, 'kunci.typ'), bangunKunciTyp(p, jenis))
  mkdirSync(join(dir, 'public'), { recursive: true })
  return []
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) {
  const argumen = process.argv.slice(2).map(a => resolve(a))
  const daftar = semuaPaket().filter(x => !argumen.length || argumen.includes(x.dir))
  let gagal = 0
  for (const x of daftar) {
    const salah = buatPaket(x.dir, x.jenis)
    if (salah.length) {
      gagal++
      console.error(`✘ ${x.rel}\n${salah.map(m => `   - ${m}`).join('\n')}`)
    }
    else {
      console.log(`✔ ${x.rel}`)
    }
  }
  process.exit(gagal ? 1 : 0)
}
