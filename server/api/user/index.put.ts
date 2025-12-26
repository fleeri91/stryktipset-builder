import { User } from '~~/server/models/user.model'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const body = await readBody(event)

  if (!body.name && !body.email && !body.newPassword) {
    throw createError({
      statusCode: 400,
      statusMessage: 'At least one field is required',
    })
  }

  if (body.email || body.newPassword) {
    if (!body.currentPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Current password required',
      })
    }

    const currentUser = await User.findById(user.id).select('+password')
    const isValid = await verifyPassword(
      (currentUser as any).password,
      body.currentPassword
    )

    if (!isValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Incorrect password',
      })
    }
  }

  const updateData: any = {}
  if (body.name) updateData.name = body.name.trim()
  if (body.email) updateData.email = body.email.toLowerCase().trim()
  if (body.newPassword)
    updateData.password = await hashPassword(body.newPassword)

  try {
    // Update user in DB
    const updatedUser = await User.findOneAndUpdate(
      { _id: user.id },
      updateData,
      { new: true }
    )

    if (!updatedUser) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found',
      })
    }

    // **Update the session with the new user data**
    await setUserSession(event, {
      user: {
        id: updatedUser._id.toString(),
        email: updatedUser.email,
        name: updatedUser.name,
      },
      loggedInAt: Date.now(),
    })

    return {
      user: {
        id: updatedUser._id.toString(),
        email: updatedUser.email,
        name: updatedUser.name,
      },
    }
  } catch (error) {
    console.error('User update error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update user',
    })
  }
})
