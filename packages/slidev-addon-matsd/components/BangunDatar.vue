<!--
  Bangun datar di atas petak. Titik sudut bisa digeser (menempel ke petak) bila `interaktif`.
  Menampilkan keliling dan luas dalam satuan petak.
    <BangunDatar :titik="[[1,1],[5,1],[5,4],[1,4]]" />
    <BangunDatar :titik="[[1,1],[6,1],[3,4]]" interaktif :lebar="8" :tinggi="6" />
-->
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { buatPapan, fmt, hapusPapan, warna } from '../lib/jsx'

const props = withDefaults(defineProps<{
  titik?: [number, number][]
  lebar?: number
  tinggi?: number
  interaktif?: boolean
  tampilkan?: ('keliling' | 'luas' | 'sisi')[]
  satuan?: string
  width?: number
}>(), {
  titik: () => [[1, 1], [5, 1], [5, 4], [1, 4]],
  lebar: 10,
  tinggi: 6,
  interaktif: false,
  tampilkan: () => ['keliling', 'luas'],
  satuan: 'satuan',
  width: 520,
})

const keliling = ref(0)
const luas = ref(0)
const el = ref<HTMLDivElement>()
let board: any

onMounted(() => {
  board = buatPapan(el.value!, { boundingbox: [-0.5, props.tinggi + 0.5, props.lebar + 0.5, -0.5], keepAspectRatio: true, grid: { majorStep: 1, strokeColor: '#cbd5e1', strokeOpacity: 1 } })
  const pts = props.titik.map(([x, y], i) => board.create('point', [x, y], {
    name: String.fromCharCode(65 + i), size: props.interaktif ? 7 : 4, fixed: !props.interaktif,
    snapToGrid: true, snapSizeX: 1, snapSizeY: 1, fillColor: warna.biru, strokeColor: warna.tinta, showInfobox: false,
    label: { fontSize: 18, offset: [-18, 12] },
  }))
  board.create('polygon', pts, {
    fillColor: warna.langit, fillOpacity: 0.35, highlight: false,
    borders: { strokeColor: warna.biru, strokeWidth: 3, highlight: false },
    vertices: { visible: true },
  })
  if (props.tampilkan.includes('sisi')) {
    pts.forEach((p, i) => {
      const q = pts[(i + 1) % pts.length]
      board.create('text', [() => (p.X() + q.X()) / 2, () => (p.Y() + q.Y()) / 2, () => fmt(p.Dist(q), 1)], {
        fixed: true, anchorX: 'middle', anchorY: 'middle', fontSize: 16, strokeColor: warna.merah, cssClass: 'matsd-jxg-text matsd-chip', highlightCssClass: 'matsd-jxg-text matsd-chip',
      })
    })
  }
  const hitung = () => {
    let k = 0
    let l = 0
    pts.forEach((p, i) => {
      const q = pts[(i + 1) % pts.length]
      k += p.Dist(q)
      l += p.X() * q.Y() - q.X() * p.Y()
    })
    keliling.value = k
    luas.value = Math.abs(l) / 2
  }
  hitung()
  board.on('update', hitung)
})
onBeforeUnmount(() => hapusPapan(board))
</script>

<template>
  <div class="matsd-bangun">
    <div ref="el" class="jxgbox matsd-board" :style="{ width: `${width}px`, height: `${width * (tinggi + 1) / (lebar + 1)}px` }" />
    <div class="matsd-bangun-info">
      <div v-if="tampilkan.includes('keliling')">
        Keliling = <b>{{ fmt(keliling, 1) }}</b> {{ satuan }}
      </div>
      <div v-if="tampilkan.includes('luas')">
        Luas = <b>{{ fmt(luas, 1) }}</b> {{ satuan }} persegi
      </div>
    </div>
  </div>
</template>
