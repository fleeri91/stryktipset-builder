<script setup lang="ts">
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'

type ConfidenceLevel = 'UNSURE' | 'NEUTRAL' | 'SAFE'

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
      return 'bg-green-600'
    case 'UNSURE':
      return 'bg-red-600'
    case 'NEUTRAL':
      return 'bg-gray-400'
    default:
      return 'bg-gray-400'
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
    class="h-6 w-6 rounded-full transition-all hover:scale-[1.1]"
    :class="colorClass"
    @click="toggle"
  />
</template>
