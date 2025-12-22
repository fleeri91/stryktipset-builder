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

    const userId = (session.user as any).id
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
  } catch (err: any) {
    // Handle validation errors
    if (err.name === 'ValidationError') {
      return sendError(
        event,
        createError({
          statusCode: 400,
          statusMessage: err.message,
        })
      )
    }

    if (err.statusCode) {
      return sendError(event, err)
    }

    return sendError(
      event,
      createError({ statusCode: 500, statusMessage: err.message })
    )
  }
})
