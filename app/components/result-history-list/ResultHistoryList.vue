<script setup lang="ts">
import type { ResultDate } from '~~/shared/types/SvenskaSpel/ResultsHistory'

defineProps<{
  results: ResultDate[]
}>()
</script>

<template>
  <ul class="flex flex-col gap-4">
    <li v-for="result in results" :key="result.drawNumber">
      <slot :result="result" />
    </li>
  </ul>
</template>
