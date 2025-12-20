<script setup lang="ts">
import { reactive, computed } from 'vue'

import { Event } from '@/components/event'

import type { Outcome, ConfidenceLevel } from '@/components/event'
import type { EventRoot } from '~~/server/types/SvenskaSpel/Event'

const { data, pending, error } = await useFetch<EventRoot>('/api/event')

const events = computed(() => data.value?.draws?.[0]?.events ?? [])
const eventDate = computed(
  () => data.value?.draws?.[0]?.closeTime ?? new Date()
)

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
  <div class="mt-24 flex justify-center">
    <div v-if="pending">Loading events...</div>
    <div v-else-if="error">Error loading events: {{ error.message }}</div>
    <div class="bg-card w-full max-w-2xl rounded-2xl p-8" v-else>
      <div class="mb-8 flex justify-center">
        <h1 class="text-2xl font-bold">
          <span>Stryktipset </span>
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
