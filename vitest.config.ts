import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
    test: {
        environment: 'nuxt',
        include: ['app/tests/**/*.{spec,test}.ts'],
        exclude: ['**/node_modules/**', '**/dist/**'],
    },
})