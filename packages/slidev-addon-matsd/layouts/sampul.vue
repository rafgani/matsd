<!--
  Sampul bab. Frontmatter: kelas, fase, bab, elemen.
    ---
    layout: sampul
    kelas: 1
    fase: A
    bab: 1
    elemen: Bilangan
    ---
    # Bilangan sampai 20
-->
<script setup lang="ts">
import { useSlideContext } from '@slidev/client'

const { $frontmatter } = useSlideContext()
</script>

<template>
  <div class="slidev-layout matsd-sampul">
    <div class="matsd-sampul-tag">
      <span v-if="$frontmatter.kelas">Kelas {{ $frontmatter.kelas }}</span>
      <span v-if="$frontmatter.fase">Fase {{ $frontmatter.fase }}</span>
      <span v-if="$frontmatter.elemen">{{ $frontmatter.elemen }}</span>
    </div>
    <div v-if="$frontmatter.bab" class="matsd-sampul-bab">
      Bab {{ $frontmatter.bab }}
    </div>
    <div class="matsd-sampul-isi">
      <slot />
    </div>
  </div>
</template>
