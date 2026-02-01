import { EventBong } from '~~/server/models/event-bong.model'

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
    const body = await readBody(event)

    if (!drawNumber) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Draw number is required',
      })
    }

    // Validate predictions
    if (
      !body.predictions ||
      !Array.isArray(body.predictions) ||
      body.predictions.length === 0
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: 'predictions must be a non-empty array',
      })
    }

    // Find and update the user's bong for this draw
    const bong = await EventBong.findOneAndUpdate(
      {
        userId,
        drawNumber: Number(drawNumber),
      },
      {
        predictions: body.predictions,
        drawComment: body.drawComment,
        closeTime: body.closeTime,
      },
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators
      }
    )

    if (!bong) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Bong not found',
      })
    }

    return {
      bong,
    }
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      error.name === 'ValidationError' &&
      'message' in error &&
      typeof error.message === 'string'
    ) {
      return sendError(
        event,
        createError({
          statusCode: 400,
          statusMessage: error.message,
        })
      )
    }

    return sendError(
      event,
      createError({
        statusCode:
          typeof error === 'object' &&
          error !== null &&
          'statusCode' in error &&
          typeof error.statusCode === 'number'
            ? error.statusCode
            : 500,
        statusMessage:
          error instanceof Error ? error.message : 'Internal Server Error',
      })
    )
  }
})
