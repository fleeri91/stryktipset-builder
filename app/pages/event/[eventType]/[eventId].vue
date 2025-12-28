<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

import { reactive, computed, ref, watch } from 'vue'
import { toast } from 'vue-sonner'

import { Event } from '@/components/event'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/empty-state'

import type { Outcome, ConfidenceLevel } from '@/components/event'
import type { Draw } from '~~/shared/types/SvenskaSpel/Event'
import type { BongRoot } from '~~/shared/types/Bong'

const route = useRoute()
const drawNumber = route.params.eventId as string

const { data, pending, error } = await useAsyncData(`event-${drawNumber}`, () =>
  $fetch<{ draw: Draw; eventType: string }>(`/api/event/${drawNumber}`)
)

const eventType = computed(() => data.value?.draw.productName)
const draw = computed(() => data.value?.draw)
const events = computed(() => draw.value?.events ?? [])
const hasDraws = computed(() => !!draw.value)
const eventDate = computed(() => draw.value?.closeTime ?? new Date())

const selections = reactive<Record<number, Outcome[]>>({})
const confidenceLevels = reactive<Record<number, ConfidenceLevel>>({})
const isSubmitting = ref(false)
const existingBongId = ref<string | null>(null)

// Fetch existing bong if it exists
const { data: bongData } = await useAsyncData(
  `bong-${drawNumber}`,
  async () => {
    try {
      const result = await $fetch<{ bong: BongRoot | null }>(
        `/api/bong/${drawNumber}`
      )
      return result
    } catch (err) {
      return { bong: null }
    }
  },
  { server: false } // Only fetch on client side after auth
)

// Pre-populate form when bong data is loaded
watch(
  () => bongData.value?.bong,
  (bong) => {
    if (bong && bong.predictions) {
      // MongoDB returns _id as a string, not {$oid: "..."}
      existingBongId.value =
        typeof bong._id === 'string'
          ? bong._id
          : (bong._id as any)?.$oid || (bong._id as any)?.toString()

      // Clear existing selections
      Object.keys(selections).forEach((key) => delete selections[Number(key)])
      Object.keys(confidenceLevels).forEach(
        (key) => delete confidenceLevels[Number(key)]
      )

      bong.predictions.forEach((pred) => {
        // Ensure pred.outcome is always a flat array
        selections[pred.eventNumber] = Array.isArray(pred.outcome)
          ? (pred.outcome as Outcome[])
          : [pred.outcome as Outcome]

        confidenceLevels[pred.eventNumber] = pred.confidence as ConfidenceLevel
      })
    }
  },
  { immediate: true }
)

function handleSelectionsUpdate(eventNumber: number, value: Outcome[]) {
  selections[eventNumber] = value
}

function handleConfidenceUpdate(eventNumber: number, value: ConfidenceLevel) {
  confidenceLevels[eventNumber] = value
}

const isValidBong = computed(() => {
  return events.value.every((event) => {
    const eventSelections = selections[event.eventNumber]
    return eventSelections && eventSelections.length > 0
  })
})

const isEditing = computed(() => !!existingBongId.value)

async function submitBong() {
  if (!isValidBong.value || !draw.value) {
    toast.error('Ofullständig bong', {
      description: 'Välj minst ett alternativ för varje match',
    })
    return
  }

  isSubmitting.value = true

  try {
    const predictions = events.value.map((event) => {
      const eventSelections = selections[event.eventNumber] || []
      const confidence = confidenceLevels[event.eventNumber] || 'NEUTRAL'
      const outcome = eventSelections as Outcome[]

      return {
        eventNumber: event.eventNumber,
        outcome,
        confidence,
        description: event.description,
        sportEventId: event.sportEventId,
      }
    })

    const payload = {
      drawNumber: draw.value.drawNumber,
      drawComment: draw.value.drawComment,
      closeTime: draw.value.closeTime,
      predictions,
    }

    if (isEditing.value) {
      const url = `/api/bong/${drawNumber}`

      // Update existing bong
      await $fetch(url, {
        method: 'PUT',
        body: payload,
      })
      toast.success('Bong uppdaterad!', {
        description: `Din bong för ${draw.value.drawComment} har uppdaterats`,
      })
    } else {
      // Create new bong
      const response = await $fetch<BongRoot>('/api/bong', {
        method: 'POST',
        body: payload,
      })

      // MongoDB returns _id as a string or ObjectId, not {$oid: "..."}
      existingBongId.value =
        typeof response._id === 'string'
          ? response._id
          : (response._id as any)?.$oid || (response._id as any)?.toString()

      toast.success('Bong skapad!', {
        description: `Din bong för ${draw.value.drawComment} har sparats`,
      })
    }
  } catch (err: any) {
    console.error('❌ Error submitting bong:', err)
    console.error('❌ Error details:', {
      statusCode: err.statusCode,
      statusMessage: err.statusMessage,
      data: err.data,
    })

    let errorMessage = 'Något gick fel när bong skulle sparas'

    if (err.statusCode === 409) {
      errorMessage = 'Du har redan skapat en bong för denna omgång'
      console.error(
        '⚠️ 409 Error - This suggests the PUT endpoint is not being reached'
      )
    } else if (err.statusCode === 400) {
      errorMessage = err.statusMessage || 'Ogiltiga värden i bong'
    } else if (err.statusCode === 404) {
      errorMessage = 'Bong hittades inte'
    }

    toast.error(
      isEditing.value ? 'Kunde inte uppdatera bong' : 'Kunde inte spara bong',
      {
        description: errorMessage,
      }
    )
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <div v-if="pending">Loading event...</div>
    <div v-else-if="error">Error loading event: {{ error.message }}</div>
    <div v-else-if="!hasDraws">
      <EmptyState
        title="Här var det tomt"
        description="Kunde inte hitta omgång"
      />
    </div>
    <div class="bg-card w-full max-w-2xl rounded-2xl p-8" v-else>
      <div class="mb-8 flex justify-center">
        <h1 class="inline-flex gap-2 text-2xl font-bold">
          <span>{{ eventType ?? 'Event' }}</span>
          <NuxtTime
            :datetime="eventDate"
            year="numeric"
            month="long"
            day="numeric"
            hour="2-digit"
            minute="2-digit"
            locale="sv-SE"
          />
        </h1>
      </div>
      <Event
        v-for="event in events"
        :key="event.eventNumber"
        :event="event"
        :initial-selections="selections[event.eventNumber]"
        :initial-confidence="confidenceLevels[event.eventNumber]"
        @update:selections="handleSelectionsUpdate"
        @update:confidence="handleConfidenceUpdate"
      />

      <!-- Submit button -->
      <div class="mt-8 flex justify-center">
        <Button
          @click="submitBong"
          :disabled="!isValidBong || isSubmitting"
          class="w-full max-w-md"
          size="lg"
        >
          {{
            isSubmitting
              ? isEditing
                ? 'Uppdaterar...'
                : 'Sparar...'
              : isEditing
                ? 'Uppdatera'
                : 'Spara'
          }}
        </Button>
      </div>

      <p
        v-if="!isValidBong"
        class="text-muted-foreground mt-2 text-center text-sm"
      >
        Välj minst ett alternativ för alla matcher
      </p>
    </div>
  </div>
</template>
