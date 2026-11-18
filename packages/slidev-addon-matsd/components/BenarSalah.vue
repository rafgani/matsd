<!--
  Pernyataan benar atau salah.
    <BenarSalah id="s4" pernyataan="15 lebih besar dari 12" :jawaban="true" />
-->
<script setup lang="ts">
import { computed } from 'vue'
import { useSoal } from '../lib/kuis'
import { teks } from '../lib/teks'

const props = defineProps<{ id: string, pernyataan?: string, jawaban: boolean, pembahasan?: string }>()
const { hasil, simpan, hapus } = useSoal(props.id)
const dipilih = computed(() => hasil.value?.jawaban as boolean | undefined)
function pilih(v: boolean) {
  if (dipilih.value === undefined)
    simpan(v, v === props.jawaban)
}
</script>

<template>
  <div class="matsd-soal">
    <div class="matsd-soal-teks">
      <slot><span v-html="teks(pernyataan)" /></slot>
    </div>
    <div class="matsd-bs">
      <button
        v-for="v in [true, false]" :key="String(v)" :disabled="dipilih !== undefined"
        :class="{ benar: dipilih !== undefined && v === jawaban, salah: dipilih === v && v !== jawaban }"
        @click="pilih(v)"
      >
        {{ v ? '✔ Benar' : '✘ Salah' }}
      </button>
    </div>
    <div v-if="hasil" class="matsd-umpan" :class="hasil.benar ? 'benar' : 'salah'">
      <span>{{ hasil.benar ? '🎉 Tepat!' : '🤔 Belum tepat.' }}</span>
      <span v-if="pembahasan" class="matsd-pembahasan" v-html="teks(pembahasan)" />
      <button class="matsd-ulang" @click="hapus()">
        Ulangi
      </button>
    </div>
  </div>
</template>
