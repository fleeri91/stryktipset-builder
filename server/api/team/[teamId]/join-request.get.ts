export default defineEventHandler(async (event) => {
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
    const team: any = await Team.findById(teamId)
      .populate('joinRequests.userId', 'name email')
      .lean()

    if (!team) {
      throw createError({
        statusCode: 404,
        message: 'Laget hittades inte',
      })
    }

    // Only owner can view join requests
    if (team.owner.toString() !== userId) {
      throw createError({
        statusCode: 403,
        message: 'Endast lagägaren kan se förfrågningar',
      })
    }

    const pendingRequests =
      team.joinRequests
        ?.filter((req: any) => req.status === 'pending')
        .map((req: any) => ({
          _id: req._id.toString(),
          user: {
            _id: req.userId._id.toString(),
            name: req.userId.name,
            email: req.userId.email,
          },
          requestedAt: req.requestedAt.toISOString(),
        })) || []

    return pendingRequests
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Kunde inte hämta förfrågningar',
    })
  }
})
