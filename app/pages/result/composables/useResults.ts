import type { ResultsHistoryRoot } from '~~/shared/types/SvenskaSpel/ResultsHistory'
import { EventType } from '~~/shared/types/SvenskaSpel/EventType'

export function useResultsData(
  type: Ref<EventType>,
  year: Ref<number>,
  month: Ref<number>
) {
  return useDelayedFetch<ResultsHistoryRoot>('/api/results', {
    query: {
      type,
      year,
      month,
    },
    watch: [type, year, month],
    key: computed(() => `results-${type.value}-${year.value}-${month.value}`),
  })
}
