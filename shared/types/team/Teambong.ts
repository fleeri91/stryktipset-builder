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

export interface TeamDocument {
  _id: unknown
  owner: { toString(): string }
  members: Array<{
    userId: { toString(): string }
  }>
}

export interface TeamBongDocument {
  drawNumber: number
  drawComment: string
  closeTime: Date
  userId: { toString(): string }
}

export interface TeamPopulatedBongDocument {
  _id: { toString(): string }
  userId: {
    _id: { toString(): string }
    name: string
  }
  drawNumber: number
  drawComment: string
  closeTime: Date
  predictions: unknown[]
  createdAt: Date
}

export interface TeamPopulatedDrawBong {
  _id: { toString(): string }
  userId: {
    _id: { toString(): string }
    name: string
    email: string
  }
  drawNumber: number
  drawComment: string
  closeTime: Date
  predictions: Array<{
    eventNumber: number
    outcome: string[]
    confidence: string
    description: string
  }>
  createdAt: Date
}
