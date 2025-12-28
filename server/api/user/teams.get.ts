export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const userId = session.user.id.toString()

  const teamCount = await Team.countDocuments({
    $or: [{ owner: userId }, { 'members.userId': userId }],
  })

  return { hasTeams: teamCount > 0 }
})
