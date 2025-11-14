import { vi } from 'vitest'

export const mockSupabase = (mockData = [], mockError: string | null = null) => {
    const selectFn = vi.fn().mockResolvedValue({
        data: mockError ? null : mockData,
        error: mockError,
    })

    const insertFn = vi.fn().mockReturnValue({
        select: selectFn
    })

    const orderFn = vi.fn().mockResolvedValue({
        data: mockError ? null : mockData,
        error: mockError,
    })

    const selectFetchFn = vi.fn().mockReturnValue({
        order: orderFn,
    })

    const fromFn = vi.fn().mockReturnValue({
        insert: insertFn,
        select: selectFetchFn,
        order: orderFn,
    })

    const subscribeFn = vi.fn()
    const onFn = vi.fn().mockReturnValue({ subscribe: subscribeFn })
    const channelFn = vi.fn().mockReturnValue({ on: onFn })

    return {
        mockClient: {
            from: fromFn,
            channel: channelFn,
        },

        fromFn,
        insertFn,
        selectFn,
        selectFetchFn,
        orderFn,
        channelFn,
        onFn,
        subscribeFn,
    }
}