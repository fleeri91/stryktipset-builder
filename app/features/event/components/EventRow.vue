<script setup lang="ts">
import { computed } from 'vue'
import type { AcceptableValue } from 'reka-ui'
import type { Event } from '~~/shared/types/SvenskaSpel/Event'
import type { Outcome, ConfidenceLevel } from '~/features/event/types'
import EventConfidence from './EventConfidence.vue'

const props = withDefaults(
  defineProps<{
    modelValue: Outcome[]
    confidence?: ConfidenceLevel
    event: Event
  }>(),
  {
    confidence: 'NEUTRAL',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: Outcome[]): void
  (e: 'update:confidence', value: ConfidenceLevel): void
}>()

const home = computed(
  () => props.event.participants.find((p) => p.type === 'home')?.name
)
const away = computed(
  () => props.event.participants.find((p) => p.type === 'away')?.name
)

function onUpdate(payload: AcceptableValue | AcceptableValue[]) {
  const values = Array.isArray(payload)
    ? payload
    : payload != null
      ? [payload]
      : []

  emit('update:modelValue', values as Outcome[])
}

function onConfidenceUpdate(value: ConfidenceLevel) {
  emit('update:confidence', value)
}
</script>

<template>
  <div class="flex flex-col gap-2 border-b py-3">
    <div class="flex items-center gap-4">
      <div class="flex w-full items-center gap-2 text-sm font-bold">
        <Badge class="h-8 w-8 font-extrabold">
          {{ event.eventNumber }}
        </Badge>
        <span>{{ home }} – {{ away }}</span>
      </div>

      <ToggleGroup
        type="multiple"
        variant="outline"
        :model-value="modelValue"
        @update:model-value="onUpdate"
        class="flex"
      >
        <ToggleGroupItem value="1" aria-label="Hemmavinst">1</ToggleGroupItem>
        <ToggleGroupItem value="X" aria-label="Oavgjort">X</ToggleGroupItem>
        <ToggleGroupItem value="2" aria-label="Bortavinst">2</ToggleGroupItem>
      </ToggleGroup>
      <EventConfidence
        :model-value="confidence"
        @update:model-value="onConfidenceUpdate"
      />
    </div>
  </div>
</template>
