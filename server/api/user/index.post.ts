export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body?.email || !body?.name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email and name are required',
      })
    }

    const user = await User.create({
      email: body.email,
      name: body.name,
    })

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
