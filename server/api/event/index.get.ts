import { EventRoot } from '~~/shared/types/SvenskaSpel/Event'
import { EventType } from '~~/shared/types/SvenskaSpel/EventType'

export default defineEventHandler(async (event): Promise<EventRoot> => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  const type = query.type as EventType

  if (!Object.values(EventType).includes(type)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid event type',
    })
  }

  try {
    const data = await $fetch<EventRoot>(
      `${config.public.svenskaSpelBaseUrl}${type}/draws?accesskey=${config.svenskaSpelSecret}`
    )

    return data
  } catch (err) {
    console.error('Error fetching event:', err)

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch event',
    })
  }
})
