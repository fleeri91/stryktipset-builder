<script setup lang="ts">
import EventItem from './EventItem.vue'
import type { Event } from '~~/shared/types/SvenskaSpel/Event'
import type { Outcome, ConfidenceLevel } from '~/features/event/types'

interface Props {
  events: Event[]
  eventType?: string
  eventDate: Date | string
  selections: Record<number, Outcome[]>
  confidenceLevels: Record<number, ConfidenceLevel>
  isValidBong: boolean
  isSubmitting: boolean
  isEditing: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:selections', eventNumber: number, value: Outcome[]): void
  (e: 'update:confidence', eventNumber: number, value: ConfidenceLevel): void
  (e: 'submit'): void
}>()

// Helper functions to properly emit the events
function handleSelectionsUpdate(eventNumber: number, value: Outcome[]) {
  emit('update:selections', eventNumber, value)
}

function handleConfidenceUpdate(eventNumber: number, value: ConfidenceLevel) {
  emit('update:confidence', eventNumber, value)
}
</script>

<template>
  <div class="bg-card w-full max-w-2xl rounded-2xl p-8">
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

    <EventItem
      v-for="event in events"
      :key="event.eventNumber"
      :event="event"
      :initial-selections="selections[event.eventNumber]"
      :initial-confidence="confidenceLevels[event.eventNumber]"
      @update:selections="handleSelectionsUpdate"
      @update:confidence="handleConfidenceUpdate"
    />

    <!-- Submit button -->
    <div class="mt-8 flex justify-center">
      <Button
        @click="emit('submit')"
        :disabled="!isValidBong || isSubmitting"
        class="w-full max-w-md"
        size="lg"
      >
        {{
          isSubmitting
            ? isEditing
              ? 'Uppdaterar...'
              : 'Sparar...'
            : isEditing
              ? 'Uppdatera'
              : 'Spara'
        }}
      </Button>
    </div>

    <p
      v-if="!isValidBong"
      class="text-muted-foreground mt-2 text-center text-sm"
    >
      Välj minst ett alternativ för alla matcher
    </p>
  </div>
</template>
