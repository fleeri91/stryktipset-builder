import { reactive, ref, watch, computed } from 'vue'
import type { Outcome, ConfidenceLevel } from '~/features/event/types'
import type { BongRoot } from '~~/shared/types/Bong'

export const useEventBong = (drawNumber: string) => {
  const selections = reactive<Record<number, Outcome[]>>({})
  const confidenceLevels = reactive<Record<number, ConfidenceLevel>>({})
  const existingBongId = ref<string | null>(null)

  // Fetch existing bong if it exists
  const { data: bongData } = useAsyncData(
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
    { server: false }
  )

  // Pre-populate form when bong data is loaded
  watch(
    () => bongData.value?.bong,
    (bong) => {
      if (bong && bong.predictions) {
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
          selections[pred.eventNumber] = Array.isArray(pred.outcome)
            ? (pred.outcome as Outcome[])
            : [pred.outcome as Outcome]

          confidenceLevels[pred.eventNumber] =
            pred.confidence as ConfidenceLevel
        })
      }
    },
    { immediate: true }
  )

  const isEditing = computed(() => !!existingBongId.value)

  function handleSelectionsUpdate(eventNumber: number, value: Outcome[]) {
    selections[eventNumber] = value
  }

  function handleConfidenceUpdate(eventNumber: number, value: ConfidenceLevel) {
    confidenceLevels[eventNumber] = value
  }

  return {
    selections,
    confidenceLevels,
    existingBongId,
    bongData,
    isEditing,
    handleSelectionsUpdate,
    handleConfidenceUpdate,
  }
}
