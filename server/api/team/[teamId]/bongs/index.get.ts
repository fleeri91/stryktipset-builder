import type { TeamBong } from '~~/shared/types/team'

interface TeamDocument {
  _id: unknown
  owner: { toString(): string }
  members: Array<{
    userId: { toString(): string }
  }>
}

interface PopulatedBongDocument {
  _id: { toString(): string }
  userId: {
    _id: { toString(): string }
    name: string
  }
  drawNumber: number
  drawComment: string
  closeTime: Date
  predictions: unknown[]
  createdAt: Date
}

export default defineEventHandler(async (event): Promise<TeamBong[]> => {
  const session = await requireUserSession(event)
  const teamId = getRouterParam(event, 'teamId')
  const userId = session.user.id.toString()

  if (!teamId) {
    throw createError({
      statusCode: 400,
      message: 'Lag-ID saknas',
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
    })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(50) // Limit to 50 most recent
      .lean<PopulatedBongDocument[]>()

    return bongs.map((bong) => ({
      _id: bong._id.toString(),
      userId: bong.userId._id.toString(),
      userName: bong.userId.name,
      drawNumber: bong.drawNumber,
      drawComment: bong.drawComment,
      closeTime: bong.closeTime.toISOString(),
      predictionsCount: bong.predictions.length,
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
