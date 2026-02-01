import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  pages: {
    pattern: ['**/*.vue', '!**/components/**'],
  },
  components: [
    '~/components',
    {
      path: '~/pages',
      pattern: '**/components/**',
      pathPrefix: false,
    },
  ],
  colorMode: {
    preference: 'dark',
  },
  modules: [
    'nuxt-mongoose',
    'shadcn-nuxt',
    'nuxt-auth-utils',
    '@nuxtjs/color-mode',
    '@nuxt/image',
    '@nuxt/eslint',
  ],
  mongoose: {
    uri: process.env.MONGODB_URI,
    options: {},
    modelsDir: 'models',
    devtools: true,
  },
  runtimeConfig: {
    svenskaSpelSecret: process.env.SVENSKA_SPEL_SECRET,
    public: {
      svenskaSpelBaseUrl: process.env.SVENSKA_SPEL_API_URL,
    },
  },
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  shadcn: {
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: '@/components/ui',
  },
})