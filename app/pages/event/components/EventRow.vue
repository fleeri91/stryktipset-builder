<script setup lang="ts">
import type { AcceptableValue } from 'reka-ui'
import { computed } from 'vue'

import type { Outcome, ConfidenceLevel } from '~/pages/event/types'
import type { Event } from '~~/shared/types/SvenskaSpel/Event'

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
  <div class="flex flex-col">
    <div class="flex items-center gap-2 sm:gap-4">
      <div class="flex w-full items-center gap-2 text-xs font-bold sm:text-sm">
        <Badge class="h-6 w-6 font-extrabold sm:h-8 sm:w-8">
          {{ event.eventNumber }}
        </Badge>
        <span>{{ home }} – {{ away }}</span>
      </div>

      <ToggleGroup
        type="multiple"
        variant="outline"
        :model-value="modelValue"
        class="flex"
        size="sm"
        @update:model-value="onUpdate"
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
