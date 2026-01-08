<script setup lang="ts">
import type { Event } from '~~/shared/types/SvenskaSpel/Result'

const props = defineProps<{
  events: Event[]
  pending?: boolean
  error?: unknown
}>()
</script>

<template>
  <div v-if="pending" class="py-8 text-center">Loading results...</div>

  <div v-else-if="error" class="py-8 text-center text-red-500">
    Something went wrong.
  </div>

  <ul
    v-else-if="events.length"
    class="sm:bg-card text-card-foreground mx-auto max-w-2xl gap-6 space-y-4 p-4 shadow-sm select-none sm:rounded-xl sm:border sm:p-8"
  >
    <ResultBongRow
      v-for="event in events"
      :key="event.eventNumber"
      :event="event"
    />
  </ul>

  <div v-else class="py-8 text-center text-gray-500">
    No finalized results found.
  </div>
</template>
