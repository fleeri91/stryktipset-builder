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

const {
  data: teams,
  pending,
  error,
} = await useFetch<TeamListItem[]>('/api/team')
</script>

<template>
  <div class="mx-auto max-w-4xl px-4">
    <div class="mt-12 flex items-center justify-between">
      <h1 class="text-3xl font-bold">Lag</h1>

      <Button variant="outline" asChild>
        <NuxtLink to="/team/create">Skapa</NuxtLink>
      </Button>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="mt-8 text-center">Laddar lag...</div>

    <!-- Error -->
    <div v-else-if="error" class="mt-8 text-center text-red-500">
      Kunde inte hämta lag. Försök igen senare.
    </div>

    <!-- Teams Grid -->
    <div
      v-else-if="teams && teams.length > 0"
      class="mt-8 grid gap-4 md:grid-cols-2"
    >
      <Card
        v-for="team in teams"
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
    <div v-else class="text-muted-foreground mt-8 text-center">
      <p>Inga lag hittades.</p>
    </div>
  </div>
</template>
