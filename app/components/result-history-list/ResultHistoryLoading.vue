<script setup lang="ts">
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

defineProps<{
  count?: number
}>()
</script>

<template>
  <li class="flex list-none flex-col gap-2">
    <Card
      v-for="i in count ?? 5"
      :key="i"
      class="flex h-16 w-full flex-col items-center justify-center gap-2 sm:flex-row sm:justify-between"
    >
      <Skeleton class="h-16 w-full" />
    </Card>
  </li>
</template>
