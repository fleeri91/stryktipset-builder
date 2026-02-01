<script setup lang="ts">
import { ref, watch } from 'vue'

import type { Outcome, ConfidenceLevel } from '~/pages/event/types'
import type { Event } from '~~/shared/types/SvenskaSpel/Event'

const props = defineProps<{
  event: Event
  initialSelections?: Outcome[]
  initialConfidence?: ConfidenceLevel
}>()

const emit = defineEmits<{
  (e: 'update:selections', eventNumber: number, value: Outcome[]): void
  (e: 'update:confidence', eventNumber: number, value: ConfidenceLevel): void
}>()

// Initialize with props or defaults
const selections = ref<Outcome[]>(props.initialSelections || [])
const confidence = ref<ConfidenceLevel>(props.initialConfidence || 'NEUTRAL')

// Watch for changes to initial values (when bong data loads)
watch(
  () => props.initialSelections,
  (newVal) => {
    if (newVal && newVal.length > 0) {
      selections.value = newVal
    }
  }
)

watch(
  () => props.initialConfidence,
  (newVal) => {
    if (newVal) {
      confidence.value = newVal
    }
  }
)

function updateSelections(value: Outcome[]) {
  selections.value = value
  emit('update:selections', props.event.eventNumber, value)
}

function updateConfidence(value: ConfidenceLevel) {
  confidence.value = value
  emit('update:confidence', props.event.eventNumber, value)
}
</script>

<template>
  <EventRow
    :event="event"
    :model-value="selections"
    :confidence="confidence"
    @update:model-value="updateSelections"
    @update:confidence="updateConfidence"
  />
</template>
