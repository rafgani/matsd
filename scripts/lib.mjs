import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import YAML from 'yaml'

export const ROOT = resolve(fileURLToPath(import.meta.url), '../..')
export const PETA = join(ROOT, 'kurikulum/peta-materi.yaml')
export const FASE = { 1: 'A', 2: 'A', 3: 'B', 4: 'B', 5: 'C', 6: 'C' }

export function bacaPeta() {
  return YAML.parse(readFileSync(PETA, 'utf8'))
}
export function tulisPeta(peta) {
  const kepala = readFileSync(PETA, 'utf8').split('\n').filter(l => l.startsWith('#')).join('\n')
  writeFileSync(PETA, `${kepala}\n${YAML.stringify(peta, { lineWidth: 0 })}`)
}

/** Semua bab: { kelas, fase, slug, dir, judul, ... } dari peta + folder yang ada. */
export function semuaBab() {
  const peta = bacaPeta()
  const out = []
  for (const [kelas, k] of Object.entries(peta.kelas)) {
    for (const b of k.bab ?? []) {
      out.push({ ...b, kelas: Number(kelas), fase: k.fase, dir: join(ROOT, 'konten', `kelas-${kelas}`, b.slug) })
    }
  }
  return out
}

/** Folder bab di konten/ (untuk cek yang belum terdaftar). */
export function folderBab() {
  const base = join(ROOT, 'konten')
  const out = []
  for (const k of readdirSync(base).filter(d => d.startsWith('kelas-'))) {
    for (const b of readdirSync(join(base, k)).filter(d => existsSync(join(base, k, d, 'slides.md'))))
      out.push(join(base, k, b))
  }
  return out
}

export function slugify(s) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

/** Jenis paket soal dan folder induknya. */
export const JENIS_PAKET = {
  topik: { base: 'asesmen/topik', label: 'Asesmen per Topik' },
  tka: { base: 'asesmen/tka', label: 'Latihan TKA' },
  kompetisi: { base: 'kompetisi', label: 'Soal Kompetisi' },
}

/** Semua paket soal: folder yang berisi paket.yaml (nama folder berawalan "_" dilewati). */
export function semuaPaket() {
  const out = []
  const jalan = (dir, jenis, kedalaman) => {
    if (!existsSync(dir) || kedalaman > 3)
      return
    if (existsSync(join(dir, 'paket.yaml'))) {
      out.push({ jenis, dir, rel: relative(ROOT, dir).split('\\').join('/') })
      return
    }
    for (const d of readdirSync(dir, { withFileTypes: true })) {
      if (d.isDirectory() && !d.name.startsWith('_') && !d.name.startsWith('.'))
        jalan(join(dir, d.name), jenis, kedalaman + 1)
    }
  }
  for (const [jenis, j] of Object.entries(JENIS_PAKET))
    jalan(join(ROOT, j.base), jenis, 0)
  return out
}
