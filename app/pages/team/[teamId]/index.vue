<script setup lang="ts">
import { Info } from 'lucide-vue-next'

import { useTeamPage } from '~/pages/team/composables/useTeamPage'

const route = useRoute()
const teamId = route.params.teamId as string

const {
  team,
  error,
  pending,
  errorMessage,
  draws,
  drawsPending,
  membersWithFormattedDate,
  isNonMember,
  isMemberOrOwner,
} = useTeamPage(teamId)
</script>

<template>
  <div class="mx-auto mt-8 max-w-5xl px-4 pb-16">
    <!-- Error State -->
    <ErrorState
      v-if="error"
      title="Kunde inte hämta laget"
      :description="errorMessage"
    />

    <!-- Main Content -->
    <div v-else class="space-y-8">
      <!-- Header Section - Shows skeleton while loading -->
      <TeamHeader
        :team-name="team?.name"
        :owner-name="team?.owner.name"
        :member-count="team?.memberCount"
        :loading="pending"
      />

      <!-- Join Button for Non-Members (only after loading) -->
      <Card v-if="!pending && isNonMember" class="border-dashed">
        <CardContent class="pt-6 text-center">
          <h3 class="mb-2 text-lg font-semibold">Vill du gå med i laget?</h3>
          <p class="text-muted-foreground mb-6 text-sm">
            Gå med för att se medlemmar och delta i omgångar
          </p>
          <TeamJoinButton
            :team-id="teamId"
            :has-pending-request="team?.hasPendingRequest"
          />
        </CardContent>
      </Card>

      <!-- Join Requests (Owner Only) -->
      <TeamJoinRequest v-if="!pending && team?.isOwner" :team-id="teamId" />

      <!-- Members Section - Shows skeleton while loading -->
      <TeamMembers
        v-if="isMemberOrOwner || pending"
        :members="membersWithFormattedDate"
        :owner-id="team?.owner._id || ''"
        :loading="pending"
      />

      <!-- Draws Section - Shows skeleton while draws loading -->
      <Card v-if="isMemberOrOwner || pending">
        <CardHeader>
          <CardTitle>Omgångar</CardTitle>
        </CardHeader>
        <CardContent>
          <TeamDrawsList
            :draws="draws || []"
            :team-id="teamId"
            :loading="drawsPending || pending"
          />
        </CardContent>
      </Card>

      <!-- Info Alert for Non-Members -->
      <Alert v-if="!pending && isNonMember">
        <Info />
        <AlertDescription>
          <strong class="font-medium">Gå med för att se mer.</strong>
          Medlemmar kan se alla lagmedlemmar och delta i omgångar tillsammans.
        </AlertDescription>
      </Alert>

      <!-- Not Found State (only if loaded but no team) -->
      <div v-if="!pending && !team" class="py-16 text-center">
        <EmptyState
          title="Inget lag hittades"
          description="Detta lag verkar inte existera eller har tagits bort."
        />
      </div>
    </div>
  </div>
</template>
