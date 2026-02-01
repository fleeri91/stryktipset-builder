import { useTeamDraws } from './useTeamDraws'

import type { TeamRoot } from '~~/shared/types/Team'

export const useTeamPage = (teamId: string) => {
  const {
    data: team,
    error,
    pending,
  } = useDelayedFetch<TeamRoot>(`/api/team/${teamId}`)

  const shouldFetchDraws = computed(
    () => team.value?.isMember || team.value?.isOwner
  )

  const { data: draws, pending: drawsPending } = shouldFetchDraws.value
    ? useTeamDraws(teamId)
    : { data: ref([]), pending: ref(false) }

  const errorMessage = computed(
    () => (error.value as { message?: string })?.message || 'Okänt fel'
  )

  const membersWithFormattedDate = computed(() => {
    return (
      team.value?.members?.map((member) => ({
        ...member,
        joinedAtFormatted: new Date(member.joinedAt).toLocaleDateString(
          'sv-SE',
          {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }
        ),
      })) || []
    )
  })

  const isNonMember = computed(
    () => !team.value?.isMember && !team.value?.isOwner
  )

  const isMemberOrOwner = computed(
    () => team.value?.isMember || team.value?.isOwner
  )

  return {
    team,
    error,
    pending,
    errorMessage,
    draws,
    drawsPending,
    membersWithFormattedDate,
    isNonMember,
    isMemberOrOwner,
  }
}
