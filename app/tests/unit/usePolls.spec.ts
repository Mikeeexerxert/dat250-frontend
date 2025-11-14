import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

const mockData = [
    {
        id: 16,
        question: 'test',
        published_at: '2025-11-14T00:00:00Z',
        valid_until: '2025-11-21T00:00:00Z',
        created_by: 'test-user',
        created_at: '2025-11-14T00:00:00Z',
        updated_at: '2025-11-14T00:00:00Z',
        vote_options: [
            { id: 7, caption: 'test1', poll_id: 16, presentation_order: 0 },
            { id: 8, caption: 'test2', poll_id: 16, presentation_order: 1 },
            { id: 9, caption: 'test3', poll_id: 16, presentation_order: 2 }
        ]
    }
]

const orderFn = vi.fn().mockResolvedValue({ data: mockData, error: null })
const selectFn = vi.fn(() => ({ order: orderFn }))
const fromFn = vi.fn(() => ({ select: selectFn }))
const supabaseMock = { from: fromFn }

mockNuxtImport('useSupabaseClient', () => () => supabaseMock)

vi.mock('#imports', () => ({
    useSupabaseClient: () => supabaseMock
}))
vi.mock('#app', () => ({
    useSupabaseClient: () => supabaseMock
}))
vi.mock('#supabase', () => ({
    useSupabaseClient: () => supabaseMock
}))

describe('usePolls', () => {
    beforeEach(() => vi.clearAllMocks())

    it('fetches only the test poll successfully', async () => {
        const { usePolls } = await import('~/composables/usePolls')
        const { polls, fetchPolls } = usePolls()

        await fetchPolls()

        expect(fromFn).toHaveBeenCalledWith('polls')
        expect(selectFn).toHaveBeenCalledWith('*, vote_options(*)')

        const testPoll = polls.value.find(p => p.id === 16)
        if (!testPoll) throw new Error("Expected poll with id 16")

        const mockRow = mockData[0]!

        expect(testPoll).toMatchObject({
            id: mockRow.id,
            question: mockRow.question,
            vote_options: mockRow.vote_options
        })
    })
})