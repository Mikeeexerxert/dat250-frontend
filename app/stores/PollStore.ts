import type { Database } from '~/types/database.types'

export const usePollStore = defineStore('polls', () => {
    const polls = ref<
        (Database['public']['Tables']['polls']['Row'] & {
            vote_options?: Database['public']['Tables']['vote_options']['Row'][]
        })[]
    >([])
    const loading = ref(false)
    const supabase = useSupabaseClient<Database>()

    const fetchPolls = async () => {
        loading.value = true
        const { data, error } = await supabase
            .from('polls')
            .select('*, vote_options(*)')
            .order('published_at', { ascending: false })
        if (error) {
            console.error(error.message)
            polls.value = []
        }
        else {
            polls.value = data || []
        }
        loading.value = false
    }
    return { polls, loading, fetchPolls }
})