import { defineMongooseModel } from '#nuxt/mongoose'
import { Schema } from 'mongoose'

export const Team = defineMongooseModel({
  name: 'Team',
  schema: {
    name: {
      type: 'string',
      required: true,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: {
      type: [
        {
          userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          joinedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
  },
  options: {
    timestamps: true,
  },
  hooks(schema) {
    schema.index({ owner: 1 })
    schema.index({ 'members.userId': 1 })
  },
})
