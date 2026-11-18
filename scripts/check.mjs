#!/usr/bin/env node
// Cek kelengkapan: setiap bab terdaftar, punya berkas wajib, TP-nya ada di ATP, id kuis unik.
import { existsSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { ROOT, folderBab, semuaBab, semuaPaket } from './lib.mjs'
import { bacaPaket, validasi } from './paket.mjs'

const masalah = []
const peringatan = []
const bab = semuaBab()
const terdaftar = new Set(bab.map(b => b.dir))

for (const d of folderBab()) {
  if (!terdaftar.has(d))
    masalah.push(`${relative(ROOT, d)}: belum terdaftar di kurikulum/peta-materi.yaml`)
}

for (const b of bab) {
  const r = relative(ROOT, b.dir)
  for (const f of ['slides.md', 'modul-ajar.md']) {
    if (!existsSync(join(b.dir, f)))
      masalah.push(`${r}: tidak ada ${f}`)
  }
  for (const f of ['bacaan.md', 'lkpd.typ', 'asesmen.typ', 'kunci.typ']) {
    if (!existsSync(join(b.dir, f)))
      peringatan.push(`${r}: tidak ada ${f}`)
  }
  const atpPath = join(ROOT, 'kurikulum/atp', `kelas-${b.kelas}.md`)
  const atp = existsSync(atpPath) ? readFileSync(atpPath, 'utf8') : ''
  if (!b.tp?.length)
    peringatan.push(`${r}: belum ada kode TP di peta-materi.yaml`)
  for (const t of b.tp ?? []) {
    if (!atp.includes(`| ${t} |`))
      masalah.push(`${r}: TP ${t} tidak ditemukan di kurikulum/atp/kelas-${b.kelas}.md`)
  }
  if (existsSync(join(b.dir, 'slides.md'))) {
    const s = readFileSync(join(b.dir, 'slides.md'), 'utf8')
    const ids = [...s.matchAll(/<(?:PilihanGanda|IsianSingkat|BenarSalah|Menjodohkan)[^>]*?\sid="([^"]+)"/gs)].map(m => m[1])
    const dup = ids.filter((x, i) => ids.indexOf(x) !== i)
    if (dup.length)
      masalah.push(`${r}: id soal ganda: ${[...new Set(dup)].join(', ')}`)
    if (/\{\{\w+\}\}/.test(s))
      peringatan.push(`${r}: masih ada placeholder {{...}} di slides.md`)
  }
}

const paket = semuaPaket()
for (const x of paket) {
  const p = bacaPaket(x.dir)
  for (const m of validasi(p, x.dir))
    masalah.push(`${x.rel}: ${m}`)
  if (x.jenis === 'topik') {
    const k = x.rel.match(/kelas-(\d)/)?.[1]
    if (String(p.kelas) !== k)
      masalah.push(`${x.rel}: kelas di paket.yaml (${p.kelas}) tidak sama dengan folder (kelas-${k})`)
    const atpPath = join(ROOT, 'kurikulum/atp', `kelas-${k}.md`)
    const atp = existsSync(atpPath) ? readFileSync(atpPath, 'utf8') : ''
    for (const t of p.tp ?? []) {
      if (!atp.includes(`| ${t} |`))
        masalah.push(`${x.rel}: TP ${t} tidak ditemukan di kurikulum/atp/kelas-${k}.md`)
    }
    if (!(p.tp ?? []).length)
      peringatan.push(`${x.rel}: belum ada kode TP`)
  }
  if (p.soal.some(s => !s.pembahasan && s.tipe !== 'jodoh'))
    peringatan.push(`${x.rel}: ada soal tanpa pembahasan`)
}

for (const p of peringatan) console.log(`⚠ ${p}`)
for (const m of masalah) console.log(`✘ ${m}`)
console.log(masalah.length ? `\n${masalah.length} masalah.` : `\n✔ ${bab.length} bab, ${paket.length} paket soal OK${peringatan.length ? ` (${peringatan.length} peringatan)` : ''}.`)
process.exit(masalah.length ? 1 : 0)
