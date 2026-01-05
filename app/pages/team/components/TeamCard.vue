<script setup lang="ts">
import type { TeamListItem } from '~~/shared/types/Team'

interface Props {
  team: TeamListItem
}

defineProps<Props>()
</script>

<template>
  <Card
    class="hover:border-primary min-h-34 cursor-pointer transition-colors"
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
        <span>
          {{ team.memberCount }} medlem{{ team.memberCount !== 1 ? 'mar' : '' }}
        </span>
        <span>
          {{ new Date(team.createdAt).toLocaleDateString('sv-SE') }}
        </span>
      </div>
    </CardContent>
  </Card>
</template>
