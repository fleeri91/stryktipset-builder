export default defineNuxtPlugin(() => {
  globalThis.$fetch = $fetch.create({
    async onRequest({ options }) {
      await new Promise((resolve) => setTimeout(resolve, 300))
    },
  })
})
