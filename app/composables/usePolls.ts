import type { Database } from '~/types/supabase'

export const usePolls = () => {
    const polls = ref<
        (Database['public']['Tables']['polls']['Row'] & {
            vote_options?: Database['public']['Tables']['vote_options']['Row'][]
        })[]
    >([])
    const loading = ref(false)
    const error = ref<string | null>(null)
    const supabase = useSupabaseClient<Database>()

    const fetchPolls = async () => {
        loading.value = true
        error.value = null
        const { data, error: err } = await supabase
            .from('polls')
            .select('*, vote_options(*)')
            .order('published_at', { ascending: false })
        if (err) {
            error.value = err.message
            polls.value = []
        }
        else {
            polls.value = data || []
        }
        loading.value = false
    }
    return { polls, fetchPolls, loading, error }
}