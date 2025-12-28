export interface TeamRoot {
  _id: string
  name: string
  owner: Owner
  members: Member[]
  createdAt: string
  updatedAt: string
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

export type TeamListItem = Omit<TeamRoot, 'updatedAt' | 'owner'> & {
  owner: Omit<Owner, 'email'>
  memberCount: number
}
