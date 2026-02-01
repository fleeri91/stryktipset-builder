<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue-sonner'

interface Props {
  teamId: string
  hasPendingRequest?: boolean
}

const props = defineProps<Props>()

const isRequesting = ref(false)
const requested = ref(props.hasPendingRequest || false)

async function requestToJoin() {
  isRequesting.value = true

  try {
    await $fetch(`/api/team/${props.teamId}/join-request`, {
      method: 'POST',
    })

    requested.value = true
    toast.success('Förfrågan skickad!', {
      description: 'Lagägaren kommer att granska din förfrågan',
    })
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'statusCode' in error) {
      throw error
    }

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

    toast.error('Kunde inte skicka förfrågan', { description })
  } finally {
    isRequesting.value = false
  }
}
</script>

<template>
  <Button
    v-if="!requested"
    :disabled="isRequesting"
    class="w-full"
    @click="requestToJoin"
  >
    {{ isRequesting ? 'Skickar...' : 'Ansök om medlemskap' }}
  </Button>
  <Button v-else disabled variant="secondary" class="w-full">
    Förfrågan väntande
  </Button>
</template>
