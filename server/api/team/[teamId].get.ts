import type { TeamRoot } from '~~/shared/types/Team'
import { Types } from 'mongoose'

export default defineEventHandler(async (event): Promise<TeamRoot> => {
  const session = await requireUserSession(event)
  const teamId = getRouterParam(event, 'teamId')

  if (!teamId) {
    throw createError({
      statusCode: 400,
      message: 'Lag-ID saknas',
    })
  }

  if (!Types.ObjectId.isValid(teamId)) {
    throw createError({
      statusCode: 404,
      message: 'Laget hittades inte',
    })
  }

  try {
    // First fetch: check existence + permissions
    const teamCheck: any = await Team.findById(teamId).lean()

    if (!teamCheck) {
      throw createError({
        statusCode: 404,
        message: 'Laget hittades inte',
      })
    }

    const userId = session.user.id.toString()
    const isOwner = teamCheck.owner.toString() === userId
    const isMember = teamCheck.members.some(
      (member: any) => member.userId.toString() === userId
    )

    // Second fetch: populate conditionally
    let query = Team.findById(teamId).populate('owner', 'name email')

    if (isOwner || isMember) {
      query = query.populate('members.userId', 'name email')
    }

    const team: any = await query.lean()

    // Pending join request check
    const hasPendingRequest = team.joinRequests?.some(
      (req: any) => req.userId.toString() === userId && req.status === 'pending'
    )

    return {
      _id: team._id.toString(),
      name: team.name,
      owner: {
        _id: team.owner._id.toString(),
        name: team.owner.name,
        email: isOwner || isMember ? team.owner.email : '',
      },
      members:
        isOwner || isMember
          ? team.members.map((member: any) => ({
              _id: member.userId._id.toString(),
              name: member.userId.name,
              email: member.userId.email,
              joinedAt: member.joinedAt.toISOString(),
            }))
          : [],
      memberCount: team.members?.length ?? 0,
      createdAt: team.createdAt.toISOString(),
      updatedAt: team.updatedAt.toISOString(),
      isOwner,
      isMember,
      hasPendingRequest,
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Ett fel uppstod vid hämtning av laget',
    })
  }
})
