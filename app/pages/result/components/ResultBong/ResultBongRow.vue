<script setup lang="ts">
import type { Event } from '~~/shared/types/SvenskaSpel/Result'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const props = defineProps<{
  event: Event
}>()
</script>

<template>
  <li class="flex items-center justify-between">
    <!-- Event info -->
    <div>
      <h3 class="font-semibold">{{ props.event.eventDescription }}</h3>
      <p class="text-sm text-gray-500">{{ props.event.eventComment }}</p>
    </div>

    <!-- Outcome -->
    <ToggleGroup size="sm" type="single" class="ml-4 flex gap-1">
      <ToggleGroupItem
        value="1"
        :disabled="true"
        :class="
          props.event.outcome === '1'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-700'
        "
      >
        1
      </ToggleGroupItem>

      <ToggleGroupItem
        value="X"
        :disabled="true"
        :class="
          props.event.outcome === 'X'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-700'
        "
      >
        X
      </ToggleGroupItem>

      <ToggleGroupItem
        value="2"
        :disabled="true"
        :class="
          props.event.outcome === '2'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-700'
        "
      >
        2
      </ToggleGroupItem>
    </ToggleGroup>
  </li>
</template>
