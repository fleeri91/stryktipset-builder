<script setup lang="ts">
import type { ResultDate } from '~~/shared/types/SvenskaSpel/ResultsHistory'
import { Card } from '@/components/ui/card'

defineProps<{
  result: ResultDate
}>()
</script>

<template>
  <li>
    <NuxtLink
      :to="`/result/${result.product.toLowerCase()}/${result.drawNumber}`"
    >
      <Card
        class="hover:bg-card/80 flex h-16 w-full flex-col items-center justify-center gap-1 p-8 transition-colors sm:flex-row sm:justify-between sm:gap-2"
      >
        <h2 class="font-bold capitalize sm:text-lg">
          {{ result.product ?? 'Event draw' }}
        </h2>
        <p class="text-sm sm:text-base">
          <NuxtTime
            :datetime="result.closeDate"
            year="numeric"
            month="long"
            day="numeric"
            hour="2-digit"
            minute="2-digit"
            locale="sv-SE"
          />
        </p>
      </Card>
    </NuxtLink>
  </li>
</template>
