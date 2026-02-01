<script setup lang="ts">
import type { EventRoot } from '~~/shared/types/SvenskaSpel/Event'
import { EventType } from '~~/shared/types/SvenskaSpel/EventType'
import type { TeamListItem } from '~~/shared/types/team'

definePageMeta({
  layout: 'centered',
})

const { data: myTeams } =
  await useDelayedFetch<TeamListItem[]>('/api/user/teams')
const hasTeams = computed(() => myTeams.value && myTeams.value.length > 0)

const { data, pending, error } = await useAsyncData('events', async () => {
  if (!hasTeams.value) {
    return null
  }

  const [stryktipset, europatipset] = await Promise.all([
    $fetch<EventRoot>('/api/event', {
      query: { type: EventType.Stryktipset },
    }),
    $fetch<EventRoot>('/api/event', {
      query: { type: EventType.Europatipset },
    }),
  ])

  return {
    stryktipset,
    europatipset,
  }
})

const hasData = computed(() =>
  Boolean(
    data.value?.stryktipset?.draws?.length ||
    data.value?.europatipset?.draws?.length
  )
)
</script>

<template>
  <!-- No team state -->
  <NoTeam v-if="!hasTeams" />

  <!-- Loading -->
  <div v-else-if="pending">Loading…</div>

  <!-- Error -->
  <div v-else-if="error">Something went wrong</div>

  <!-- Empty state -->
  <EmptyState
    v-else-if="!hasData"
    title="Här var det tomt"
    description="Kunde inte hitta omgångar"
  />

  <!-- Events -->
  <EventGrid
    v-else-if="data"
    :stryktipset="data.stryktipset"
    :europatipset="data.europatipset"
  />
</template>
