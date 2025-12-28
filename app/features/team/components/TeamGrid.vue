<script setup lang="ts">
import type { TeamListItem } from '~~/shared/types/Team'
import TeamCard from './TeamCard.vue'

interface Props {
  teams: TeamListItem[]
  emptyMessage?: string
}

withDefaults(defineProps<Props>(), {
  emptyMessage: 'Inga lag hittades.',
})
</script>

<template>
  <div v-if="teams.length > 0" class="grid gap-4 md:grid-cols-2">
    <TeamCard v-for="team in teams" :key="team._id" :team="team" />
  </div>
  <div v-else class="text-muted-foreground text-center">
    <p>{{ emptyMessage }}</p>
  </div>
</template>
