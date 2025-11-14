// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    typescript: { typeCheck: true },
    modules: [
      //'@nuxt/content',
      '@nuxt/eslint',
      '@nuxt/image',
      '@nuxt/scripts',
      '@nuxt/test-utils/module',
      '@nuxt/ui',
      '@pinia/nuxt',
      '@nuxtjs/i18n',
      '@nuxtjs/supabase'
    ],
    css: [ 
        '~/assets/css/main.css'
    ],
    runtimeConfig: {
        public: {
            apiUrl: process.env.PUBLIC_API_URL,
            supabaseUrl: process.env.SUPABASE_URL,
            supabasePublishableKey: process.env.SUPABASE_KEY,
        }
    },
    supabase: {
        redirect: true,
        redirectOptions: {
            login: '/login',
            callback: '/confirm',
            saveRedirectToCookie: true
        }
    },
    i18n: {
        locales: [
            { code: 'en', language: 'en-US' },
        ],
        defaultLocale: 'en',
    }
})