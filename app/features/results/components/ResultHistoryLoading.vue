<script setup lang="ts">
defineProps<{
  count?: number
}>()
</script>

<template>
  <li class="flex list-none flex-col gap-4">
    <Card v-for="i in count ?? 5" :key="i" class="flex h-16 w-full p-0">
      <Skeleton class="h-full w-full" />
    </Card>
  </li>
</template>
