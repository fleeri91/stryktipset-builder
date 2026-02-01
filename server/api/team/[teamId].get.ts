import { Types } from 'mongoose'

import type { TeamRoot } from '~~/shared/types/team'

interface TeamCheckDocument {
  _id: unknown
  owner: { toString(): string }
  members: Array<{
    userId: { toString(): string }
  }>
}

interface PopulatedTeamDocument {
  _id: { toString(): string }
  name: string
  owner: {
    _id: { toString(): string }
    name: string
    email: string
  }
  members: Array<{
    userId: {
      _id: { toString(): string }
      name: string
      email: string
    }
    joinedAt: Date
  }>
  joinRequests?: Array<{
    userId: { toString(): string }
    status: 'pending' | 'accepted' | 'rejected'
  }>
  createdAt: Date
  updatedAt: Date
}

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
    const teamCheck = await Team.findById(teamId).lean<TeamCheckDocument>()

    if (!teamCheck) {
      throw createError({
        statusCode: 404,
        message: 'Laget hittades inte',
      })
    }

    const userId = session.user.id.toString()
    const isOwner = teamCheck.owner.toString() === userId
    const isMember = teamCheck.members.some(
      (member) => member.userId.toString() === userId
    )

    let query = Team.findById(teamId).populate('owner', 'name email')

    if (isOwner || isMember) {
      query = query.populate('members.userId', 'name email')
    }

    const team = await query.lean<PopulatedTeamDocument>()

    if (!team) {
      throw createError({
        statusCode: 404,
        message: 'Laget hittades inte',
      })
    }

    const hasPendingRequest = team.joinRequests?.some(
      (req) => req.userId.toString() === userId && req.status === 'pending'
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
          ? team.members.map((member) => ({
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
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Ett fel uppstod vid hämtning av laget',
    })
  }
})
