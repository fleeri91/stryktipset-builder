export interface UserWithPassword {
  _id: { toString(): string }
  email: string
  name: string
  password: string
}

export interface UserDocument {
  _id: { toString(): string }
  email: string
  name: string
}

export interface UserUpdateData {
  name?: string
  email?: string
  password?: string
}
