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
