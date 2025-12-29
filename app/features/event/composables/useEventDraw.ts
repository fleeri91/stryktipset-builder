import type { Draw } from '~~/shared/types/SvenskaSpel/Event'

export const useEventDraw = (drawNumber: string) => {
  const { data, pending, error } = useAsyncData(`event-${drawNumber}`, () =>
    $fetch<{ draw: Draw; eventType: string }>(`/api/event/${drawNumber}`)
  )

  const eventType = computed(() => data.value?.draw.productName)
  const draw = computed(() => data.value?.draw)
  const events = computed(() => draw.value?.events ?? [])
  const hasDraws = computed(() => !!draw.value)
  const eventDate = computed(() => draw.value?.closeTime ?? new Date())

  return {
    data,
    pending,
    error,
    eventType,
    draw,
    events,
    hasDraws,
    eventDate,
  }
}
