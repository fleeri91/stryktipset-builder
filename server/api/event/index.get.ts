import { EventRoot } from '~~/server/types/SvenskaSpel/Event'

export default defineEventHandler(async (): Promise<EventRoot> => {
  const config = useRuntimeConfig()

  try {
    const data = await $fetch<EventRoot>(
      `${config.public.svenskaSpelBaseUrl}stryktipset/draws?accesskey=${config.svenskaSpelSecret}`
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
