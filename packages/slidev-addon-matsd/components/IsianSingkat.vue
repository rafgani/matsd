<!--
  Soal isian singkat. `jawaban` boleh satu nilai atau daftar jawaban yang diterima.
    <IsianSingkat id="s2" soal="9 + 6 = ..." :jawaban="15" />
    <IsianSingkat id="s3" soal="Nama bangun bersisi tiga?" :jawaban="['segitiga']" satuan="" />
  Angka desimal boleh pakai koma atau titik.
-->
<script setup lang="ts">
import { ref } from 'vue'
import { samakan, useSoal } from '../lib/kuis'
import { teks } from '../lib/teks'

const props = withDefaults(defineProps<{
  id: string
  soal?: string
  jawaban: string | number | (string | number)[]
  satuan?: string
  pembahasan?: string
}>(), { soal: undefined, satuan: '', pembahasan: undefined })
const { hasil, simpan, hapus } = useSoal(props.id)
const isi = ref(String(hasil.value?.jawaban ?? ''))

function periksa() {
  if (!isi.value.trim())
    return
  const daftar = Array.isArray(props.jawaban) ? props.jawaban : [props.jawaban]
  simpan(isi.value, daftar.some(j => samakan(isi.value, j)))
}
function ulangi() {
  hapus()
  isi.value = ''
}
</script>

<template>
  <div class="matsd-soal">
    <div class="matsd-soal-teks">
      <slot><span v-html="teks(soal)" /></slot>
    </div>
    <form class="matsd-isian" @submit.prevent="periksa">
      <input v-model="isi" :disabled="!!hasil" inputmode="decimal" autocomplete="off" aria-label="Jawaban" placeholder="?">
      <span v-if="satuan">{{ satuan }}</span>
      <button v-if="!hasil" type="submit" class="matsd-periksa">
        Periksa
      </button>
    </form>
    <div v-if="hasil" class="matsd-umpan" :class="hasil.benar ? 'benar' : 'salah'">
      <span>{{ hasil.benar ? '🎉 Benar!' : '🤔 Belum tepat. Ayo coba lagi!' }}</span>
      <span v-if="pembahasan && hasil.benar" class="matsd-pembahasan" v-html="teks(pembahasan)" />
      <button class="matsd-ulang" @click="ulangi">
        Ulangi
      </button>
    </div>
  </div>
</template>
