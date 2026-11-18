<!--
  Tabel Benar/Salah untuk beberapa pernyataan (format TKA "pilihan ganda kompleks kategori").
    <TabelBenarSalah id="s2" soal="Tentukan Benar atau Salah." :pernyataan="['2 + 2 = 4', '5 > 7']" :jawaban="[true, false]" />
  Benar bila semua baris tepat.
-->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSoal } from '../lib/kuis'
import { teks } from '../lib/teks'

const props = defineProps<{ id: string, soal?: string, pernyataan: string[], jawaban: boolean[], pembahasan?: string }>()
const { hasil, simpan, hapus } = useSoal(props.id)
const isi = ref<(boolean | null)[]>((hasil.value?.jawaban as boolean[]) ?? props.pernyataan.map(() => null))
const terkunci = computed(() => !!hasil.value)
const lengkap = computed(() => isi.value.every(v => v !== null))

function pilih(i: number, v: boolean) {
  if (!terkunci.value)
    isi.value[i] = v
}
function periksa() {
  if (lengkap.value)
    simpan([...isi.value], isi.value.every((v, i) => v === props.jawaban[i]))
}
function ulangi() {
  hapus()
  isi.value = props.pernyataan.map(() => null)
}
</script>

<template>
  <div class="matsd-soal">
    <div class="matsd-soal-teks">
      <slot><span v-html="teks(soal)" /></slot>
    </div>
    <table class="matsd-tbs">
      <thead>
        <tr><th>Pernyataan</th><th>Benar</th><th>Salah</th></tr>
      </thead>
      <tbody>
        <tr v-for="(p, i) in pernyataan" :key="i" :class="terkunci ? (isi[i] === jawaban[i] ? 'benar' : 'salah') : ''">
          <td v-html="teks(p)" />
          <td v-for="v in [true, false]" :key="String(v)">
            <button :disabled="terkunci" :class="{ pilih: isi[i] === v }" :aria-label="v ? 'Benar' : 'Salah'" @click="pilih(i, v)">
              {{ isi[i] === v ? '●' : '' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <button v-if="!terkunci" class="matsd-periksa mt-2" :disabled="!lengkap" @click="periksa">
      Periksa
    </button>
    <div v-if="hasil" class="matsd-umpan" :class="hasil.benar ? 'benar' : 'salah'">
      <span>{{ hasil.benar ? '🎉 Semua tepat!' : '🤔 Ada yang belum tepat (baris merah).' }}</span>
      <span v-if="pembahasan" class="matsd-pembahasan" v-html="teks(pembahasan)" />
      <button class="matsd-ulang" @click="ulangi">
        Ulangi
      </button>
    </div>
  </div>
</template>
