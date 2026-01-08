import type {
  ResultsHistoryRoot,
  ResultDate,
} from '~~/shared/types/SvenskaSpel/ResultsHistory'
import { EventType } from '~~/shared/types/SvenskaSpel/EventType'
import { DrawState } from '~~/shared/types/SvenskaSpel/ResultsHistory'

export function useResultsData(
  type: Ref<EventType>,
  year: Ref<number>,
  month: Ref<number>
) {
  const fetch = useDelayedFetch<ResultsHistoryRoot>('/api/results', {
    query: {
      type,
      year,
      month,
    },
    watch: [type, year, month],
    key: computed(() => `results-${type.value}-${year.value}-${month.value}`),
  })

  const data = computed<ResultsHistoryRoot | null>(() => {
    if (!fetch.data.value) return null

    const finalizedResults = fetch.data.value.resultDates.filter(
      (result: ResultDate) => result.drawState === DrawState.Finalized
    )

    return {
      ...fetch.data.value,
      resultDates: finalizedResults,
    }
  })

  return {
    ...fetch,
    data,
  }
}
