<script setup lang="ts">
import { computed } from 'vue'
import type { ConfidenceLevel } from '~/features/event/types'

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
  emit('update:modelValue', nextValue)
}
</script>

<template>
  <button
    class="min-h-6 min-w-6 transform-gpu rounded-full transition-transform duration-200 ease-out hover:scale-115"
    :class="colorClass"
    @click="toggle"
  />
</template>
