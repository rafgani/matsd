<!--
  Rekap skor kuis untuk deck ini (tersimpan di browser siswa).
  Hanya menghitung soal yang id-nya diawali `awalan` (default "kuis", jadi soal latihan "lat-..." tidak dihitung).
    <SkorKuis :jumlah="5" />
    <SkorKuis awalan="" />   (semua soal)
-->
<script setup lang="ts">
import { computed } from 'vue'
import { useRekap } from '../lib/kuis'

const props = withDefaults(defineProps<{ jumlah?: number, awalan?: string }>(), { jumlah: undefined, awalan: 'kuis' })
const { dijawab, benar, reset } = useRekap(props.awalan)
const total = computed(() => props.jumlah ?? dijawab.value)
const bintang = computed(() => total.value ? Math.round((benar.value / total.value) * 3) : 0)
</script>

<template>
  <div class="matsd-skor">
    <div class="matsd-bintang" aria-hidden="true">
      <span v-for="i in 3" :key="i" :class="{ nyala: i <= bintang }">★</span>
    </div>
    <div class="matsd-skor-angka">
      Benar <b>{{ benar }}</b> dari <b>{{ total }}</b> soal
    </div>
    <div v-if="jumlah && dijawab < jumlah" class="matsd-skor-sisa">
      Masih ada {{ jumlah - dijawab }} soal yang belum dijawab.
    </div>
    <button class="matsd-ulang" @click="reset()">
      Mulai ulang kuis
    </button>
  </div>
</template>
