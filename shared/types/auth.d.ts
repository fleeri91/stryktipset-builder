// types/auth.d.ts
// This extends the nuxt-auth-utils User interface with your custom properties

declare module '#auth-utils' {
  interface User {
    id: string
    email: string
    name: string
  }

  interface UserSession {
    // Add any additional session properties here if needed
  }
}

export {}
