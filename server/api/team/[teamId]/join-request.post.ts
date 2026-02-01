import type { TeamWithJoinRequestsMutable } from '~~/shared/types/team'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const teamId = getRouterParam(event, 'teamId')
  const userId = session.user.id

  if (!teamId) {
    throw createError({
      statusCode: 400,
      message: 'Lag-ID saknas',
    })
  }

  try {
    const team = (await Team.findById(
      teamId
    )) as TeamWithJoinRequestsMutable | null

    if (!team) {
      throw createError({
        statusCode: 404,
        message: 'Laget hittades inte',
      })
    }

    const isMember = team.members.some(
      (member) =>
        (member.userId as { toString(): string }).toString() === userId
    )

    if (isMember) {
      throw createError({
        statusCode: 400,
        message: 'Du är redan medlem i detta lag',
      })
    }

    const hasPendingRequest = team.joinRequests?.some(
      (req) =>
        (req.userId as { toString(): string }).toString() === userId &&
        req.status === 'pending'
    )

    if (hasPendingRequest) {
      throw createError({
        statusCode: 400,
        message: 'Du har redan en väntande förfrågan',
      })
    }

    team.joinRequests = team.joinRequests || []
    team.joinRequests.push({
      userId,
      requestedAt: new Date(),
      status: 'pending',
    })

    await team.save()

    return {
      message: 'Förfrågan skickad',
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Kunde inte skicka förfrågan',
    })
  }
})
