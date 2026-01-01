import type { EventRoot } from '~~/shared/types/SvenskaSpel/Event'
import type { TeamListItem } from '~~/shared/types/Team'
import { EventType } from '~~/shared/types/SvenskaSpel/EventType'

export const useEvent = (type: EventType) => {
  return useDelayedFetch<EventRoot>('/api/event', {
    query: { type },
    key: `event-${type}`,
  })
}

export const useAllEvents = () => {
  return useAsyncData('all-events', async () => {
    const [stryktipset, europatipset] = await Promise.all([
      $fetch<EventRoot>('/api/event', {
        query: { type: EventType.Stryktipset },
      }),
      $fetch<EventRoot>('/api/event', {
        query: { type: EventType.Europatipset },
      }),
    ])

    return {
      stryktipset,
      europatipset,
    }
  })
}

// This returns the composables for the page to await
export const useEventsWithTeamCheck = () => {
  const myTeamsResult = useDelayedFetch<TeamListItem[]>('/api/user/teams')

  return {
    myTeamsResult,
  }
}
