<script setup lang="ts">
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Badge } from '@/components/ui/badge'
import { EventConfidence } from '@/components/event'
import type { AcceptableValue } from 'reka-ui'
import { computed } from 'vue'
import type { Event } from '~~/server/types/SvenskaSpel/Event'

type Outcome = '1' | 'X' | '2'
type ConfidenceLevel = 'UNSURE' | 'NEUTRAL' | 'SAFE'

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

// normalize payload from ToggleGroup and emit typed Outcome[]
function onUpdate(payload: AcceptableValue | AcceptableValue[]) {
  const values = Array.isArray(payload)
    ? payload
    : payload != null
      ? [payload]
      : []

  emit('update:modelValue', values as Outcome[])
}

// Handle confidence update
function onConfidenceUpdate(value: ConfidenceLevel) {
  console.log(
    'EventRow: Updating confidence from',
    props.confidence,
    'to',
    value
  )
  emit('update:confidence', value)
}
</script>

<template>
  <div class="flex flex-col gap-2 border-b py-3">
    <!-- Matchrad -->
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
        <ToggleGroupItem value="1">1</ToggleGroupItem>
        <ToggleGroupItem value="X">X</ToggleGroupItem>
        <ToggleGroupItem value="2">2</ToggleGroupItem>
      </ToggleGroup>
      <EventConfidence
        :model-value="confidence"
        @update:model-value="onConfidenceUpdate"
      />
    </div>
  </div>
</template>
