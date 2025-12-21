<script setup lang="ts">
import { computed } from 'vue'

import { Badge } from '@/components/ui/badge'

import type { ConfidenceLevel } from '@/components/event'

const props = withDefaults(
  defineProps<{
    modelValue?: ConfidenceLevel
  }>(),
  {
    modelValue: 'NEUTRAL',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: ConfidenceLevel): void
}>()

const nextMap: Record<ConfidenceLevel, ConfidenceLevel> = {
  UNSURE: 'NEUTRAL',
  NEUTRAL: 'SAFE',
  SAFE: 'UNSURE',
}

const colorClass = computed(() => {
  switch (props.modelValue) {
    case 'SAFE':
      return 'bg-green-600/50 dark:bg-green-400/80'
    case 'UNSURE':
      return 'bg-red-600/50 dark:bg-rose-400/80'
    case 'NEUTRAL':
      return 'bg-neutral-400/50 dark:bg-neutral-500/90'
    default:
      return 'bg-neutral-400/50'
  }
})

function toggle() {
  const nextValue = nextMap[props.modelValue]
  console.log('Toggling from:', props.modelValue, 'to:', nextValue)
  emit('update:modelValue', nextValue)
}
</script>

<template>
  <Badge
    type="button"
    class="h-6 w-6 cursor-pointer rounded-full transition-all hover:scale-[1.1]"
    :class="colorClass"
    @click="toggle"
  />
</template>
