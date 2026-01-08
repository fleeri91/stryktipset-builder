<script setup lang="ts">
definePageMeta({
  layout: 'centered',
})

import {
  useEventDraw,
  useEventBong,
  useEventBongSubmit,
} from '~/pages/event/composables'

const route = useRoute()
const drawNumber = route.params.eventId as string

const { pending, error, eventType, draw, events, hasDraws, eventDate } =
  useEventDraw(drawNumber)

const {
  selections,
  confidenceLevels,
  existingBongId,
  isEditing,
  handleSelectionsUpdate,
  handleConfidenceUpdate,
} = useEventBong(drawNumber)

const { isSubmitting, isValidBong, submitBong } = useEventBongSubmit(
  drawNumber,
  draw,
  events,
  selections,
  confidenceLevels,
  existingBongId
)
</script>

<template>
  <div v-if="pending">Loading event...</div>
  <div v-else-if="error">Error loading event: {{ error.message }}</div>
  <EmptyState
    v-else-if="!hasDraws"
    title="Här var det tomt"
    description="Kunde inte hitta omgång"
  />
  <EventBongForm
    v-else
    :events="events"
    :event-type="eventType"
    :event-date="eventDate"
    :selections="selections"
    :confidence-levels="confidenceLevels"
    :is-valid-bong="isValidBong"
    :is-submitting="isSubmitting"
    :is-editing="isEditing"
    @update:selections="handleSelectionsUpdate"
    @update:confidence="handleConfidenceUpdate"
    @submit="submitBong"
  />
</template>
