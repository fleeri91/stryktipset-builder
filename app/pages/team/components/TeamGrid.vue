<script setup lang="ts">
import type { TeamListItem } from '~~/shared/types/Team'

withDefaults(
  defineProps<{
    teams: TeamListItem[] | null
    emptyMessage?: string
    skeletonCount?: number
  }>(),
  {
    emptyMessage: 'Inga lag hittades.',
    skeletonCount: 2,
  }
)
</script>

<template>
  <!-- Loading -->
  <div v-if="teams === null" class="grid gap-4 md:grid-cols-2">
    <Card class="min-h-34 cursor-default" v-for="i in skeletonCount" :key="i">
      <CardHeader>
        <Skeleton class="h-6 w-3/4" />
        <Skeleton class="mt-1.5 h-4 w-1/2" />
      </CardHeader>

      <CardContent>
        <div class="flex items-center justify-between text-sm">
          <Skeleton class="h-4 w-20" />
          <Skeleton class="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  </div>

  <!-- Data -->
  <div v-else-if="teams.length > 0" class="grid gap-4 md:grid-cols-2">
    <TeamCard v-for="team in teams" :key="team._id" :team="team" />
  </div>

  <!-- Empty -->
  <div v-else class="text-muted-foreground text-center">
    <p>{{ emptyMessage }}</p>
  </div>
</template>
