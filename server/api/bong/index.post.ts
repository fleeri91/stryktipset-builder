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

    if (!userId) {
      throw createError({
        statusCode: 500,
        statusMessage: 'User ID not found in session',
      })
    }

    const body = await readBody(event)

    if (
      !body.drawNumber ||
      !body.drawComment ||
      !body.closeTime ||
      !body.predictions
    ) {
      throw createError({
        statusCode: 400,
        statusMessage:
          'drawNumber, drawComment, closeTime, and predictions are required',
      })
    }

    if (!Array.isArray(body.predictions) || body.predictions.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'predictions must be a non-empty array',
      })
    }

    for (const pred of body.predictions) {
      if (
        !pred.eventNumber ||
        !pred.outcome ||
        !pred.confidence ||
        !pred.description ||
        !pred.sportEventId
      ) {
        throw createError({
          statusCode: 400,
          statusMessage:
            'Each prediction must have eventNumber, outcome, confidence, description, and sportEventId',
        })
      }

      if (!['1', 'X', '2'].includes(pred.outcome)) {
        throw createError({
          statusCode: 400,
          statusMessage: `Invalid outcome: ${pred.outcome}. Must be '1', 'X', or '2'`,
        })
      }

      if (!['UNSURE', 'NEUTRAL', 'SAFE'].includes(pred.confidence)) {
        throw createError({
          statusCode: 400,
          statusMessage: `Invalid confidence: ${pred.confidence}. Must be 'UNSURE', 'NEUTRAL', or 'SAFE'`,
        })
      }
    }

    const bong = await EventBong.create({
      userId,
      drawNumber: body.drawNumber,
      drawComment: body.drawComment,
      closeTime: new Date(body.closeTime),
      predictions: body.predictions,
    })

    return bong
  } catch (err: any) {
    if (err.code === 11000) {
      return sendError(
        event,
        createError({
          statusCode: 409,
          statusMessage: 'A bet for this draw already exists',
        })
      )
    }

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
