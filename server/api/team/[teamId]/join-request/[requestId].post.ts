interface TeamWithJoinRequests {
  _id: unknown
  owner: { toString(): string }
  members: Array<{
    userId: unknown
    joinedAt: Date
  }>
  joinRequests?: Array<{
    _id: { toString(): string }
    userId: unknown
    status: 'pending' | 'accepted' | 'rejected'
  }>
  save(): Promise<void>
}

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const teamId = getRouterParam(event, 'teamId')
  const requestId = getRouterParam(event, 'requestId')
  const userId = session.user.id.toString()

  const { action } = await readBody(event)

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
    const team = (await Team.findById(teamId)) as TeamWithJoinRequests | null

    if (!team) {
      throw createError({
        statusCode: 404,
        message: 'Laget hittades inte',
      })
    }

    if (team.owner.toString() !== userId) {
      throw createError({
        statusCode: 403,
        message: 'Endast lagägaren kan hantera förfrågningar',
      })
    }

    const request = team.joinRequests?.find(
      (req) => req._id.toString() === requestId
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
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Kunde inte hantera förfrågan',
    })
  }
})
