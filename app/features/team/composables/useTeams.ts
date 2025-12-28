import type { TeamListItem } from '~~/shared/types/Team'

export const useTeams = () => {
  return useFetch<TeamListItem[]>('/api/team', {
    key: 'all-teams',
  })
}

export const useMyTeams = () => {
  return useFetch<TeamListItem[]>('/api/user/teams', {
    key: 'my-teams',
  })
}

export const useExploreTeams = () => {
  const { data: myTeams } = useMyTeams()
  const { data: allTeams, pending, error } = useTeams()

  const exploreTeams = computed(() => {
    if (!allTeams.value || !myTeams.value) return allTeams.value || []

    const myTeamIds = new Set(myTeams.value.map((team) => team._id))
    return allTeams.value.filter((team) => !myTeamIds.has(team._id))
  })

  return {
    data: exploreTeams,
    pending,
    error,
  }
}
