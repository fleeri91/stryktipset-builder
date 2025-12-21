<script setup lang="ts">
import { TriangleAlert } from 'lucide-vue-next'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
</script>

<template>
  <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <TriangleAlert />
      </EmptyMedia>
      <EmptyTitle>Här var det tomt!</EmptyTitle>
      <EmptyDescription>Kunde inte hitta Stryktipsomgång</EmptyDescription>
    </EmptyHeader>
  </Empty>
</template>
