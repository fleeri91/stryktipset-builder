import { EventType } from '~~/shared/types/SvenskaSpel/EventType'
import type { ResultsHistoryRoot } from '~~/shared/types/SvenskaSpel/ResultsHistory'

export default defineEventHandler(
  async (event): Promise<ResultsHistoryRoot> => {
    const query = getQuery(event)

    const type = query.type as EventType
    const year = Number(query.year)
    const month = Number(query.month)

    if (!Object.values(EventType).includes(type)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid event type',
      })
    }

    if (
      !Number.isInteger(year) ||
      !Number.isInteger(month) ||
      month < 1 ||
      month > 12
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid year or month',
      })
    }

    try {
      const data = await $fetch<ResultsHistoryRoot>(
        `https://api.spela.svenskaspel.se/draw/1/results/datepicker/` +
          `?product=${type}&year=${year}&month=${month}`
      )

      // ✅ Sort by closeDate (newest first)
      data.resultDates.sort(
        (a, b) =>
          new Date(b.closeDate).getTime() - new Date(a.closeDate).getTime()
      )

      return data
    } catch (err) {
      console.error('Error fetching results:', err)

      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch results',
      })
    }
  }
)
