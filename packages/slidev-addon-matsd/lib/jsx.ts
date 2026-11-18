import JXG from 'jsxgraph'
import '../styles/jsxgraph.css'

/** Palet ramah buta warna (Okabe–Ito). Pakai ini, jangan warna acak. */
export const warna = {
  biru: '#0072B2',
  oranye: '#E69F00',
  hijau: '#009E73',
  merah: '#D55E00',
  ungu: '#CC79A7',
  langit: '#56B4E9',
  kuning: '#F0E442',
  tinta: '#1f2937',
  abu: '#9ca3af',
} as const

let counter = 0

/** Buat papan JSXGraph dengan pengaturan aman untuk slide (tanpa zoom/pan/navigasi). */
export function buatPapan(el: HTMLElement, opsi: Record<string, any> = {}) {
  if (!el.id)
    el.id = `matsd-jxg-${++counter}`
  return JXG.JSXGraph.initBoard(el.id, {
    showCopyright: false,
    showNavigation: false,
    pan: { enabled: false },
    zoom: { enabled: false },
    keepAspectRatio: false,
    ...opsi,
  })
}

export function hapusPapan(board: any) {
  if (board)
    JXG.JSXGraph.freeBoard(board)
}

/** Format angka gaya Indonesia (koma desimal). */
export function fmt(n: number, digit = 2) {
  return Number(n.toFixed(digit)).toLocaleString('id-ID')
}

export { JXG }
