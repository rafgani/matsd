<!--
  Diagram batang atau piktogram dari data sederhana.
    <Diagram judul="Buah kesukaan" :data="{ Apel: 5, Jeruk: 3, Pisang: 7 }" />
    <Diagram jenis="piktogram" ikon="🍎" :data="{ Senin: 4, Selasa: 6 }" />
-->
<script setup lang="ts">
import { computed } from 'vue'
import { warna } from '../lib/jsx'

const props = withDefaults(defineProps<{
  data: Record<string, number>
  jenis?: 'batang' | 'piktogram'
  judul?: string
  ikon?: string
  tinggi?: number
  tampilkanNilai?: boolean
}>(), { jenis: 'batang', judul: '', ikon: '⭐', tinggi: 260, tampilkanNilai: true })

const entri = computed(() => Object.entries(props.data))
const maks = computed(() => Math.max(1, ...entri.value.map(([, v]) => v)))
const palet = [warna.biru, warna.oranye, warna.hijau, warna.ungu, warna.langit, warna.merah]
</script>

<template>
  <figure class="matsd-diagram">
    <figcaption v-if="judul">
      {{ judul }}
    </figcaption>
    <div v-if="jenis === 'batang'" class="matsd-diagram-batang" :style="{ height: `${tinggi}px` }">
      <div v-for="([k, v], i) in entri" :key="k" class="matsd-diagram-kolom">
        <span v-if="tampilkanNilai" class="matsd-diagram-nilai">{{ v }}</span>
        <div class="matsd-diagram-bar" :style="{ height: `${(v / maks) * (tinggi - 60)}px`, background: palet[i % palet.length] }" />
        <span class="matsd-diagram-label">{{ k }}</span>
      </div>
    </div>
    <table v-else class="matsd-diagram-pikto">
      <tr v-for="[k, v] in entri" :key="k">
        <th>{{ k }}</th>
        <td>{{ ikon.repeat(v) }}</td>
      </tr>
    </table>
  </figure>
</template>
