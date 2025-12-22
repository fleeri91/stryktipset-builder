export interface BongRoot {
  _id: Id
  userId: UserId
  drawNumber: number
  drawComment: string
  closeTime: CloseTime
  predictions: Prediction[]
  createdAt: CreatedAt
  updatedAt: UpdatedAt
  __v: number
}

export interface Id {
  $oid: string
}

export interface UserId {
  $oid: string
}

export interface CloseTime {
  $date: string
}

export interface Prediction {
  eventNumber: number
  outcome: string
  confidence: string
  description: string
  sportEventId: number
  _id: Id
}

export interface CreatedAt {
  $date: string
}

export interface UpdatedAt {
  $date: string
}
