import type { TeamDraw } from '~~/shared/types/Team'

export const useTeamDraws = (teamId: string) => {
  return useFetch<TeamDraw[]>(`/api/team/${teamId}/bongs/draws`, {
    key: `team-draws-${teamId}`,
  })
}
