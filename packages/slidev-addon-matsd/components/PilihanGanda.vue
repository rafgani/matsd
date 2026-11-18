<!--
  Soal pilihan ganda. Soal boleh lewat prop `soal` atau slot (Markdown).
    <PilihanGanda id="s1" soal="7 + 5 = ..." :pilihan="['11', '12', '13']" :jawaban="1"
                  pembahasan="7 + 3 = 10, lalu 10 + 2 = 12." />
  `jawaban` = indeks (mulai 0) pilihan yang benar.
-->
<script setup lang="ts">
import { computed } from 'vue'
import { useSoal } from '../lib/kuis'
import { teks } from '../lib/teks'

const props = defineProps<{
  id: string
  soal?: string
  pilihan: string[]
  jawaban: number
  pembahasan?: string
}>()
const { hasil, simpan, hapus } = useSoal(props.id)
const dipilih = computed(() => hasil.value?.jawaban as number | undefined)

function pilih(i: number) {
  if (dipilih.value === undefined)
    simpan(i, i === props.jawaban)
}
</script>

<template>
  <div class="matsd-soal">
    <div class="matsd-soal-teks">
      <slot><span v-html="teks(soal)" /></slot>
    </div>
    <ol class="matsd-pilihan">
      <li v-for="(p, i) in pilihan" :key="i">
        <button
          :class="{
            benar: dipilih !== undefined && i === jawaban,
            salah: dipilih === i && i !== jawaban,
          }"
          :disabled="dipilih !== undefined" @click="pilih(i)"
        >
          <span class="matsd-huruf">{{ String.fromCharCode(65 + i) }}</span> <span v-html="teks(p)" />
        </button>
      </li>
    </ol>
    <div v-if="hasil" class="matsd-umpan" :class="hasil.benar ? 'benar' : 'salah'">
      <span>{{ hasil.benar ? '🎉 Hebat, jawabanmu benar!' : '🤔 Belum tepat. Ayo coba lagi!' }}</span>
      <span v-if="pembahasan && hasil.benar" class="matsd-pembahasan" v-html="teks(pembahasan)" />
      <button class="matsd-ulang" @click="hapus()">
        Ulangi
      </button>
    </div>
  </div>
</template>
