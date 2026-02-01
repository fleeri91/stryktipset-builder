import { Schema } from 'mongoose'

import { defineMongooseModel } from '#nuxt/mongoose'

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
    joinRequests: {
      type: [
        {
          userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          requestedAt: {
            type: Date,
            default: Date.now,
          },
          status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending',
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
    schema.index({ 'joinRequests.userId': 1 })
  },
})
