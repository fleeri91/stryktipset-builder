import type { TeamListItem } from '~~/shared/types/Team'

export default defineEventHandler(async (event): Promise<TeamListItem[]> => {
  const session = await requireUserSession(event)
  const userId = session.user.id.toString()

  try {
    const teams: any = await Team.find({
      $or: [{ owner: userId }, { 'members.userId': userId }],
    })
      .populate('owner', 'name')
      .select('name owner members createdAt')
      .sort({ createdAt: -1 })
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
      message: 'Ett fel uppstod vid hämtning av dina lag',
    })
  }
})
