export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  const { name } = await readBody(event)

  if (!name || name.trim().length === 0) {
    throw createError({
      statusCode: 400,
      message: 'Lagnamn är obligatoriskt',
    })
  }

  if (name.trim().length < 2) {
    throw createError({
      statusCode: 400,
      message: 'Lagnamnet måste innehålla minst 2 tecken',
    })
  }

  if (name.trim().length > 50) {
    throw createError({
      statusCode: 400,
      message: 'Lagnamnet får inte överstiga 50 tecken',
    })
  }

  try {
    const team = await Team.create({
      name: name.trim(),
      owner: session.user.id,
      members: [
        {
          userId: session.user.id,
          joinedAt: new Date(),
        },
      ],
    })

    return team
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code: number }).code === 11000
    ) {
      throw createError({
        statusCode: 400,
        message: 'Du har redan ett lag med detta namn',
      })
    }

    throw createError({
      statusCode: 500,
      message: 'Kunde inte skapa laget',
    })
  }
})
