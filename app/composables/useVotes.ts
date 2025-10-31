import type { Database } from '~/types/supabase'

export const useVotes = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)
    const supabase = useSupabaseClient<Database>()

    const castVote = async (userId: string, pollId: number, optionId: number) => {
        loading.value = true
        error.value = null
        const { data, error: err } = await supabase
            .from('votes')
            .insert({
                user_id: userId,
                poll_id: pollId,
                vote_option_id: optionId,
                published_at: new Date().toISOString()
            } as Database['public']['Tables']['votes']['Insert'])
            .select()
        if (err) error.value = err.message
        loading.value = false
        return { data, error: err }
    }
    return { castVote, loading, error }
}