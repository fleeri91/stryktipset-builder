<script setup lang="ts">
import type { TeamRoot, Member } from '~~/shared/types/Team'
import { useTeamDraws } from '~/pages/team/composables'
import { computed } from 'vue'
import { Crown, User, Info } from 'lucide-vue-next'

const route = useRoute()
const teamId = route.params.teamId as string

const {
  data: team,
  error,
  pending,
} = await useFetch<TeamRoot>(`/api/team/${teamId}`)

const shouldFetchDraws = computed(
  () => team.value?.isMember || team.value?.isOwner
)

const { data: draws, pending: drawsPending } = shouldFetchDraws.value
  ? useTeamDraws(teamId)
  : { data: ref([]), pending: ref(false) }

const errorMessage = computed(
  () => (error.value as { message?: string })?.message || 'Okänt fel'
)

const membersWithFormattedDate = computed(() => {
  return (
    team.value?.members?.map((member: Member) => ({
      ...member,
      joinedAtFormatted: new Date(member.joinedAt).toLocaleDateString('sv-SE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    })) || []
  )
})

const userRole = computed(() => {
  if (team.value?.isOwner) return 'Ägare'
  if (team.value?.isMember) return 'Medlem'
  return null
})
</script>

<template>
  <div class="mx-auto mt-8 max-w-5xl px-4 pb-16">
    <!-- Loading State with Skeleton -->
    <div v-if="pending" class="space-y-6">
      <Skeleton class="h-10 w-64" />
      <Skeleton class="h-6 w-48" />
      <div class="space-y-4">
        <Skeleton class="h-32" />
        <Skeleton class="h-48" />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error">
      <ErrorState title="Kunde inte hämta laget" :description="errorMessage" />
    </div>

    <!-- Main Content -->
    <div v-else-if="team" class="space-y-8">
      <!-- Header Section -->
      <div class="space-y-4">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="space-y-2">
            <h1 class="text-4xl font-bold tracking-tight">{{ team.name }}</h1>
            <div class="text-muted-foreground flex items-center gap-3 text-sm">
              <div class="flex items-center gap-2">
                <User class="size-4" />
                <span>{{ team.owner.name }}</span>
              </div>
              <span class="text-muted-foreground/50">•</span>
              <span
                >{{ team.memberCount }}
                {{ team.memberCount === 1 ? 'medlem' : 'medlemmar' }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Join Button for Non-Members (Prominent CTA) -->
      <Card v-if="!team.isMember && !team.isOwner" class="border-dashed">
        <CardContent class="pt-6 text-center">
          <h3 class="mb-2 text-lg font-semibold">Vill du gå med i laget?</h3>
          <p class="text-muted-foreground mb-6 text-sm">
            Gå med för att se medlemmar och delta i omgångar
          </p>
          <TeamJoinButton
            :team-id="teamId"
            :has-pending-request="team.hasPendingRequest"
          />
        </CardContent>
      </Card>

      <!-- Join Requests (Owner Only) -->
      <TeamJoinRequest v-if="team.isOwner" :team-id="teamId" />

      <!-- Members Section (Members & Owners Only) -->
      <Card v-if="team.isMember || team.isOwner">
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle>Medlemmar</CardTitle>
            <Badge variant="outline">
              {{ membersWithFormattedDate.length }}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <!-- Empty State -->
          <EmptyState
            v-if="membersWithFormattedDate.length === 0"
            title="Här var det tomt"
            description="Inga medlemmar"
          />

          <!-- Members Grid -->
          <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card
              v-for="member in membersWithFormattedDate"
              :key="member._id"
              class="hover:bg-muted/50 transition-colors"
            >
              <CardContent class="flex items-start gap-3 p-4">
                <Avatar>
                  <AvatarFallback>
                    {{ member.name.charAt(0).toUpperCase() }}
                  </AvatarFallback>
                </Avatar>

                <div class="min-w-0 flex-1 space-y-1">
                  <div class="flex items-center gap-2">
                    <p class="truncate text-sm font-medium">
                      {{ member.name }}
                    </p>
                    <Crown
                      v-if="member._id === team.owner._id"
                      class="h-4 w-4 shrink-0 text-yellow-500"
                    />
                  </div>
                  <p class="text-muted-foreground text-xs">
                    Gick med: {{ member.joinedAtFormatted }}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <!-- Draws Section (Members & Owners Only) -->
      <Card v-if="team.isMember || team.isOwner">
        <CardHeader>
          <CardTitle>Omgångar</CardTitle>
        </CardHeader>
        <CardContent>
          <!-- Loading State -->
          <div v-if="drawsPending" class="space-y-3">
            <Skeleton v-for="i in 3" :key="i" class="h-20" />
          </div>

          <!-- Draws List -->
          <TeamDrawsList
            v-else
            :draws="draws || []"
            :team-id="teamId"
            :loading="drawsPending"
          />
        </CardContent>
      </Card>

      <!-- Info Alert for Non-Members -->
      <Alert v-if="!team.isMember && !team.isOwner">
        <Info />
        <AlertDescription>
          <strong class="font-medium">Gå med för att se mer.</strong>
          Medlemmar kan se alla lagmedlemmar och delta i omgångar tillsammans.
        </AlertDescription>
      </Alert>
    </div>

    <!-- Not Found State -->
    <div v-else class="py-16 text-center">
      <EmptyState
        title="Inget lag hittades"
        description="Detta lag verkar inte existera eller har tagits bort."
      />
    </div>
  </div>
</template>
