#!/usr/bin/env node
// Bangun semua ke dist/:
//   dist/index.html                              halaman depan
//   dist/kelas-<k>/<bab>/                         slide web + PDF (slides, lkpd, asesmen)
//   dist/asesmen/topik/kelas-<k>/<paket>/         paket asesmen topik: web + slides.pdf, soal.pdf
//   dist/asesmen/tka/<paket>/                     latihan TKA
//   dist/kompetisi/<paket>/                       soal kompetisi
// Kunci jawaban (kunci.pdf) hanya dengan --kunci.
// Opsi: --no-pdf  --only-pdf  --kunci  --bab <slug-atau-rel>  --base /nama-repo/
import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { parseArgs } from 'node:util'
import { JENIS_PAKET, ROOT, semuaBab, semuaPaket } from './lib.mjs'
import { bacaPaket, buatPaket } from './paket.mjs'
import { halamanDepan } from './situs.mjs'

const { values: o } = parseArgs({
  options: {
    'no-pdf': { type: 'boolean', default: false },
    'only-pdf': { type: 'boolean', default: false },
    'kunci': { type: 'boolean', default: false },
    'bab': { type: 'string' },
    'base': { type: 'string', default: process.env.MATSD_BASE || '/' },
  },
})
const base = o.base.endsWith('/') ? o.base : `${o.base}/`
const DIST = join(ROOT, 'dist')
const bin = n => join(ROOT, 'node_modules/.bin', n)
const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { cwd: ROOT, stdio: 'inherit', ...opts })

// Browser untuk ekspor PDF: CHROME_PATH, atau Chromium/Chrome sistem, atau Chromium milik Playwright.
const chrome = process.env.CHROME_PATH
  || ['/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome-stable', '/usr/bin/google-chrome',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(p => existsSync(p))
const argBrowser = chrome ? ['--executable-path', chrome] : []

const BERKAS = ['slides.pdf', 'soal.pdf', 'lkpd.pdf', 'asesmen.pdf', 'kunci.pdf']

// Semua yang dibangun: bab materi + paket soal.
const butir = [
  ...semuaBab().map(b => ({ ...b, tipe: 'bab', rel: `kelas-${b.kelas}/${b.slug}`, docs: ['lkpd', 'asesmen'] })),
  ...semuaPaket().map(x => ({ ...x, tipe: 'paket', docs: ['soal'] })),
]
const terpilih = butir.filter(b => !o.bab || b.rel === o.bab || b.rel.endsWith(`/${o.bab}`))

if (!o['only-pdf'] && !o.bab)
  rmSync(DIST, { recursive: true, force: true })
mkdirSync(DIST, { recursive: true })

const gagal = []
for (const b of terpilih) {
  const out = join(DIST, b.rel)
  console.log(`\n▶ ${b.rel}`)
  try {
    if (b.tipe === 'paket') {
      const salah = buatPaket(b.dir, b.jenis)
      if (salah.length)
        throw new Error(salah.join('; '))
    }
    const entry = relative(ROOT, join(b.dir, 'slides.md'))
    if (!o['only-pdf'])
      run(bin('slidev'), ['build', entry, '--out', out, '--base', `${base}${b.rel}/`])
    mkdirSync(out, { recursive: true })
    if (!o['no-pdf']) {
      run(bin('slidev'), ['export', entry, '--output', join(out, 'slides.pdf'), '--timeout', '60000', '--wait', '800', ...argBrowser])
      for (const doc of [...b.docs, ...(o.kunci ? ['kunci'] : [])]) {
        const src = join(b.dir, `${doc}.typ`)
        if (existsSync(src))
          run('typst', ['compile', '--root', ROOT, src, join(out, `${doc}.pdf`)])
      }
    }
  }
  catch (e) {
    gagal.push(b.rel)
    console.error(`✘ Gagal: ${b.rel}${e.message ? ` — ${e.message}` : ''}`)
  }
}

if (!o.bab) {
  const ada = b => BERKAS.filter(f => existsSync(join(DIST, b.rel, f)))
  writeFileSync(join(DIST, 'index.html'), halamanDepan({
    bab: semuaBab().map(b => ({ ...b, rel: `kelas-${b.kelas}/${b.slug}`, berkas: ada({ rel: `kelas-${b.kelas}/${b.slug}` }) })),
    paket: semuaPaket().map((x) => {
      const p = bacaPaket(x.dir)
      return { ...x, judul: p.judul, kelas: p.kelas, topik: p.topik, jumlah: p.soal.length, waktu: p.waktu, berkas: ada(x) }
    }),
    jenis: JENIS_PAKET,
  }))
  writeFileSync(join(DIST, '.nojekyll'), '')
  copyFileSync(join(ROOT, 'situs/gaya.css'), join(DIST, 'gaya.css'))
}

console.log(gagal.length ? `\n✘ ${gagal.length} gagal: ${gagal.join(', ')}` : `\n✔ Selesai → dist/`)
process.exit(gagal.length ? 1 : 0)
