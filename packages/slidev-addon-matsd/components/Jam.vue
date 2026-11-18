<!--
  Jam analog. Jarum menit bisa diseret bila `interaktif`.
    <Jam :jam="3" :menit="30" />
    <Jam interaktif digital :langkah-menit="5" />
-->
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { buatPapan, hapusPapan, warna } from '../lib/jsx'

const props = withDefaults(defineProps<{
  jam?: number
  menit?: number
  interaktif?: boolean
  digital?: boolean
  langkahMenit?: number
  ukuran?: number
}>(), { jam: 12, menit: 0, interaktif: false, digital: false, langkahMenit: 5, ukuran: 300 })
const emit = defineEmits<{ ubah: [jam: number, menit: number] }>()

const total = ref(((props.jam % 12) * 60 + props.menit) % 720)
const teks = computed(() => {
  const j = Math.floor(total.value / 60) || 12
  const m = total.value % 60
  return `${String(j).padStart(2, '0')}.${String(m).padStart(2, '0')}`
})

const el = ref<HTMLDivElement>()
let board: any

const pos = (sudut: number, r: number) => [r * Math.sin(sudut), r * Math.cos(sudut)]

onMounted(() => {
  board = buatPapan(el.value!, { boundingbox: [-1.2, 1.2, 1.2, -1.2], keepAspectRatio: true })
  const umum = { fixed: true, highlight: false }
  board.create('circle', [[0, 0], 1], { ...umum, strokeColor: warna.tinta, strokeWidth: 5, fillColor: '#fffdf5', fillOpacity: 1 })
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * 2 * Math.PI
    const besar = i % 5 === 0
    board.create('segment', [pos(a, besar ? 0.88 : 0.93), pos(a, 0.98)], { ...umum, strokeColor: warna.tinta, strokeWidth: besar ? 3 : 1 })
  }
  for (let h = 1; h <= 12; h++) {
    const [x, y] = pos((h / 12) * 2 * Math.PI, 0.74)
    board.create('text', [x, y, String(h)], { ...umum, anchorX: 'middle', anchorY: 'middle', fontSize: Math.round(props.ukuran / 12), cssClass: 'matsd-jxg-text matsd-bold', highlightCssClass: 'matsd-jxg-text matsd-bold' })
  }

  const sudutJam = () => ((total.value / 60) % 12) / 12 * 2 * Math.PI
  board.create('segment', [[0, 0], [() => pos(sudutJam(), 0.5)[0], () => pos(sudutJam(), 0.5)[1]]], {
    ...umum, strokeColor: warna.biru, strokeWidth: 9, lineCap: 'round',
  })

  const awal = pos((total.value % 60) / 60 * 2 * Math.PI, 0.82)
  const ujung = board.create('point', awal, {
    name: '', size: props.interaktif ? 10 : 0, fillColor: warna.merah, strokeColor: warna.merah,
    fixed: !props.interaktif, showInfobox: false, highlight: props.interaktif,
  })
  board.create('segment', [[0, 0], ujung], { ...umum, strokeColor: warna.merah, strokeWidth: 5, lineCap: 'round' })
  board.create('point', [0, 0], { ...umum, name: '', size: 6, fillColor: warna.tinta, strokeColor: warna.tinta })

  ujung.on('drag', () => {
    let a = Math.atan2(ujung.X(), ujung.Y())
    if (a < 0)
      a += 2 * Math.PI
    let m = Math.round((a / (2 * Math.PI)) * 60 / props.langkahMenit) * props.langkahMenit % 60
    const lama = total.value % 60
    let jam = Math.floor(total.value / 60)
    if (lama > 45 && m < 15)
      jam++
    else if (lama < 15 && m > 45)
      jam--
    total.value = ((jam * 60 + m) % 720 + 720) % 720
    m = total.value % 60
    ujung.moveTo(pos(m / 60 * 2 * Math.PI, 0.82))
    board.update()
    emit('ubah', Math.floor(total.value / 60) || 12, m)
  })
})
onBeforeUnmount(() => hapusPapan(board))
</script>

<template>
  <div class="matsd-jam">
    <div ref="el" class="jxgbox matsd-board" :style="{ width: `${ukuran}px`, height: `${ukuran}px` }" />
    <div v-if="digital" class="matsd-jam-digital">
      {{ teks }}
    </div>
  </div>
</template>
