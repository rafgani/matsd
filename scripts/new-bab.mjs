#!/usr/bin/env node
// Buat bab baru dari template dan daftarkan di kurikulum/peta-materi.yaml.
// Pemakaian: npm run new -- --kelas 2 --bab 3 --judul "Perkalian" --elemen Bilangan [--tp 2.BIL.4,2.BIL.5]
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import { FASE, ROOT, bacaPeta, slugify, tulisPeta } from './lib.mjs'

const { values: a } = parseArgs({
  options: {
    kelas: { type: 'string' },
    bab: { type: 'string' },
    judul: { type: 'string' },
    elemen: { type: 'string', default: 'Bilangan' },
    tp: { type: 'string', default: '' },
  },
})
if (!a.kelas || !a.bab || !a.judul) {
  console.error('Pemakaian: npm run new -- --kelas <1-6> --bab <n> --judul "<judul>" [--elemen Bilangan] [--tp 1.BIL.1,1.BIL.2]')
  process.exit(1)
}
const kelas = Number(a.kelas)
const fase = FASE[kelas]
if (!fase)
  throw new Error('Kelas harus 1–6')
const nomor = String(a.bab).padStart(2, '0')
const slug = `bab-${nomor}-${slugify(a.judul)}`
const dir = join(ROOT, 'konten', `kelas-${kelas}`, slug)
if (existsSync(dir))
  throw new Error(`Sudah ada: ${dir}`)

const tp = a.tp ? a.tp.split(',').map(s => s.trim()) : []
const ganti = {
  JUDUL: a.judul,
  ID: `k${kelas}-${slug}`,
  KELAS: String(kelas),
  FASE: fase,
  BAB: String(Number(a.bab)),
  ELEMEN: a.elemen,
  TP1: tp[0] ? `(${tp[0]}) …` : 'Tujuan pembelajaran 1',
  TP2: tp[1] ? `(${tp[1]}) …` : 'Tujuan pembelajaran 2',
}
const isi = s => s.replace(/\{\{(\w+)\}\}/g, (m, k) => ganti[k] ?? m)

mkdirSync(join(dir, 'public'), { recursive: true })
const T = join(ROOT, 'templates')
const salin = [
  ['deck/slides.md', 'slides.md'],
  ['modul-ajar.md', 'modul-ajar.md'],
  ['bacaan.md', 'bacaan.md'],
  ['typst/lkpd.typ', 'lkpd.typ'],
  ['typst/asesmen.typ', 'asesmen.typ'],
  ['typst/kunci.typ', 'kunci.typ'],
]
for (const [src, dst] of salin)
  writeFileSync(join(dir, dst), isi(readFileSync(join(T, src), 'utf8')))

const peta = bacaPeta()
peta.kelas[kelas] ??= { fase, bab: [] }
peta.kelas[kelas].bab ??= []
peta.kelas[kelas].bab.push({ nomor: Number(a.bab), slug, judul: a.judul, elemen: a.elemen, tp, status: 'draf' })
peta.kelas[kelas].bab.sort((x, y) => x.nomor - y.nomor)
tulisPeta(peta)

console.log(`✔ Bab dibuat: konten/kelas-${kelas}/${slug}`)
console.log(`  Jalankan: npm run dev -- konten/kelas-${kelas}/${slug}`)
