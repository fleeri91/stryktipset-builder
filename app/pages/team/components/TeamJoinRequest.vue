<script setup lang="ts">
import { ref } from 'vue'
import type { JoinRequest } from '~~/shared/types/team'
import { toast } from 'vue-sonner'

interface Props {
  teamId: string
}

const props = defineProps<Props>()

// Use useAsyncData instead of useFetch for better type inference
const { data: requests, refresh } = await useAsyncData(
  `join-requests-${props.teamId}`,
  () => $fetch<JoinRequest[]>(`/api/team/${props.teamId}/join-request`)
)

const processing = ref<string | null>(null)

async function handleRequest(requestId: string, action: 'accept' | 'reject') {
  processing.value = requestId

  try {
    await $fetch(`/api/team/${props.teamId}/join-request/${requestId}`, {
      method: 'POST',
      body: { action },
    })

    toast.success(
      action === 'accept' ? 'Användare tillagd!' : 'Förfrågan avvisad'
    )

    await refresh()
  } catch (error: unknown) {
    const description =
      typeof error === 'object' &&
      error !== null &&
      'data' in error &&
      typeof error.data === 'object' &&
      error.data !== null &&
      'message' in error.data &&
      typeof error.data.message === 'string'
        ? error.data.message
        : 'Något gick fel'

    toast.error('Kunde inte hantera förfrågan', { description })
  } finally {
    processing.value = null
  }
}
</script>

<template>
  <Card v-if="requests && requests.length > 0" class="mt-6">
    <CardHeader>
      <CardTitle>Väntande förfrågningar</CardTitle>
      <CardDescription>
        {{ requests.length }} användare vill gå med i laget
      </CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <div
        v-for="request in requests"
        :key="request._id"
        class="flex items-center justify-between rounded-lg border p-4"
      >
        <div>
          <p class="font-semibold">{{ request.user.name }}</p>
          <p class="text-muted-foreground text-sm">{{ request.user.email }}</p>
          <p class="text-muted-foreground mt-1 text-xs">
            {{ new Date(request.requestedAt).toLocaleDateString('sv-SE') }}
          </p>
        </div>
        <div class="flex gap-2">
          <Button
            size="sm"
            :disabled="processing === request._id"
            @click="handleRequest(request._id, 'accept')"
          >
            Godkänn
          </Button>
          <Button
            size="sm"
            variant="outline"
            :disabled="processing === request._id"
            @click="handleRequest(request._id, 'reject')"
          >
            Avvisa
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
