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

    const validOutcomes = ['1', 'X', '2']

    for (const pred of body.predictions) {
      if (Array.isArray(pred.outcome)) {
        for (const o of pred.outcome) {
          if (!validOutcomes.includes(o)) {
            throw createError({
              statusCode: 400,
              statusMessage: `Invalid outcome: ${o}. Must be '1', 'X', or '2'`,
            })
          }
        }
      } else if (!validOutcomes.includes(pred.outcome)) {
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
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: number }).code === 11000
    ) {
      return sendError(
        event,
        createError({
          statusCode: 409,
          statusMessage: 'A bet for this draw already exists',
        })
      )
    }

    if (
      typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      (error as { name: string }).name === 'ValidationError' &&
      'message' in error &&
      typeof (error as { message: unknown }).message === 'string'
    ) {
      return sendError(
        event,
        createError({
          statusCode: 400,
          statusMessage: (error as { message: string }).message,
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
          typeof (error as { statusCode: unknown }).statusCode === 'number'
            ? (error as { statusCode: number }).statusCode
            : 500,
        statusMessage:
          error instanceof Error ? error.message : 'Internal Server Error',
      })
    )
  }
})
