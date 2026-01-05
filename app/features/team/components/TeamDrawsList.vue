<script setup lang="ts">
import type { TeamDraw } from '~~/shared/types/Team'
import TeamDrawCard from './TeamDrawCard.vue'
import EmptyState from '@/components/EmptyState.vue'

interface Props {
  draws: TeamDraw[]
  teamId: string
  loading?: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="space-y-4">
    <div v-if="loading" class="py-8 text-center">Laddar omgångar...</div>

    <div v-else-if="draws.length > 0" class="space-y-3">
      <TeamDrawCard
        v-for="draw in draws"
        :key="draw.drawNumber"
        :draw="draw"
        :team-id="teamId"
      />
    </div>

    <EmptyState
      v-else
      title="Inga omgångar ännu"
      description="Lagmedlemmar har inte skickat in några bongs än"
    />
  </div>
</template>
