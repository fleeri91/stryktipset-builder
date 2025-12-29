export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const teamId = getRouterParam(event, 'teamId')
  const requestId = getRouterParam(event, 'requestId')
  const userId = session.user.id.toString()

  const { action } = await readBody(event) // 'accept' or 'reject'

  if (!teamId || !requestId) {
    throw createError({
      statusCode: 400,
      message: 'Lag-ID eller förfrågnings-ID saknas',
    })
  }

  if (!['accept', 'reject'].includes(action)) {
    throw createError({
      statusCode: 400,
      message: 'Ogiltig åtgärd',
    })
  }

  try {
    const team: any = await Team.findById(teamId)

    if (!team) {
      throw createError({
        statusCode: 404,
        message: 'Laget hittades inte',
      })
    }

    // Only owner can accept/reject requests
    if (team.owner.toString() !== userId) {
      throw createError({
        statusCode: 403,
        message: 'Endast lagägaren kan hantera förfrågningar',
      })
    }

    const request = team.joinRequests?.find(
      (req: any) => req._id.toString() === requestId
    )

    if (!request) {
      throw createError({
        statusCode: 404,
        message: 'Förfrågan hittades inte',
      })
    }

    if (request.status !== 'pending') {
      throw createError({
        statusCode: 400,
        message: 'Förfrågan har redan hanterats',
      })
    }

    if (action === 'accept') {
      // Add user to members
      team.members.push({
        userId: request.userId,
        joinedAt: new Date(),
      })
      request.status = 'accepted'
    } else {
      request.status = 'rejected'
    }

    await team.save()

    return {
      message:
        action === 'accept' ? 'Användare tillagd i laget' : 'Förfrågan avvisad',
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Kunde inte hantera förfrågan',
    })
  }
})
