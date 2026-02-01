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

export interface PopulatedJoinRequest {
  _id: { toString(): string }
  userId: {
    _id: { toString(): string }
    name: string
    email: string
  }
  requestedAt: Date
  status: 'pending' | 'accepted' | 'rejected'
}

export interface TeamWithJoinRequests {
  _id: unknown
  owner: { toString(): string }
  members: Array<{
    userId: { toString(): string }
    joinedAt: Date
  }>
  joinRequests?: Array<{
    _id: { toString(): string }
    userId: { toString(): string }
    requestedAt: Date
    status: 'pending' | 'accepted' | 'rejected'
  }>
  save(): Promise<void>
}

export interface TeamWithJoinRequestsMutable {
  _id: unknown
  owner: { toString(): string }
  members: Array<{
    userId: unknown
    joinedAt: Date
  }>
  joinRequests?: Array<{
    _id?: { toString(): string }
    userId: unknown
    requestedAt: Date
    status: 'pending' | 'accepted' | 'rejected'
  }>
  save(): Promise<void>
}
