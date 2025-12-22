import { EventType } from '~~/shared/types/SvenskaSpel/EventType'
import type { EventRoot, Draw } from '~~/shared/types/SvenskaSpel/Event'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { drawNumber } = event.context.params as { drawNumber: string }

  try {
    for (const type of Object.values(EventType)) {
      const data = await $fetch<EventRoot>(
        `${config.public.svenskaSpelBaseUrl}${type}/draws?accesskey=${config.svenskaSpelSecret}`
      )

      const draw = data.draws.find(
        (d: Draw) => String(d.drawNumber) === drawNumber
      )

      if (draw) {
        return {
          eventType: type,
          draw,
        }
      }
    }

    throw createError({
      statusCode: 404,
      statusMessage: 'Event not found',
    })
  } catch (err) {
    console.error('Error fetching event by drawNumber:', err)

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch event',
    })
  }
})
