export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validate required fields
    if (!body?.email || !body?.name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email and name are required',
      })
    }

    // Create the user
    const user = await User.create({
      email: body.email,
      name: body.name,
    })

    // Return the created user
    return user
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error'

    return sendError(
      event,
      createError({ statusCode: 500, statusMessage: message })
    )
  }
})
