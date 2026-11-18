<!--
  Garis bilangan.
    <GarisBilangan :min="0" :max="20" />
    <GarisBilangan :max="10" :tandai="[3, 7]" />
    <GarisBilangan :max="10" :lompatan="[[2, 5], [5, 9]]" />     (penjumlahan sebagai lompatan)
    <GarisBilangan :max="10" interaktif :nilai="4" />             (titik bisa digeser)
-->
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { buatPapan, fmt, hapusPapan, warna } from '../lib/jsx'

const props = withDefaults(defineProps<{
  min?: number
  max?: number
  langkah?: number
  label?: number
  tandai?: number[]
  lompatan?: [number, number][]
  interaktif?: boolean
  nilai?: number
  width?: number
  height?: number
}>(), {
  min: 0,
  max: 10,
  langkah: 1,
  label: undefined,
  tandai: () => [],
  lompatan: () => [],
  interaktif: false,
  nilai: undefined,
  width: 760,
  height: 170,
})
const emit = defineEmits<{ 'update:nilai': [v: number] }>()

const el = ref<HTMLDivElement>()
let board: any

onMounted(() => {
  const { min, max, langkah } = props
  const labelTiap = props.label ?? langkah
  const pad = (max - min) * 0.05 + langkah * 0.5
  const tinggi = Math.max(1.2, ...props.lompatan.map(([a, b]) => Math.min(2.2, 0.6 + Math.abs(b - a) / (max - min) * 3)))
  board = buatPapan(el.value!, { boundingbox: [min - pad, tinggi + 0.6, max + pad, -1] })
  const umum = { fixed: true, highlight: false }

  board.create('segment', [[min - pad * 0.7, 0], [max + pad * 0.7, 0]], {
    ...umum, strokeColor: warna.tinta, strokeWidth: 3, firstArrow: true, lastArrow: true,
  })
  const eps = langkah / 1000
  for (let v = min; v <= max + eps; v += langkah) {
    const x = Math.round(v / langkah) * langkah
    const besar = Math.abs(x / labelTiap - Math.round(x / labelTiap)) < 1e-6
    board.create('segment', [[x, besar ? -0.18 : -0.1], [x, besar ? 0.18 : 0.1]], { ...umum, strokeColor: warna.tinta, strokeWidth: 2 })
    if (besar)
      board.create('text', [x, -0.5, fmt(x)], { ...umum, anchorX: 'middle', anchorY: 'middle', fontSize: 20, cssClass: 'matsd-jxg-text', highlightCssClass: 'matsd-jxg-text' })
  }

  for (const v of props.tandai)
    board.create('point', [v, 0], { ...umum, name: '', size: 6, fillColor: warna.oranye, strokeColor: warna.tinta })

  props.lompatan.forEach(([a, b], i) => {
    const h = Math.min(2.2, 0.6 + Math.abs(b - a) / (max - min) * 3)
    const c = [warna.biru, warna.hijau, warna.ungu, warna.merah][i % 4]
    board.create('curve', [(t: number) => a + (b - a) * t, (t: number) => 4 * h * t * (1 - t), 0, 1], {
      ...umum, strokeColor: c, strokeWidth: 3, lastArrow: { type: 2, size: 6 },
    })
    const d = b - a
    board.create('text', [(a + b) / 2, h + 0.3, `${d >= 0 ? '+' : '−'}${fmt(Math.abs(d))}`], {
      ...umum, anchorX: 'middle', fontSize: 20, strokeColor: c, cssClass: 'matsd-jxg-text', highlightCssClass: 'matsd-jxg-text',
    })
  })

  if (props.interaktif) {
    const p = board.create('point', [props.nilai ?? min, 0], {
      name: '', size: 9, fillColor: warna.merah, strokeColor: warna.tinta, showInfobox: false,
    })
    p.on('drag', () => {
      let x = Math.round(p.X() / langkah) * langkah
      x = Math.min(max, Math.max(min, x))
      p.moveTo([x, 0])
      emit('update:nilai', x)
    })
    board.create('text', [() => p.X(), 0.65, () => fmt(p.X())], {
      fixed: true, anchorX: 'middle', fontSize: 26, strokeColor: warna.merah, cssClass: 'matsd-jxg-text matsd-bold', highlightCssClass: 'matsd-jxg-text matsd-bold',
    })
  }
})
onBeforeUnmount(() => hapusPapan(board))
</script>

<template>
  <div ref="el" class="jxgbox matsd-board" :style="{ width: `${width}px`, height: `${height}px` }" />
</template>
