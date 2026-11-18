<!--
  Soal uraian (tidak dinilai otomatis). Siswa menulis jawaban, lalu bisa membuka pembahasan.
    <Uraian soal="Jelaskan caramu ..." pembahasan="..." />
-->
<script setup lang="ts">
import { ref } from 'vue'
import { teks } from '../lib/teks'

defineProps<{ soal?: string, pembahasan?: string }>()
const buka = ref(false)
</script>

<template>
  <div class="matsd-soal">
    <div class="matsd-soal-teks">
      <slot><span v-html="teks(soal)" /></slot>
    </div>
    <textarea class="matsd-uraian" rows="3" placeholder="Tulis jawabanmu di sini atau di kertas ..." />
    <button v-if="pembahasan" class="matsd-ulang mt-2" @click="buka = !buka">
      {{ buka ? 'Tutup pembahasan' : 'Lihat pembahasan' }}
    </button>
    <div v-if="buka" class="matsd-umpan benar">
      <span class="matsd-pembahasan" v-html="teks(pembahasan)" />
    </div>
  </div>
</template>
