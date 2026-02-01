import { z } from 'zod'
import { User } from '~~/server/models/user.model'

const bodySchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
})

export default defineEventHandler(async (event) => {
  try {
    const { email, name, password } = await readValidatedBody(
      event,
      bodySchema.parse
    )

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User already exists',
      })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      name,
      password: hashedPassword,
    })

    // Set session
    await setUserSession(event, {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
      loggedInAt: Date.now(),
    })

    return {
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    }
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    })
  }
})
