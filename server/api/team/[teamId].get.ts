import type { TeamRoot } from '~~/shared/types/Team'
import { Types } from 'mongoose'

export default defineEventHandler(async (event): Promise<TeamRoot> => {
  const session = await requireUserSession(event)
  const teamId = getRouterParam(event, 'teamId') // Changed from 'id' to 'teamId'

  if (!teamId) {
    throw createError({
      statusCode: 400,
      message: 'Lag-ID saknas',
    })
  }

  // Validate that teamId is a valid MongoDB ObjectId
  if (!Types.ObjectId.isValid(teamId)) {
    throw createError({
      statusCode: 404,
      message: 'Laget hittades inte',
    })
  }

  try {
    // First fetch without population to check permissions
    const teamCheck: any = await Team.findById(teamId).lean()

    if (!teamCheck) {
      throw createError({
        statusCode: 404,
        message: 'Laget hittades inte',
      })
    }

    // Check if user has access to this team (is owner or member)
    const userId = session.user.id.toString()
    const isOwner = teamCheck.owner.toString() === userId
    const isMember = teamCheck.members.some(
      (member: any) => member.userId.toString() === userId
    )

    if (!isOwner && !isMember) {
      throw createError({
        statusCode: 403,
        message: 'Du har inte behörighet att se detta lag',
      })
    }

    // Now fetch with population for the response
    const team: any = await Team.findById(teamId)
      .populate('owner', 'name email')
      .populate('members.userId', 'name email')
      .lean()

    // Transform the response to a cleaner structure
    return {
      _id: team._id.toString(),
      name: team.name,
      owner: {
        _id: team.owner._id.toString(),
        name: team.owner.name,
        email: team.owner.email,
      },
      members: team.members.map((member: any) => ({
        _id: member.userId._id.toString(),
        name: member.userId.name,
        email: member.userId.email,
        joinedAt: member.joinedAt.toISOString(),
      })),
      createdAt: team.createdAt.toISOString(),
      updatedAt: team.updatedAt.toISOString(),
    }
  } catch (error: any) {
    // Handle any unexpected errors
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Ett fel uppstod vid hämtning av laget',
    })
  }
})
