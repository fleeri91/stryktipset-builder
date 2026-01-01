type DelayedFetchOptions<T> = Parameters<typeof useFetch<T>>[1] & {
  delay?: number
}

export const useDelayedFetch = <T>(
  url: Parameters<typeof useFetch>[0],
  options?: DelayedFetchOptions<T>
) => {
  const { delay = 1000, ...fetchOptions } = options || {}

  return useFetch<T>(url, {
    ...fetchOptions,
    async onRequest(ctx) {
      await new Promise((resolve) => setTimeout(resolve, delay))
    },
  })
}
