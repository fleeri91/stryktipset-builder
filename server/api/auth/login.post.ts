import { z } from 'zod'
import { User } from '../../models/user.model'

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await readValidatedBody(event, bodySchema.parse)

    const user = await User.findOne({
      email: email.toLowerCase(),
    })
      .select('+password')
      .lean()

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Ogiltiga inloggningsuppgifter',
      })
    }

    const isValidPassword = await verifyPassword(user.password, password)

    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Ogiltiga inloggningsuppgifter',
      })
    }

    await setUserSession(event, {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
      loggedInAt: Date.now(),
    })

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    }
  } catch (err: any) {
    if (err.statusCode) {
      throw err
    }

    console.error('Login error:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Ett fel uppstod vid inloggning',
    })
  }
})
