<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

import { reactive, computed } from 'vue'

import { Event, EventEmpty } from '@/components/event'

import type { Outcome, ConfidenceLevel } from '@/components/event'
import type { Draw } from '~~/server/types/SvenskaSpel/Event'

const route = useRoute()
const drawNumber = route.params.eventId as string

// Fetch a single draw by drawNumber
const { data, pending, error } = await useAsyncData(`event-${drawNumber}`, () =>
  $fetch<{ draw: Draw; eventType: string }>(`/api/event/${drawNumber}`)
)

// Extract draw and events
const eventType = computed(() => data.value?.draw.productName)
const draw = computed(() => data.value?.draw)
const events = computed(() => draw.value?.events ?? [])
const hasDraws = computed(() => !!draw.value)
const eventDate = computed(() => draw.value?.closeTime ?? new Date())

// Track user selections and confidence levels
const selections = reactive<Record<number, Outcome[]>>({})
const confidenceLevels = reactive<Record<number, ConfidenceLevel>>({})

function handleSelectionsUpdate(eventNumber: number, value: Outcome[]) {
  selections[eventNumber] = value
}

function handleConfidenceUpdate(eventNumber: number, value: ConfidenceLevel) {
  confidenceLevels[eventNumber] = value
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <div v-if="pending">Loading event...</div>
    <div v-else-if="error">Error loading event: {{ error.message }}</div>
    <div v-else-if="!hasDraws">
      <EventEmpty />
    </div>
    <div class="bg-card w-full max-w-2xl rounded-2xl p-8" v-else>
      <div class="mb-8 flex justify-center">
        <h1 class="inline-flex gap-2 text-2xl font-bold">
          <span>{{ eventType ?? 'Event' }}</span>
          <NuxtTime
            :datetime="eventDate"
            year="numeric"
            month="long"
            day="numeric"
            hour="2-digit"
            minute="2-digit"
            locale="sv-SE"
          />
        </h1>
      </div>

      <Event
        v-for="event in events"
        :key="event.eventNumber"
        :event="event"
        @update:selections="handleSelectionsUpdate"
        @update:confidence="handleConfidenceUpdate"
      />
    </div>
  </div>
</template>
