import katex from 'katex'
import 'katex/dist/katex.min.css'

const esc = (s: string) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)

/** Koma desimal di dalam rumus: 0,75 → 0{,}75 (agar tidak diberi spasi). */
export const komaDesimal = (s: string) => s.replace(/(\d),(\d)/g, '$1{,}$2')

/**
 * Ubah teks soal menjadi HTML aman: `$...$` → rumus KaTeX, `**tebal**`, baris baru → <br>.
 * Contoh: "Hasil $\\frac{1}{2} + 0,25$ adalah ..."
 */
export function teks(s: unknown): string {
  const str = String(s ?? '')
  return str.split(/(\$[^$]+\$)/g).map((bag) => {
    if (bag.startsWith('$') && bag.endsWith('$') && bag.length > 2) {
      try {
        return katex.renderToString(komaDesimal(bag.slice(1, -1)), { throwOnError: false })
      }
      catch {
        return esc(bag)
      }
    }
    return esc(bag).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>')
  }).join('')
}
