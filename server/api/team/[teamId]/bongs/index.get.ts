import type { TeamBong } from '~~/shared/types/Team'

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

    // Fetch recent bongs from all team members
    const bongs: any = await EventBong.find({
      userId: { $in: memberIds },
    })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(50) // Limit to 50 most recent
      .lean()

    // Transform to simpler structure
    return bongs.map((bong: any) => ({
      _id: bong._id.toString(),
      userId: bong.userId._id.toString(),
      userName: bong.userId.name,
      drawNumber: bong.drawNumber,
      drawComment: bong.drawComment,
      closeTime: bong.closeTime.toISOString(),
      predictionsCount: bong.predictions.length,
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
