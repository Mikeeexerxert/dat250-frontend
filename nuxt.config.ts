// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    typescript: { typeCheck: true },
    modules: [
        '@nuxt/content',
        '@nuxt/eslint',
        '@nuxt/image',
        '@nuxt/scripts',
        '@nuxt/test-utils',
        '@nuxt/ui',
        '@pinia/nuxt',
        '@nuxtjs/i18n'
    ],
    css: [ 
        '~/assets/css/main.css'
    ],
    runtimeConfig: {
        public: {
            apiUrl: process.env.PUBLIC_API_URL || 'http://localhost:8000',
        }
    }
})