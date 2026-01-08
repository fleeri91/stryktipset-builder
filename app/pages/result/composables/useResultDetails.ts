import type { Result } from '~~/shared/types/SvenskaSpel/Result'
import type { EventType } from '~~/shared/types/SvenskaSpel/EventType'

export function useResultDetails(
  type: Ref<EventType>,
  drawNumber: Ref<string | number>
) {
  return useDelayedFetch<Result>(
    computed(
      () => `/api/results/${type.value.toLowerCase()}/${drawNumber.value}`
    ),
    {
      watch: [type, drawNumber],
      key: computed(() => `result-${type.value}-${drawNumber.value}`),
    }
  )
}
