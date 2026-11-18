<!--
  Papan JSXGraph umum. Untuk kasus khusus yang belum ada komponennya.
  Contoh:
    <JsxBoard :bbox="[-1, 6, 11, -1]" axis :init="(b) => b.create('point', [3, 2])" />
-->
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { JXG, buatPapan, hapusPapan } from '../lib/jsx'

const props = withDefaults(defineProps<{
  bbox?: [number, number, number, number]
  width?: number
  height?: number
  axis?: boolean
  grid?: boolean
  keepAspectRatio?: boolean
  init?: (board: any, jxg: typeof JXG) => void
}>(), {
  bbox: () => [-5, 5, 5, -5],
  width: 480,
  height: 360,
  axis: false,
  grid: false,
  keepAspectRatio: true,
})
const emit = defineEmits<{ ready: [board: any] }>()

const el = ref<HTMLDivElement>()
let board: any

onMounted(() => {
  board = buatPapan(el.value!, {
    boundingbox: props.bbox,
    axis: props.axis,
    grid: props.grid,
    keepAspectRatio: props.keepAspectRatio,
  })
  props.init?.(board, JXG)
  emit('ready', board)
})
onBeforeUnmount(() => hapusPapan(board))
</script>

<template>
  <div ref="el" class="jxgbox matsd-board" :style="{ width: `${width}px`, height: `${height}px` }" />
</template>
