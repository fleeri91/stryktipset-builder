<script setup lang="ts">
defineProps<{
  count?: number
}>()
</script>

<template>
  <li class="grid gap-4 md:grid-cols-2">
    <Card v-for="i in count ?? 5" :key="i" class="flex min-h-34 w-full p-0">
      <Skeleton class="h-full w-full" />
    </Card>
  </li>
</template>
