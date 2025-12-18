import { defineMongooseModel } from '#nuxt/mongoose'

export const User = defineMongooseModel({
  name: 'User',
  schema: {
    email: {
      type: 'string',
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: 'string',
      required: true,
      trim: true,
    },
    password: {
      type: 'string',
      required: true,
      select: false,
    },
  },
  options: {
    timestamps: true,
  },
})
