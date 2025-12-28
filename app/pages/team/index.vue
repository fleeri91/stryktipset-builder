<script setup lang="ts">
import type { TeamListItem } from '~~/shared/types/Team'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

// Fetch user's teams
const {
  data: myTeams,
  pending: myTeamsPending,
  error: myTeamsError,
} = await useFetch<TeamListItem[]>('/api/user/teams')

// Fetch all teams
const {
  data: allTeams,
  pending: allTeamsPending,
  error: allTeamsError,
} = await useFetch<TeamListItem[]>('/api/team')

const hasMyTeams = computed(() => myTeams.value && myTeams.value.length > 0)

// Filter out teams the user is already a member of
const exploreTeams = computed(() => {
  if (!allTeams.value || !myTeams.value) return allTeams.value || []

  const myTeamIds = new Set(myTeams.value.map((team) => team._id))
  return allTeams.value.filter((team) => !myTeamIds.has(team._id))
})
</script>

<template>
  <div class="mx-auto max-w-4xl px-4">
    <div class="mt-12 flex items-center justify-between">
      <h1 class="text-3xl font-bold">Lag</h1>

      <Button variant="outline" asChild>
        <NuxtLink to="/team/create">Skapa</NuxtLink>
      </Button>
    </div>

    <!-- My Teams Section - only show if user has teams -->
    <section v-if="myTeamsPending || myTeamsError || hasMyTeams" class="mt-8">
      <h2 class="mb-4 text-2xl font-semibold">Mina lag</h2>

      <!-- Loading -->
      <div v-if="myTeamsPending" class="text-center">Laddar dina lag...</div>

      <!-- Error -->
      <div v-else-if="myTeamsError" class="text-red-500">
        Kunde inte hämta dina lag.
      </div>

      <!-- My Teams Grid -->
      <div v-else-if="hasMyTeams" class="grid gap-4 md:grid-cols-2">
        <Card
          v-for="team in myTeams"
          :key="team._id"
          class="hover:border-primary cursor-pointer transition-colors"
          @click="navigateTo(`/team/${team._id}`)"
        >
          <CardHeader>
            <CardTitle>{{ team.name }}</CardTitle>
            <CardDescription> Ägare: {{ team.owner.name }} </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              class="text-muted-foreground flex items-center justify-between text-sm"
            >
              <span
                >{{ team.memberCount }} medlem{{
                  team.memberCount !== 1 ? 'mar' : ''
                }}</span
              >
              <span>{{
                new Date(team.createdAt).toLocaleDateString('sv-SE')
              }}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>

    <!-- Separator - only show if there are my teams -->
    <Separator v-if="hasMyTeams" class="my-8" />

    <!-- All Teams Section -->
    <section :class="hasMyTeams ? '' : 'mt-8'">
      <h2 class="mb-4 text-2xl font-semibold">Upptäck lag</h2>

      <!-- Loading -->
      <div v-if="allTeamsPending" class="text-center">Laddar lag...</div>

      <!-- Error -->
      <div v-else-if="allTeamsError" class="text-red-500">
        Kunde inte hämta lag. Försök igen senare.
      </div>

      <!-- Teams Grid - use exploreTeams instead of allTeams -->
      <div
        v-else-if="exploreTeams && exploreTeams.length > 0"
        class="grid gap-4 md:grid-cols-2"
      >
        <Card
          v-for="team in exploreTeams"
          :key="team._id"
          class="hover:border-primary cursor-pointer transition-colors"
          @click="navigateTo(`/team/${team._id}`)"
        >
          <CardHeader>
            <CardTitle>{{ team.name }}</CardTitle>
            <CardDescription> Ägare: {{ team.owner.name }} </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              class="text-muted-foreground flex items-center justify-between text-sm"
            >
              <span
                >{{ team.memberCount }} medlem{{
                  team.memberCount !== 1 ? 'mar' : ''
                }}</span
              >
              <span>{{
                new Date(team.createdAt).toLocaleDateString('sv-SE')
              }}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Empty State -->
      <div v-else class="text-muted-foreground text-center">
        <p>Inga fler lag att utforska.</p>
      </div>
    </section>
  </div>
</template>
