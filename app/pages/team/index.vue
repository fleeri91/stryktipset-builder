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
  <div>
    <div class="flex justify-between">
      <PageHeader title="Lag" />
      <Button variant="outline" as-child>
        <NuxtLink to="/team/create">Skapa</NuxtLink>
      </Button>
    </div>

    <!-- My Teams Section -->
    <PageSection v-if="myTeamsPending || myTeamsError || hasMyTeams">
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
    </PageSection>

    <!-- Explore Teams Section -->
    <PageSection>
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
    </PageSection>
  </div>
</template>
