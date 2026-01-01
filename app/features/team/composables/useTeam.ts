import type { TeamRoot } from '~~/shared/types/Team'

export const useTeam = (teamId: MaybeRef<string>) => {
  return useDelayedFetch<TeamRoot>(`/api/team/${unref(teamId)}`, {
    key: `team-${unref(teamId)}`,
  })
}
