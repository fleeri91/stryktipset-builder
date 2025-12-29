<script setup lang="ts">
interface Props {
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Profil',
})
</script>

<template>
  <div class="mt-12 flex items-center justify-between">
    <h1 class="text-3xl font-bold">{{ title }}</h1>
  </div>
</template>
