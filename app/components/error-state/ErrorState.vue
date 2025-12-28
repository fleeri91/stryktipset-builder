<script setup lang="ts">
import { CircleX } from 'lucide-vue-next'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

const props = defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <CircleX />
      </EmptyMedia>
      <EmptyTitle>{{ title }}</EmptyTitle>
      <EmptyDescription>{{ description }}</EmptyDescription>
    </EmptyHeader>
  </Empty>
</template>
