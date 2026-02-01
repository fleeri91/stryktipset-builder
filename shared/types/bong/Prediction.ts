import type { MongoId } from '../mongo'

export interface Prediction {
  eventNumber: number
  outcome: string
  confidence: string
  description: string
  sportEventId: number
  _id: MongoId
}
