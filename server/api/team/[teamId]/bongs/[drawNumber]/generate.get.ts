import type { GeneratedBong } from '~~/server/utils/bong/types'
import { generateTeamBong } from '~~/server/services/teamBong/generateService'

export default defineEventHandler(async (event): Promise<GeneratedBong> => {
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
        message: 'Du måste vara medlem för att generera lagbong',
      })
    }

    // Generate the team bong
    const generatedBong = await generateTeamBong(teamId, drawNumberInt)

    return generatedBong
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    // Handle specific service errors
    if (error.message === 'Team not found') {
      throw createError({
        statusCode: 404,
        message: 'Laget hittades inte',
      })
    }

    if (error.message === 'No bongs found for this draw') {
      throw createError({
        statusCode: 404,
        message: 'Inga bongs hittades för denna omgång',
      })
    }

    throw createError({
      statusCode: 500,
      message: 'Ett fel uppstod vid generering av lagbong',
    })
  }
})
