import type { Owner } from './Owner'
import type { Member } from './Member'

export interface TeamRoot {
  _id: string
  name: string
  owner: Owner
  members: Member[]
  memberCount: number
  createdAt: string
  updatedAt: string
  // Metadata
  isOwner?: boolean
  isMember?: boolean
  hasPendingRequest?: boolean
}

export interface TeamLean {
  _id: string
  members: {
    userId: {
      toString(): string
    }
  }[]
}

export type TeamListItem = Omit<TeamRoot, 'updatedAt' | 'owner'> & {
  owner: Omit<Owner, 'email'>
  memberCount: number
}
