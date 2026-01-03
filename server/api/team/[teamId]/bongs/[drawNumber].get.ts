import type { TeamDrawBong } from '~~/shared/types/Team'

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
    // Check if user is a member of the team
    const team: any = await Team.findById(teamId).lean()

    if (!team) {
      throw createError({
        statusCode: 404,
        message: 'Laget hittades inte',
      })
    }

    const isOwner = team.owner.toString() === userId
    const isMember = team.members.some(
      (member: any) => member.userId.toString() === userId
    )

    if (!isOwner && !isMember) {
      throw createError({
        statusCode: 403,
        message: 'Du måste vara medlem för att se lagmedlemmarnas bongs',
      })
    }

    // Get all member IDs
    const memberIds = team.members.map((m: any) => m.userId.toString())

    // Fetch bongs for this specific draw from all team members
    const bongs: any = await EventBong.find({
      userId: { $in: memberIds },
      drawNumber: drawNumberInt,
    })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .lean()

    if (bongs.length === 0) {
      return []
    }

    // Transform to detailed structure with predictions
    return bongs.map((bong: any) => ({
      _id: bong._id.toString(),
      user: {
        _id: bong.userId._id.toString(),
        name: bong.userId.name,
        email: bong.userId.email,
      },
      drawNumber: bong.drawNumber,
      drawComment: bong.drawComment,
      closeTime: bong.closeTime.toISOString(),
      predictions: bong.predictions.map((pred: any) => ({
        eventNumber: pred.eventNumber,
        outcome: pred.outcome,
        confidence: pred.confidence,
        description: pred.description,
      })),
      createdAt: bong.createdAt.toISOString(),
    }))
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Ett fel uppstod vid hämtning av bongs',
    })
  }
})
