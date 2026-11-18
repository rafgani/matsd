<!-- Gambar dari folder public/ deck, aman untuk base path situs. <GambarSoal src="dadu.svg" :lebar="240" /> -->
<script setup lang="ts">
const props = withDefaults(defineProps<{ src: string, lebar?: number }>(), { lebar: undefined })
const url = `${import.meta.env.BASE_URL}${props.src.replace(/^\//, '')}`
</script>

<template>
  <img :src="url" class="matsd-gambar" :style="lebar ? { width: `${lebar}px` } : {}" alt="">
</template>
