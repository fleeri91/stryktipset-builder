<script setup lang="ts">
import type { EventRoot } from '~~/shared/types/SvenskaSpel/Event'
import type { TeamListItem } from '~~/shared/types/Team'
import { EventType } from '~~/shared/types/SvenskaSpel/EventType'

definePageMeta({
  layout: 'centered',
})

// Check if user has teams
const { data: myTeams } = await useFetch<TeamListItem[]>('/api/user/teams')
const hasTeams = computed(() => myTeams.value && myTeams.value.length > 0)

const { data, pending, error } = await useAsyncData('events', async () => {
  // Only fetch events if user has teams
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

const hasData = computed(
  () =>
    data.value?.stryktipset.draws.length ||
    data.value?.europatipset.draws.length
)
</script>

<template>
  <!-- No team state -->
  <div v-if="!hasTeams" class="flex min-h-[60vh] items-center justify-center">
    <Card class="max-w-md">
      <CardHeader>
        <CardTitle>Gå med i ett lag</CardTitle>
        <CardDescription>
          Du behöver vara med i ett lag för att kunna se och delta i evenemang.
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-3">
        <Button asChild class="w-full">
          <NuxtLink to="/team/create">Skapa nytt lag</NuxtLink>
        </Button>
        <Button asChild variant="outline" class="w-full">
          <NuxtLink to="/team">Utforska lag</NuxtLink>
        </Button>
      </CardContent>
    </Card>
  </div>

  <!-- Loading -->
  <div v-else-if="pending">Loading…</div>

  <!-- Error -->
  <div v-else-if="error">Something went wrong</div>

  <!-- Empty state -->
  <div v-else-if="!hasData">
    <EmptyState
      title="Här var det tomt"
      description="Kunde inte hitta omgångar"
    />
  </div>

  <!-- Events -->
  <div v-else>
    <div class="grid-cols-auto grid space-x-4">
      <EventList v-if="data" :event="data.stryktipset" title="Stryktipset" />
      <EventList v-if="data" :event="data.europatipset" title="Europatipset" />
    </div>
  </div>
</template>
