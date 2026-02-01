import { Schema } from 'mongoose'

import { defineMongooseModel } from '#nuxt/mongoose'

interface PredictionValidation {
  eventNumber: number
}

export const EventBong = defineMongooseModel({
  name: 'EventBong',
  schema: {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    drawNumber: {
      type: Number,
      required: true,
    },
    drawComment: {
      type: String,
      required: true,
    },
    closeTime: {
      type: Date,
      required: true,
    },
    predictions: {
      type: [
        {
          eventNumber: {
            type: Number,
            required: true,
          },
          outcome: {
            type: [String],
            enum: ['1', 'X', '2'],
            required: true,
          },
          confidence: {
            type: String,
            enum: ['UNSURE', 'NEUTRAL', 'SAFE'],
            required: true,
          },
          description: {
            type: String,
            required: true,
          },
          sportEventId: {
            type: Number,
            required: true,
          },
        },
      ],
      required: true,
      validate: {
        validator: function (predictions: PredictionValidation[]) {
          const eventNumbers = predictions.map((p) => p.eventNumber)
          return eventNumbers.length === new Set(eventNumbers).size
        },
        message: 'Duplicate eventNumber found in predictions',
      },
    },
  },
  options: {
    timestamps: true,
  },
  hooks(schema) {
    schema.index({ closeTime: 1 })
    schema.index({ userId: 1 })
    schema.index({ userId: 1, drawNumber: 1 }, { unique: true })
  },
})
