<script setup lang="ts">
import type { EventRoot } from '~~/shared/types/SvenskaSpel/Event'

interface Props {
  stryktipset?: EventRoot
  europatipset?: EventRoot
}

defineProps<Props>()
</script>

<template>
  <div class="flex space-x-4">
    <EventList v-if="stryktipset" :event="stryktipset" title="Stryktipset" />
    <EventList v-if="europatipset" :event="europatipset" title="Europatipset" />
  </div>
</template>
