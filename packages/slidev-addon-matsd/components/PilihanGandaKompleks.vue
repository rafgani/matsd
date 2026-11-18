<!--
  Pilihan ganda kompleks: jawaban benar bisa lebih dari satu (format TKA).
    <PilihanGandaKompleks id="s1" soal="Pilih semua bilangan prima." :pilihan="['2', '9', '11', '15']" :jawaban="[0, 2]" />
  `jawaban` = daftar indeks (mulai 0). Benar bila pilihan siswa persis sama.
-->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSoal } from '../lib/kuis'
import { teks } from '../lib/teks'

const props = defineProps<{ id: string, soal?: string, pilihan: string[], jawaban: number[], pembahasan?: string }>()
const { hasil, simpan, hapus } = useSoal(props.id)
const dipilih = ref<number[]>([...((hasil.value?.jawaban as number[]) ?? [])])
const terkunci = computed(() => !!hasil.value)

function ubah(i: number) {
  if (terkunci.value)
    return
  dipilih.value = dipilih.value.includes(i) ? dipilih.value.filter(x => x !== i) : [...dipilih.value, i]
}
function periksa() {
  if (!dipilih.value.length)
    return
  const a = [...dipilih.value].sort()
  const b = [...props.jawaban].sort()
  simpan(a, a.length === b.length && a.every((x, k) => x === b[k]))
}
function ulangi() {
  hapus()
  dipilih.value = []
}
</script>

<template>
  <div class="matsd-soal">
    <div class="matsd-soal-teks">
      <slot><span v-html="teks(soal)" /></slot>
    </div>
    <div class="matsd-catatan">
      Jawaban benar bisa lebih dari satu.
    </div>
    <div class="matsd-pgk">
      <button
        v-for="(p, i) in pilihan" :key="i" :disabled="terkunci"
        :class="{ pilih: dipilih.includes(i), benar: terkunci && jawaban.includes(i), salah: terkunci && dipilih.includes(i) && !jawaban.includes(i) }"
        @click="ubah(i)"
      >
        <span class="matsd-kotak">{{ dipilih.includes(i) ? '✔' : '' }}</span>
        <span v-html="teks(p)" />
      </button>
    </div>
    <button v-if="!terkunci" class="matsd-periksa mt-2" @click="periksa">
      Periksa
    </button>
    <div v-if="hasil" class="matsd-umpan" :class="hasil.benar ? 'benar' : 'salah'">
      <span>{{ hasil.benar ? '🎉 Semua pilihanmu tepat!' : '🤔 Belum tepat. Pilihan yang benar ditandai hijau.' }}</span>
      <span v-if="pembahasan" class="matsd-pembahasan" v-html="teks(pembahasan)" />
      <button class="matsd-ulang" @click="ulangi">
        Ulangi
      </button>
    </div>
  </div>
</template>
