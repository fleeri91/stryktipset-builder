<script setup lang="ts">
import type { EventRoot } from '~~/shared/types/SvenskaSpel/Event'
import { EventType } from '~~/shared/types/SvenskaSpel/EventType'
import EventList from '~/components/event-list/EventList.vue'

definePageMeta({
  middleware: 'auth',
  layout: 'centered',
})

const { data, pending, error } = await useAsyncData('events', async () => {
  const [stryktipset, europatipset] = await Promise.all([
    $fetch<EventRoot>('/api/event', {
      query: { type: EventType.Stryktipset },
    }),
    $fetch<EventRoot>('/api/event', {
      query: { type: EventType.Europatipset },
    }),
  ])

  return {
    stryktipset,
    europatipset,
  }
})
</script>

<template>
  <div v-if="pending">Loading…</div>
  <div v-else-if="error">Something went wrong</div>

  <div v-else>
    <div class="grid grid-cols-2 space-x-4">
      <EventList v-if="data" :event="data.stryktipset" title="Stryktipset" />
      <EventList v-if="data" :event="data.europatipset" title="Europatipset" />
    </div>
  </div>
</template>
