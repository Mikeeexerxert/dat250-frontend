import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

const USER_ID = '196aa192-937f-4f4d-90d6-3d326460b65d'
const POLL_ID = 16
const OPTION_ID = 7

const selectFn = vi.fn()
const insertFn = vi.fn(() => ({ select: selectFn }))
const fromFn = vi.fn(() => ({ insert: insertFn }))
const supabaseMock = { from: fromFn }

mockNuxtImport('useSupabaseClient', () => () => supabaseMock)
vi.mock('#imports', () => ({ useSupabaseClient: () => supabaseMock }))
vi.mock('#supabase', () => ({ useSupabaseClient: () => supabaseMock }))
vi.mock('#app', () => ({ useSupabaseClient: () => supabaseMock }))

describe('useVotes', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('casts vote successfully', async () => {
        const mockData = { id: 1, poll_id: POLL_ID, vote_option_id: OPTION_ID }

        selectFn.mockResolvedValue({ data: mockData, error: null })

        const { useVotes } = await import('~/composables/useVotes')
        const { castVote, loading, error } = useVotes()

        const { data } = await castVote(USER_ID, POLL_ID, OPTION_ID)

        expect(fromFn).toHaveBeenCalledWith('votes')

        expect(insertFn).toHaveBeenCalledWith(
            expect.objectContaining({
                user_id: USER_ID,
                poll_id: POLL_ID,
                vote_option_id: OPTION_ID
            })
        )

        expect(data).toEqual(mockData)
        expect(error.value).toBe(null)
        expect(loading.value).toBe(false)
    })

    it('handles insert error', async () => {
        selectFn.mockResolvedValue({
            data: null,
            error: { message: 'Insert failed' }
        })

        const { useVotes } = await import('~/composables/useVotes')
        const { castVote, error } = useVotes()

        await castVote(USER_ID, POLL_ID, OPTION_ID)

        expect(error.value).toBe('Insert failed')
    })
})