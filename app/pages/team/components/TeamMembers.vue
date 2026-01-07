<script setup lang="ts">
import { Crown } from 'lucide-vue-next'

interface Member {
  _id: string
  name: string
  joinedAtFormatted: string
}

interface Props {
  members: Member[]
  ownerId: string
  loading?: boolean
}

defineProps<Props>()
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between">
        <CardTitle>Medlemmar</CardTitle>
        <Badge v-if="!loading" variant="outline">{{ members.length }}</Badge>
        <Skeleton v-else class="h-5 w-8" />
      </div>
    </CardHeader>
    <CardContent>
      <!-- Loading Skeleton -->
      <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card v-for="i in 6" :key="i">
          <CardContent class="flex items-start gap-3 p-4">
            <Skeleton class="h-10 w-10 rounded-full" />
            <div class="flex-1 space-y-2">
              <Skeleton class="h-4 w-24" />
              <Skeleton class="h-3 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Empty State -->
      <EmptyState
        v-else-if="members.length === 0"
        title="Här var det tomt"
        description="Inga medlemmar"
      />

      <!-- Members Grid -->
      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          v-for="member in members"
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
                <p class="truncate text-sm font-medium">{{ member.name }}</p>
                <Crown
                  v-if="member._id === ownerId"
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
</template>
