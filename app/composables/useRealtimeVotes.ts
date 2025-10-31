import type {Database} from '~/types/supabase'

export const useRealtimeVotes = (callback: (vote: Database['public']['Tables']['votes']['Row']) => void) => {
    const supabase = useSupabaseClient<Database>()

    return supabase
        .channel('realtime:votes')
        .on(
            'postgres_changes',
            {event: 'INSERT', schema: 'public', table: 'votes'},
            (payload) => {
                callback(payload.new as Database['public']['Tables']['votes']['Row'])
            }
        )
        .subscribe()
}