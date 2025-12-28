import type { TeamListItem } from '~~/shared/types/Team'

export default defineEventHandler(async (event): Promise<TeamListItem[]> => {
  const session = await requireUserSession(event)

  // Get query parameters for pagination
  const query = getQuery(event)
  const limit = Number(query.limit) || 20
  const skip = Number(query.skip) || 0

  try {
    const teams: any = await Team.find()
      .populate('owner', 'name')
      .select('name owner members createdAt')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean()

    return teams.map((team: any) => ({
      _id: team._id.toString(),
      name: team.name,
      owner: {
        _id: team.owner._id.toString(),
        name: team.owner.name,
      },
      members: team.members.map((member: any) => ({
        _id: member.userId.toString(),
        name: '',
        email: '',
        joinedAt: member.joinedAt.toISOString(),
      })),
      memberCount: team.members.length,
      createdAt: team.createdAt.toISOString(),
    }))
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: 'Ett fel uppstod vid hämtning av lag',
    })
  }
})
