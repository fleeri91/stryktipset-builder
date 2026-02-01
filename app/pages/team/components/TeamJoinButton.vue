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
  } catch (err: any) {
    toast.error('Kunde inte skicka förfrågan', {
      description: err.data?.message || 'Något gick fel',
    })
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
