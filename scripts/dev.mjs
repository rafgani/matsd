#!/usr/bin/env node
// npm run dev -- konten/kelas-1/bab-01-...        (tanpa argumen: bab pertama di peta)
// npm run dev -- asesmen/tka/contoh-tka-1          (paket soal: dibangun ulang otomatis saat paket.yaml berubah)
import { spawn } from 'node:child_process'
import { existsSync, watch } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { ROOT, semuaBab, semuaPaket } from './lib.mjs'
import { buatPaket } from './paket.mjs'

let target = process.argv[2]
if (!target) {
  const b = semuaBab()[0]
  if (!b)
    throw new Error('Belum ada bab. Buat dengan: npm run new -- --kelas 1 --bab 1 --judul "..."')
  target = relative(ROOT, b.dir)
}
const dir = resolve(ROOT, target.endsWith('.md') ? join(target, '..') : target)
const paket = existsSync(join(dir, 'paket.yaml')) ? semuaPaket().find(x => x.dir === dir) : null
if (paket) {
  const bangun = () => {
    const salah = buatPaket(paket.dir, paket.jenis)
    console.log(salah.length ? `✘ paket.yaml:\n${salah.map(m => `   - ${m}`).join('\n')}` : '↻ slides/soal/kunci dibangun ulang')
  }
  bangun()
  let t
  watch(join(dir, 'paket.yaml'), () => { clearTimeout(t); t = setTimeout(bangun, 150) })
}
const entry = target.endsWith('.md') ? target : join(target, 'slides.md')
spawn('npx', ['slidev', entry, '--open', 'false', ...process.argv.slice(3)], { cwd: ROOT, stdio: 'inherit' })
  .on('exit', c => process.exit(c ?? 0))
