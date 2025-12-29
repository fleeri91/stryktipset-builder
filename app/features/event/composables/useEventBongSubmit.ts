import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'
import type { Outcome, ConfidenceLevel } from '~/features/event/types'
import type { Draw } from '~~/shared/types/SvenskaSpel/Event'
import type { BongRoot } from '~~/shared/types/Bong'
import type { Event } from '~~/shared/types/SvenskaSpel/Event'

export const useEventBongSubmit = (
  drawNumber: string,
  draw: ComputedRef<Draw | undefined>,
  events: ComputedRef<Event[]>,
  selections: Record<number, Outcome[]>,
  confidenceLevels: Record<number, ConfidenceLevel>,
  existingBongId: Ref<string | null>
) => {
  const isSubmitting = ref(false)

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
        const outcome = eventSelections.map((val) => String(val)) as Outcome[]

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
        await $fetch(`/api/bong/${drawNumber}`, {
          method: 'PUT',
          body: payload,
        })
        toast.success('Bong uppdaterad!', {
          description: `Din bong för ${draw.value.drawComment} har uppdaterats`,
        })
      } else {
        const response = await $fetch<BongRoot>('/api/bong', {
          method: 'POST',
          body: payload,
        })

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

      let errorMessage = 'Något gick fel när bong skulle sparas'

      if (err.statusCode === 409) {
        errorMessage = 'Du har redan skapat en bong för denna omgång'
      } else if (err.statusCode === 400) {
        errorMessage = err.statusMessage || 'Ogiltiga värden i bong'
      } else if (err.statusCode === 404) {
        errorMessage = 'Bong hittades inte'
      }

      toast.error(
        isEditing.value ? 'Kunde inte uppdatera bong' : 'Kunde inte spara bong',
        { description: errorMessage }
      )
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    isSubmitting,
    isValidBong,
    isEditing,
    submitBong,
  }
}
