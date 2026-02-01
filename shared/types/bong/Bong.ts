import type { MongoId, MongoDate } from '../mongo'
import type { Prediction } from './Prediction'

export interface BongRoot {
  _id: MongoId
  userId: MongoId
  drawNumber: number
  drawComment: string
  closeTime: MongoDate
  predictions: Prediction[]
  createdAt: MongoDate
  updatedAt: MongoDate
  __v: number
}
