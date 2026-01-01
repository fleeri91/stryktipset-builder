import type { ResultsHistoryRoot } from '~~/shared/types/SvenskaSpel/ResultsHistory'
import { EventType } from '~~/shared/types/SvenskaSpel/EventType'

export interface UseResultsOptions {
  type: Ref<EventType>
  year: Ref<number>
  month: Ref<number>
}

export const useResults = (options: UseResultsOptions) => {
  const { type, year, month } = options

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

export const useCurrentResults = () => {
  const now = new Date()
  const type = ref<EventType>(EventType.Stryktipset)
  const year = ref(now.getFullYear())
  const month = ref(now.getMonth() + 1)

  const { data, pending, error } = useResults({ type, year, month })

  return {
    type,
    year,
    month,
    data,
    pending,
    error,
  }
}
