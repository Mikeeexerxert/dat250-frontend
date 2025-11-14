import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { supabaseMock } from '../setup/setup'

describe('usePollStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia())

        supabaseMock.fromFn.mockReset()
        supabaseMock.selectFn.mockReset()
        supabaseMock.orderFn.mockReset()

        supabaseMock.selectFn.mockReturnValue({ order: supabaseMock.orderFn })
        supabaseMock.fromFn.mockReturnValue({ select: supabaseMock.selectFn })
    })

    it('fetches polls successfully', async () => {
        const mockData = [{ id: 1, question: 'Poll 1', vote_options: [] }]
        supabaseMock.orderFn.mockResolvedValue({ data: mockData, error: null })

        const store = usePollStore()
        await store.fetchPolls()

        expect(store.loading).toBe(false)
        expect(store.polls).toEqual(mockData)
    })

    it('handles supabase error', async () => {
        supabaseMock.orderFn.mockResolvedValue({ data: null, error: { message: 'Failed' } })

        const store = usePollStore()
        await store.fetchPolls()

        expect(store.loading).toBe(false)
        expect(store.polls).toEqual([])
    })

    it('sets loading state correctly', async () => {
        let resolveOrder: (value: any) => void

        supabaseMock.orderFn.mockImplementation(
            () =>
                new Promise(resolve => {
                    resolveOrder = resolve
                })
        )

        const store = usePollStore()
        const fetchPromise = store.fetchPolls()
        expect(store.loading).toBe(true)

        resolveOrder!({ data: [{ id: 1, question: 'Poll 1', vote_options: [] }], error: null })
        await fetchPromise

        expect(store.loading).toBe(false)
        expect(store.polls).toEqual([{ id: 1, question: 'Poll 1', vote_options: [] }])
    })
})