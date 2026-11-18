#!/usr/bin/env node
// Buat paket soal baru dari templates/paket/paket.yaml.
// npm run paket -- --jenis topik --kelas 4 --topik Pecahan --judul "Asesmen Pecahan 1" [--tp 4.BIL.3] [--waktu "40 menit"]
// npm run paket -- --jenis tka --judul "Latihan TKA 1" [--kelas 6]
// npm run paket -- --jenis kompetisi --judul "Latihan OSN 1" [--kelas 4-6]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import { FASE, JENIS_PAKET, ROOT, slugify } from './lib.mjs'

const { values: a } = parseArgs({
  options: {
    jenis: { type: 'string' },
    judul: { type: 'string' },
    kelas: { type: 'string' },
    topik: { type: 'string', default: '' },
    tp: { type: 'string', default: '' },
    waktu: { type: 'string', default: '' },
    slug: { type: 'string' },
  },
})
const j = JENIS_PAKET[a.jenis]
if (!j || !a.judul) {
  console.error('Pemakaian: npm run paket -- --jenis <topik|tka|kompetisi> --judul "<judul>" [--kelas N] [--topik T] [--tp a,b] [--waktu "60 menit"]')
  process.exit(1)
}
const kelas = a.kelas ?? (a.jenis === 'tka' ? '6' : a.jenis === 'topik' ? '' : '')
if (a.jenis === 'topik' && !/^[1-6]$/.test(kelas)) {
  console.error('Asesmen topik wajib --kelas 1–6')
  process.exit(1)
}
const slug = a.slug ?? slugify(a.judul)
const dir = a.jenis === 'topik' ? join(ROOT, j.base, `kelas-${kelas}`, slug) : join(ROOT, j.base, slug)
if (existsSync(dir))
  throw new Error(`Sudah ada: ${dir}`)
mkdirSync(join(dir, 'public'), { recursive: true })

const tp = a.tp ? a.tp.split(',').map(s => s.trim()) : []
const ganti = {
  JUDUL: a.judul,
  JENIS: a.jenis,
  KELAS: kelas ? (/^\d+$/.test(kelas) ? kelas : JSON.stringify(kelas)) : '""',
  FASE: FASE[kelas] ?? '',
  TOPIK: a.topik ? JSON.stringify(a.topik) : '""',
  TP: tp.length ? `[${tp.join(', ')}]` : '[]',
  WAKTU: a.waktu ? JSON.stringify(a.waktu) : '""',
}
const isi = readFileSync(join(ROOT, 'templates/paket/paket.yaml'), 'utf8').replace(/\{\{(\w+)\}\}/g, (m, k) => ganti[k] ?? m)
writeFileSync(join(dir, 'paket.yaml'), isi)
console.log(`✔ Paket dibuat: ${dir.replace(`${ROOT}/`, '')}/paket.yaml`)
console.log(`  Jalankan: npm run dev -- ${dir.replace(`${ROOT}/`, '')}`)
