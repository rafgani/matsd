<!--
  Batang pecahan. Satu baris atau beberapa baris untuk membandingkan.
    <PecahanBatang :penyebut="4" :pembilang="3" />
    <PecahanBatang :baris="[{ penyebut: 2, pembilang: 1 }, { penyebut: 4, pembilang: 2 }]" />
    <PecahanBatang :penyebut="6" interaktif />
-->
<script setup lang="ts">
import { ref } from 'vue'
import { warna } from '../lib/jsx'

interface Baris { penyebut: number, pembilang: number }
const props = withDefaults(defineProps<{
  penyebut?: number
  pembilang?: number
  baris?: Baris[]
  interaktif?: boolean
  lebar?: number
  label?: boolean
}>(), { penyebut: 4, pembilang: 1, baris: undefined, interaktif: false, lebar: 640, label: true })

const palet = [warna.oranye, warna.langit, warna.hijau, warna.ungu]
const data = ref((props.baris ?? [{ penyebut: props.penyebut, pembilang: props.pembilang }])
  .map(b => Array.from({ length: b.penyebut }, (_, i) => i < b.pembilang)))

function klik(r: number, i: number) {
  if (props.interaktif)
    data.value[r][i] = !data.value[r][i]
}
</script>

<template>
  <div class="matsd-batang-wrap">
    <div v-for="(row, r) in data" :key="r" class="matsd-batang-row">
      <div class="matsd-batang" :style="{ width: `${lebar}px` }">
        <div
          v-for="(on, i) in row" :key="i" class="matsd-batang-sel" :class="{ 'cursor-pointer': interaktif }"
          :style="{ background: on ? palet[r % palet.length] : '#fff' }" @click="klik(r, i)"
        />
      </div>
      <div v-if="label" class="matsd-frac">
        <span>{{ row.filter(Boolean).length }}</span><span>{{ row.length }}</span>
      </div>
    </div>
  </div>
</template>
