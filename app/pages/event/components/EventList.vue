<script setup lang="ts">
import type { EventRoot } from '~~/shared/types/SvenskaSpel/Event'

defineProps<{
  event: EventRoot
  title: string
}>()
</script>

<template>
  <section>
    <ul class="flex flex-col gap-4">
      <li v-for="draw in event.draws" :key="draw.drawNumber">
        <NuxtLink
          :to="`/event/${draw.productName.toLocaleLowerCase()}/${draw.drawNumber}`"
        >
          <Card
            class="hover:bg-card/80 flex h-32 w-full flex-col items-center justify-center gap-2 p-4 transition-colors lg:h-48 lg:w-96"
          >
            <h2 class="font-bold sm:text-lg">
              {{ draw.productName ?? 'Event draw' }}
            </h2>
            <p class="text-sm text-gray-400 sm:text-base">
              <NuxtTime
                :datetime="draw.closeTime"
                year="numeric"
                month="long"
                day="numeric"
                hour="2-digit"
                minute="2-digit"
                locale="sv-SE"
              />
            </p>
          </Card>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>
