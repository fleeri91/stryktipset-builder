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
    const team: any = await Team.findById(teamId)

    if (!team) {
      throw createError({
        statusCode: 404,
        message: 'Laget hittades inte',
      })
    }

    // Check if user is already a member
    const isMember = team.members.some(
      (member: any) => member.userId.toString() === userId
    )

    if (isMember) {
      throw createError({
        statusCode: 400,
        message: 'Du är redan medlem i detta lag',
      })
    }

    // Check if user already has a pending request
    const hasPendingRequest = team.joinRequests?.some(
      (req: any) => req.userId.toString() === userId && req.status === 'pending'
    )

    if (hasPendingRequest) {
      throw createError({
        statusCode: 400,
        message: 'Du har redan en väntande förfrågan',
      })
    }

    // Add join request
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
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Kunde inte skicka förfrågan',
    })
  }
})
