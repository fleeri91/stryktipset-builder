<script setup lang="ts">
import type { TeamDraw } from '~~/shared/types/Team'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Props {
  draw: TeamDraw
  teamId: string
}

defineProps<Props>()
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-start justify-between">
        <div>
          <CardTitle class="text-lg">{{ draw.drawComment }}</CardTitle>
          <CardDescription>
            {{ draw.productName }} · Omgång {{ draw.drawNumber }}
          </CardDescription>
        </div>
        <Badge :variant="draw.canGenerate ? 'default' : 'secondary'">
          {{ draw.participatingMembers }} / {{ draw.totalMembers }}
        </Badge>
      </div>
    </CardHeader>
    <CardContent class="flex items-center justify-between">
      <p class="text-muted-foreground text-sm">
        Stänger:
        {{
          new Date(draw.closeTime).toLocaleDateString('sv-SE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        }}
      </p>
      <div class="flex gap-2">
        <Button variant="outline" size="sm" as-child>
          <NuxtLink :to="`/team/${teamId}/bongs/${draw.drawNumber}`">
            Visa bongs
          </NuxtLink>
        </Button>
        <Button size="sm" :disabled="!draw.canGenerate" as-child>
          <NuxtLink
            v-if="draw.canGenerate"
            :to="`/team/${teamId}/bongs/${draw.drawNumber}/generate`"
          >
            Generera
          </NuxtLink>
          <span v-else>Generera</span>
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
