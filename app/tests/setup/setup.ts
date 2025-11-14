import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { mockSupabase } from '~/tests/mocks/supabase.mock'

export const supabaseMock = mockSupabase()

mockNuxtImport('useSupabaseClient', () => () => supabaseMock.mockClient)