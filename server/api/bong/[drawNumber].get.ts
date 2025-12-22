// server/api/bong/[drawNumber].get.ts
import { EventBong } from '~~/server/models/event-bong.model'
import type { BongRoot } from '~~/shared/types/Bong'

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

    if (!drawNumber) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Draw number is required',
      })
    }

    // Find the user's bong for this draw
    const bong = await EventBong.findOne({
      userId,
      drawNumber: Number(drawNumber),
    })

    return {
      bong: bong as BongRoot | null,
    }
  } catch (err: any) {
    if (err.statusCode) {
      return sendError(event, err)
    }

    return sendError(
      event,
      createError({ statusCode: 500, statusMessage: err.message })
    )
  }
})
