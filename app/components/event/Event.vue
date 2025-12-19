<script setup lang="ts">
import { ref } from 'vue'
import EventRow from '@/components/event/EventRow.vue'
import type { Event } from '~~/server/types/SvenskaSpel/Event'

type Outcome = '1' | 'X' | '2'
type ConfidenceLevel = 'UNSURE' | 'NEUTRAL' | 'SAFE'

const props = defineProps<{
  event: Event
}>()

const emit = defineEmits<{
  (e: 'update:selections', eventNumber: number, value: Outcome[]): void
  (e: 'update:confidence', eventNumber: number, value: ConfidenceLevel): void
}>()

const selections = ref<Outcome[]>([])
const confidence = ref<ConfidenceLevel>('NEUTRAL')

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
    @update:model-value="updateSelections"
    :confidence="confidence"
    @update:confidence="updateConfidence"
  />
</template>
