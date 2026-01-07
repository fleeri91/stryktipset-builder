<script setup lang="ts">
import { useMyTeams, useExploreTeams } from '~/pages/team/composables'

const {
  data: myTeams,
  pending: myTeamsPending,
  error: myTeamsError,
} = useMyTeams()

const {
  data: exploreTeams,
  pending: exploreTeamsPending,
  error: exploreTeamsError,
} = useExploreTeams()

const hasMyTeams = computed(() => myTeams.value && myTeams.value.length > 0)
</script>

<template>
  <div class="mx-auto max-w-4xl px-4">
    <div class="mt-12 flex items-center justify-between">
      <h1 class="text-3xl font-bold">Lag</h1>
      <Button variant="outline" asChild>
        <NuxtLink to="/team/create">Skapa</NuxtLink>
      </Button>
    </div>

    <!-- My Teams Section -->
    <section v-if="myTeamsPending || myTeamsError || hasMyTeams" class="mt-8">
      <h2 class="mb-4 text-2xl font-semibold">Mina lag</h2>

      <div v-if="myTeamsPending">
        <TeamLoading :count="2" />
      </div>
      <div v-else-if="myTeamsError" class="text-red-500">
        Kunde inte hämta dina lag.
      </div>
      <TeamGrid
        v-else-if="myTeams"
        :teams="myTeams"
        :loading="myTeamsPending"
      />
    </section>

    <Separator v-if="hasMyTeams" class="my-8" />

    <!-- Explore Teams Section -->
    <section :class="hasMyTeams ? '' : 'mt-8'">
      <h2 class="mb-4 text-2xl font-semibold">Utforska lag</h2>

      <div v-if="exploreTeamsPending">
        <TeamLoading :count="2" />
      </div>
      <div v-else-if="exploreTeamsError" class="text-red-500">
        Kunde inte hämta lag. Försök igen senare.
      </div>
      <TeamGrid
        v-else-if="exploreTeams"
        :teams="exploreTeams"
        :loading="exploreTeamsPending"
        empty-message="Inga fler lag att utforska."
      />
    </section>
  </div>
</template>
