<!--
  Menjodohkan: klik item kiri, lalu pasangannya di kanan.
    <Menjodohkan id="s5" :pasangan="[['5 + 5', '10'], ['3 + 4', '7'], ['6 + 2', '8']]" />
  Kolom kanan diacak (tetap sama setiap dibuka).
-->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { acak, useSoal } from '../lib/kuis'
import { warna } from '../lib/jsx'
import { teks } from '../lib/teks'

const props = defineProps<{ id: string, soal?: string, pasangan: [string, string][] }>()
const { hasil, simpan, hapus } = useSoal(props.id)

const kanan = computed(() => acak(props.pasangan.map((p, i) => ({ teks: p[1], i })), props.id))
const jodoh = ref<Record<number, number>>({ ...((hasil.value?.jawaban as Record<number, number>) ?? {}) })
const aktif = ref<number | null>(null)
const palet = [warna.biru, warna.oranye, warna.hijau, warna.ungu, warna.langit, warna.merah]

const urutan = computed(() => Object.keys(jodoh.value).map(Number))
function warnaKiri(i: number) {
  const n = urutan.value.indexOf(i)
  return n >= 0 ? palet[n % palet.length] : undefined
}
function warnaKanan(j: number) {
  const kiri = Object.entries(jodoh.value).find(([, v]) => v === j)
  return kiri ? warnaKiri(Number(kiri[0])) : undefined
}
function klikKiri(i: number) {
  if (hasil.value)
    return
  delete jodoh.value[i]
  aktif.value = i
}
function klikKanan(j: number) {
  if (hasil.value || aktif.value === null)
    return
  for (const [k, v] of Object.entries(jodoh.value)) {
    if (v === j)
      delete jodoh.value[Number(k)]
  }
  jodoh.value[aktif.value] = j
  aktif.value = null
  if (Object.keys(jodoh.value).length === props.pasangan.length)
    simpan({ ...jodoh.value }, props.pasangan.every((_, i) => jodoh.value[i] === i))
}
function ulangi() {
  hapus()
  jodoh.value = {}
}
</script>

<template>
  <div class="matsd-soal">
    <div class="matsd-soal-teks">
      <slot><span v-html="teks(soal)" /></slot>
    </div>
    <div class="matsd-jodoh">
      <div>
        <button
          v-for="(p, i) in pasangan" :key="i" :class="{ aktif: aktif === i, salah: hasil && jodoh[i] !== i, benar: hasil && jodoh[i] === i }"
          :style="{ borderColor: warnaKiri(i) }" @click="klikKiri(i)"
        >
          <span v-html="teks(p[0])" />
        </button>
      </div>
      <div>
        <button v-for="k in kanan" :key="k.i" :style="{ borderColor: warnaKanan(k.i) }" @click="klikKanan(k.i)">
          <span v-html="teks(k.teks)" />
        </button>
      </div>
    </div>
    <div v-if="hasil" class="matsd-umpan" :class="hasil.benar ? 'benar' : 'salah'">
      <span>{{ hasil.benar ? '🎉 Semua pasangan benar!' : '🤔 Ada yang belum tepat.' }}</span>
      <button class="matsd-ulang" @click="ulangi">
        Ulangi
      </button>
    </div>
  </div>
</template>
