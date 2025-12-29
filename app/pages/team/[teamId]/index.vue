<script setup lang="ts">
import type { TeamRoot, Member } from '~~/shared/types/Team'
import { TeamJoinButton, TeamJoinRequest } from '~/features/team'
import { computed } from 'vue'

const route = useRoute()
const teamId = route.params.teamId as string

const {
  data: team,
  error,
  pending,
} = await useFetch<TeamRoot>(`/api/team/${teamId}`)

const errorMessage = computed(
  () => (error.value as { message?: string })?.message || 'Okänt fel'
)

const membersWithFormattedDate = computed(() => {
  return (
    team.value?.members?.map((member: Member) => ({
      ...member,
      joinedAtFormatted: new Date(member.joinedAt).toLocaleDateString('sv-SE'),
    })) || []
  )
})
</script>

<template>
  <div class="mx-auto mt-12 max-w-2xl">
    <div v-if="pending">Laddar…</div>

    <div v-else-if="error">
      <ErrorState title="Kunde inte hämta laget" :description="errorMessage" />
    </div>

    <div v-else-if="team" class="space-y-6">
      <h1 class="text-3xl font-bold">{{ team.name }}</h1>
      <p>Ägare: {{ team.owner.name }}</p>

      <!-- Join button for non-members -->
      <TeamJoinButton
        v-if="!team.isMember && !team.isOwner"
        :team-id="teamId"
        :has-pending-request="team.hasPendingRequest"
      />

      <!-- Join requests for owner -->
      <TeamJoinRequest v-if="team.isOwner" :team-id="teamId" />

      <!-- Members list (only visible to members) -->
      <div v-if="team.isMember || team.isOwner">
        <h2 class="mt-4 text-xl font-semibold">Medlemmar:</h2>
        <ul class="mt-2 ml-6 list-disc">
          <li v-for="member in membersWithFormattedDate" :key="member._id">
            {{ member.name }} - Gick med: {{ member.joinedAtFormatted }}
          </li>
        </ul>
      </div>

      <!-- Info for non-members -->
      <div v-else class="text-muted-foreground">
        <p>{{ team.memberCount }} medlemmar i laget</p>
      </div>
    </div>

    <div v-else>
      <p>Inget lag hittades.</p>
    </div>
  </div>
</template>
