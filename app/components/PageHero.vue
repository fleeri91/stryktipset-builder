<script setup lang="ts">
interface Props {
  src: string
  alt?: string
  height?: string
  overlay?: boolean
  overlayOpacity?: number
}

withDefaults(defineProps<Props>(), {
  alt: '',
  overlay: true,
  overlayOpacity: 0.4,
  height: undefined,
})
</script>

<template>
  <figure class="relative min-h-90 w-full overflow-hidden">
    <!-- Background image -->
    <NuxtImg
      :src="src"
      :alt="alt"
      class="absolute inset-0 h-full w-full object-cover"
      sizes="100vw sm:50vw md:400px"
      preload
    />

    <!-- Overlay -->
    <div
      v-if="overlay"
      class="absolute inset-0 bg-black"
      :style="{ opacity: overlayOpacity }"
    />
  </figure>
</template>
