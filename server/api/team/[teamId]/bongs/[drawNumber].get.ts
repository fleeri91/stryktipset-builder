import type {
  TeamDrawBong,
  TeamDocument,
  TeamPopulatedDrawBong,
} from '~~/shared/types/team'

export default defineEventHandler(async (event): Promise<TeamDrawBong[]> => {
  const session = await requireUserSession(event)
  const teamId = getRouterParam(event, 'teamId')
  const drawNumber = getRouterParam(event, 'drawNumber')
  const userId = session.user.id.toString()

  if (!teamId || !drawNumber) {
    throw createError({
      statusCode: 400,
      message: 'Lag-ID eller omgångsnummer saknas',
    })
  }

  const drawNumberInt = parseInt(drawNumber)
  if (isNaN(drawNumberInt)) {
    throw createError({
      statusCode: 400,
      message: 'Ogiltigt omgångsnummer',
    })
  }

  try {
    const team = await Team.findById(teamId).lean<TeamDocument>()

    if (!team) {
      throw createError({
        statusCode: 404,
        message: 'Laget hittades inte',
      })
    }

    const isOwner = team.owner.toString() === userId
    const isMember = team.members.some(
      (member) => member.userId.toString() === userId
    )

    if (!isOwner && !isMember) {
      throw createError({
        statusCode: 403,
        message: 'Du måste vara medlem för att se lagmedlemmarnas bongs',
      })
    }

    const memberIds = team.members.map((m) => m.userId.toString())

    const bongs = await EventBong.find({
      userId: { $in: memberIds },
      drawNumber: drawNumberInt,
    })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .lean<TeamPopulatedDrawBong[]>()

    if (bongs.length === 0) {
      return []
    }

    return bongs.map((bong) => ({
      _id: bong._id.toString(),
      user: {
        _id: bong.userId._id.toString(),
        name: bong.userId.name,
        email: bong.userId.email,
      },
      drawNumber: bong.drawNumber,
      drawComment: bong.drawComment,
      closeTime: bong.closeTime.toISOString(),
      predictions: bong.predictions.map((pred) => ({
        eventNumber: pred.eventNumber,
        outcome: pred.outcome,
        confidence: pred.confidence,
        description: pred.description,
      })),
      createdAt: bong.createdAt.toISOString(),
    }))
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Ett fel uppstod vid hämtning av bongs',
    })
  }
})
