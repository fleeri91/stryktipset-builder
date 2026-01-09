<script setup lang="ts">
import type { EventRoot } from '~~/shared/types/SvenskaSpel/Event'

interface Props {
  stryktipset?: EventRoot
  europatipset?: EventRoot
}

defineProps<Props>()
</script>

<template>
  <div
    class="mx-auto grid w-full max-w-lg space-y-4 lg:flex lg:w-auto lg:max-w-none lg:space-y-0 lg:space-x-4"
  >
    <EventList v-if="stryktipset" :event="stryktipset" title="Stryktipset" />
    <EventList v-if="europatipset" :event="europatipset" title="Europatipset" />
  </div>
</template>
