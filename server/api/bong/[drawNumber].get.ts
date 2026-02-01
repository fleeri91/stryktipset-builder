import { EventBong } from '~~/server/models/event-bong.model'
import type { BongRoot } from '~~/shared/types/bong/Bong'

export default defineEventHandler(async (event) => {
  try {
    const session = await getUserSession(event)

    if (!session.user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    const userId = session.user.id
    const drawNumber = getRouterParam(event, 'drawNumber')

    if (!drawNumber) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Draw number is required',
      })
    }

    const bong = await EventBong.findOne({
      userId,
      drawNumber: Number(drawNumber),
    })

    return {
      bong: bong as BongRoot | null,
    }
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'statusCode' in error &&
      typeof error.statusCode === 'number'
    ) {
      const statusMessage =
        'message' in error && typeof error.message === 'string'
          ? error.message
          : 'Internal Server Error'

      return sendError(
        event,
        createError({
          statusCode: error.statusCode,
          statusMessage,
        })
      )
    }

    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage:
          error instanceof Error ? error.message : 'Internal Server Error',
      })
    )
  }
})
