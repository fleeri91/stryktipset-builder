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

export interface Owner {
  _id: string
  name: string
  email: string
}

export interface Member {
  _id: string
  name: string
  email: string
  joinedAt: string
}

export interface JoinRequest {
  _id: string
  user: {
    _id: string
    name: string
    email: string
  }
  requestedAt: string
}

export type TeamListItem = Omit<TeamRoot, 'updatedAt' | 'owner'> & {
  owner: Omit<Owner, 'email'>
  memberCount: number
}

// Team Bongs - Summary view for recent activity
export interface TeamBong {
  _id: string
  userId: string
  userName: string
  drawNumber: number
  drawComment: string
  closeTime: string
  predictionsCount: number
  createdAt: string
}

// Team Draw Bong - Detailed view for specific draw comparison
export interface TeamDrawBong {
  _id: string
  user: {
    _id: string
    name: string
    email: string
  }
  drawNumber: number
  drawComment: string
  closeTime: string
  predictions: TeamBongPrediction[]
  createdAt: string
}

export interface TeamBongPrediction {
  eventNumber: number
  outcome: string[]
  confidence: string
  description: string
}
