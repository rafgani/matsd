<!--
  Pecahan sebagai juring lingkaran. Klik juring untuk mewarnai bila `interaktif`.
    <PecahanLingkaran :penyebut="4" :pembilang="1" />
    <PecahanLingkaran :penyebut="8" interaktif />
-->
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { buatPapan, hapusPapan, warna } from '../lib/jsx'

const props = withDefaults(defineProps<{
  penyebut?: number
  pembilang?: number
  interaktif?: boolean
  warnaIsi?: string
  ukuran?: number
  label?: boolean
}>(), { penyebut: 4, pembilang: 1, interaktif: false, warnaIsi: undefined, ukuran: 260, label: true })
const emit = defineEmits<{ ubah: [pembilang: number] }>()

const terisi = ref(new Set<number>(Array.from({ length: Math.min(props.pembilang, props.penyebut) }, (_, i) => i)))
const el = ref<HTMLDivElement>()
let board: any

onMounted(() => {
  board = buatPapan(el.value!, { boundingbox: [-1.1, 1.1, 1.1, -1.1], keepAspectRatio: true })
  const isi = props.warnaIsi ?? warna.oranye
  const n = props.penyebut
  const o = board.create('point', [0, 0], { visible: false, fixed: true })
  for (let i = 0; i < n; i++) {
    const style = {
      fixed: true, highlight: false, strokeColor: warna.tinta, strokeWidth: 3,
      fillColor: terisi.value.has(i) ? isi : '#ffffff', fillOpacity: 1,
    }
    let bagian: any
    if (n === 1) {
      bagian = board.create('circle', [o, 1], style)
    }
    else {
      const a1 = Math.PI / 2 - (2 * Math.PI * (i + 1)) / n
      const a2 = Math.PI / 2 - (2 * Math.PI * i) / n
      const p1 = board.create('point', [Math.cos(a1), Math.sin(a1)], { visible: false, fixed: true })
      const p2 = board.create('point', [Math.cos(a2), Math.sin(a2)], { visible: false, fixed: true })
      bagian = board.create('sector', [o, p1, p2], style)
    }
    if (props.interaktif) {
      bagian.on('down', () => {
        const s = new Set(terisi.value)
        s.has(i) ? s.delete(i) : s.add(i)
        terisi.value = s
        bagian.setAttribute({ fillColor: s.has(i) ? isi : '#ffffff' })
        emit('ubah', s.size)
      })
    }
  }
})
onBeforeUnmount(() => hapusPapan(board))
</script>

<template>
  <div class="matsd-pecahan">
    <div ref="el" class="jxgbox matsd-board" :class="{ 'cursor-pointer': interaktif }" :style="{ width: `${ukuran}px`, height: `${ukuran}px` }" />
    <div v-if="label" class="matsd-frac">
      <span>{{ terisi.size }}</span><span>{{ penyebut }}</span>
    </div>
  </div>
</template>
