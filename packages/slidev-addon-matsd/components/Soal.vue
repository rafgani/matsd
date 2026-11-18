<!--
  Satu soal dari paket.yaml (dipakai deck hasil generator `scripts/paket.mjs`).
    <Soal v-bind="P.soal[0]" :nomor="1" />
  Memilih widget menurut `tipe`: pg | pgk | bs | isian | jodoh | uraian.
-->
<script setup lang="ts">
import { computed } from 'vue'
import { teks } from '../lib/teks'
import PilihanGanda from './PilihanGanda.vue'
import PilihanGandaKompleks from './PilihanGandaKompleks.vue'
import TabelBenarSalah from './TabelBenarSalah.vue'
import IsianSingkat from './IsianSingkat.vue'
import Menjodohkan from './Menjodohkan.vue'
import Uraian from './Uraian.vue'

const props = defineProps<{
  id: string
  nomor?: number
  tipe: 'pg' | 'pgk' | 'bs' | 'isian' | 'jodoh' | 'uraian'
  soal: string
  gambar?: string
  pilihan?: string[]
  pernyataan?: string[]
  pasangan?: [string, string][]
  jawaban?: any
  satuan?: string
  pembahasan?: string
  level?: string
  topik?: string
  sumber?: string
  skor?: number
}>()

const base = import.meta.env.BASE_URL
const src = computed(() => props.gambar ? `${base}${props.gambar.replace(/^\//, '')}` : '')
</script>

<template>
  <div class="matsd-soal-wrap">
    <div class="matsd-soal-meta">
      <span v-if="nomor" class="matsd-nomor">Soal {{ nomor }}</span>
      <span v-if="level" class="matsd-meta">{{ level }}</span>
      <span v-if="topik" class="matsd-meta">{{ topik }}</span>
    </div>
    <div class="matsd-soal-stem">
      <span v-html="teks(soal)" />
    </div>
    <img v-if="gambar" :src="src" class="matsd-gambar" alt="">
    <PilihanGanda v-if="tipe === 'pg'" :id="id" :pilihan="pilihan!" :jawaban="jawaban" :pembahasan="pembahasan">
      <span />
    </PilihanGanda>
    <PilihanGandaKompleks v-else-if="tipe === 'pgk'" :id="id" :pilihan="pilihan!" :jawaban="jawaban" :pembahasan="pembahasan">
      <span />
    </PilihanGandaKompleks>
    <TabelBenarSalah v-else-if="tipe === 'bs'" :id="id" :pernyataan="pernyataan!" :jawaban="jawaban" :pembahasan="pembahasan">
      <span />
    </TabelBenarSalah>
    <IsianSingkat v-else-if="tipe === 'isian'" :id="id" :jawaban="jawaban" :satuan="satuan" :pembahasan="pembahasan">
      <span />
    </IsianSingkat>
    <Menjodohkan v-else-if="tipe === 'jodoh'" :id="id" :pasangan="pasangan!">
      <span />
    </Menjodohkan>
    <Uraian v-else :pembahasan="pembahasan">
      <span />
    </Uraian>
    <div v-if="sumber" class="matsd-sumber">
      Sumber: {{ sumber }}
    </div>
  </div>
</template>
