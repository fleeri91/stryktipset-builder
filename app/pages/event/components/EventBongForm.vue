<script setup lang="ts">
import type { Outcome, ConfidenceLevel } from '~/pages/event/types'
import type { Event } from '~~/shared/types/SvenskaSpel/Event'

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

function handleSelectionsUpdate(eventNumber: number, value: Outcome[]) {
  emit('update:selections', eventNumber, value)
}

function handleConfidenceUpdate(eventNumber: number, value: ConfidenceLevel) {
  emit('update:confidence', eventNumber, value)
}
</script>

<template>
  <div
    class="sm:bg-card text-card-foreground flex w-full max-w-2xl flex-col gap-6 p-4 shadow-sm sm:rounded-xl sm:border sm:p-8"
  >
    <div class="mb-2 flex justify-center">
      <h1
        class="inline-flex flex-col gap-2 text-center text-lg font-bold sm:flex-row sm:text-2xl"
      >
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
    <div class="mt-4 flex justify-center">
      <Button
        :disabled="!isValidBong || isSubmitting"
        class="w-full"
        size="lg"
        @click="emit('submit')"
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
  </div>
</template>
