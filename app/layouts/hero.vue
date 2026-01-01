<script setup lang="ts">
const route = useRoute()

const heroImage = computed(() => route.meta.heroImage as string)
const heroAlt = computed(() => route.meta.heroAlt as string)
const center = computed(() => route.meta.center as boolean)
</script>

<template>
  <div class="w-full">
    <header v-if="heroImage">
      <HeroImage :src="heroImage" :alt="heroAlt || 'Hero image'" />
    </header>

    <div v-if="center" class="flex h-full items-center justify-center">
      <slot />
    </div>
    <div v-else>
      <slot />
    </div>
  </div>
</template>
