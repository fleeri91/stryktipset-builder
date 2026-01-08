<script setup lang="ts">
interface Props {
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Profil',
})
</script>

<template>
  <h1 class="mb-4 text-3xl font-bold">{{ title }}</h1>
</template>
