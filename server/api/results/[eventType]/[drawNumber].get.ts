import { EventType } from '~~/shared/types/SvenskaSpel/EventType'
import type { ResultRoot, Result } from '~~/shared/types/SvenskaSpel/Result'

export default defineEventHandler(async (event): Promise<Result> => {
  const eventType = getRouterParam(event, 'eventType')
  const drawNumber = getRouterParam(event, 'drawNumber')

  if (!eventType || !drawNumber) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing route parameters',
    })
  }

  const type =
    Object.values(EventType).find(
      (value) => value.toLowerCase() === eventType.toLowerCase()
    ) ?? null

  if (!type) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid event type',
    })
  }

  if (!/^\d+$/.test(drawNumber)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid draw number',
    })
  }

  try {
    const response = await $fetch<ResultRoot>(
      `https://api.spela.svenskaspel.se/draw/1/${type}/draws/${drawNumber}/result`
    )

    if (!response.result) {
      throw createError({
        statusCode: 502,
        statusMessage: 'Malformed response from Svenska Spel API',
      })
    }

    return response.result
  } catch (err) {
    console.error('Error fetching results:', err)

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch results',
    })
  }
})
