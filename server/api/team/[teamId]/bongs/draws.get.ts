export interface TeamDraw {
  drawNumber: number
  drawComment: string
  closeTime: string
  productName: string
  participatingMembers: number
  totalMembers: number
  canGenerate: boolean
}

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
        message: 'Du måste vara medlem för att se lagbongs',
      })
    }

    // Get all member IDs
    const memberIds = team.members.map((m: any) => m.userId.toString())
    const totalMembers = memberIds.length

    // Get all bongs from team members and group by draw
    const bongs: any = await EventBong.find({
      userId: { $in: memberIds },
    })
      .select('drawNumber drawComment closeTime userId')
      .sort({ closeTime: -1 })
      .lean()

    // Group by draw number and count unique participants
    const drawMap = new Map<
      number,
      {
        drawComment: string
        closeTime: Date
        participants: Set<string>
      }
    >()

    bongs.forEach((bong: any) => {
      if (!drawMap.has(bong.drawNumber)) {
        drawMap.set(bong.drawNumber, {
          drawComment: bong.drawComment,
          closeTime: bong.closeTime,
          participants: new Set(),
        })
      }
      drawMap.get(bong.drawNumber)!.participants.add(bong.userId.toString())
    })

    // Convert to array and add metadata
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
        canGenerate: data.participants.size >= 2, // Need at least 2 members to generate
      })
    )

    // Sort by close time (newest first)
    draws.sort(
      (a, b) =>
        new Date(b.closeTime).getTime() - new Date(a.closeTime).getTime()
    )

    return draws
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Ett fel uppstod vid hämtning av omgångar',
    })
  }
})
