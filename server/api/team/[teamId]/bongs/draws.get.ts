import type {
  TeamDraw,
  TeamDocument,
  TeamBongDocument,
} from '~~/shared/types/team'

export default defineEventHandler(async (event): Promise<TeamDraw[]> => {
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
        message: 'Du måste vara medlem för att se lagbongs',
      })
    }

    const memberIds = team.members.map((m) => m.userId.toString())
    const totalMembers = memberIds.length

    const bongs = await EventBong.find({
      userId: { $in: memberIds },
    })
      .select('drawNumber drawComment closeTime userId')
      .sort({ closeTime: -1 })
      .lean<TeamBongDocument[]>()

    const drawMap = new Map<
      number,
      {
        drawComment: string
        closeTime: Date
        participants: Set<string>
      }
    >()

    bongs.forEach((bong) => {
      if (!drawMap.has(bong.drawNumber)) {
        drawMap.set(bong.drawNumber, {
          drawComment: bong.drawComment,
          closeTime: bong.closeTime,
          participants: new Set(),
        })
      }
      drawMap.get(bong.drawNumber)!.participants.add(bong.userId.toString())
    })

    const draws: TeamDraw[] = Array.from(drawMap.entries()).map(
      ([drawNumber, data]) => ({
        drawNumber,
        drawComment: data.drawComment,
        closeTime: data.closeTime.toISOString(),
        productName: data.drawComment.toLowerCase().includes('europa')
          ? 'Europatipset'
          : 'Stryktipset',
        participatingMembers: data.participants.size,
        totalMembers,
        canGenerate: data.participants.size >= 2,
      })
    )

    draws.sort(
      (a, b) =>
        new Date(b.closeTime).getTime() - new Date(a.closeTime).getTime()
    )

    return draws
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Ett fel uppstod vid hämtning av omgångar',
    })
  }
})
