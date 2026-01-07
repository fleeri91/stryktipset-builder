<script setup lang="ts">
import { User } from 'lucide-vue-next'

interface Props {
  teamName?: string
  ownerName?: string
  memberCount?: number
  loading?: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="space-y-2">
    <!-- Loading State -->
    <template v-if="loading">
      <Skeleton class="h-10 w-64" />
      <Skeleton class="h-5 w-48" />
    </template>

    <!-- Loaded State -->
    <template v-else>
      <h1 class="text-4xl font-bold tracking-tight">{{ teamName }}</h1>
      <div class="text-muted-foreground flex items-center gap-3 text-sm">
        <div class="flex items-center gap-2">
          <User class="size-4" />
          <span>{{ ownerName }}</span>
        </div>
        <span class="text-muted-foreground/50">•</span>
        <span
          >{{ memberCount }}
          {{ memberCount === 1 ? 'medlem' : 'medlemmar' }}</span
        >
      </div>
    </template>
  </div>
</template>
