<script setup lang="ts">
import type { Database } from '~/types/database.types'

const supabase = useSupabaseClient<Database>()
const route = useRoute()
const pollId = Number(route.params.id)
const poll = ref<any>(null)
const voteCounts = ref<Record<number, number>>({})
const userVotes = ref<number | null>(null)
const notification = ref<{ visible: boolean; message: string }>({ visible: false, message: '' })

let subscription: any = null
const subscribed = ref(false)

const showNotification = (msg: string) => {
  notification.value = { visible: true, message: msg }
  setTimeout(() => notification.value.visible = false, 3000)
}

const fetchPoll = async () => {
  const { data } = await supabase
      .from('polls')
      .select(`*, vote_options(*)`)
      .eq('id', pollId)
      .single()
  poll.value = data

  const { data: votes } = await supabase
      .from('votes')
      .select('vote_option_id, user_id')
      .eq('poll_id', pollId)

  const counts: Record<number, number> = {}
  const { data: { session } } = await supabase.auth.getSession()
  const userId = session?.user?.id

  votes?.forEach(v => {
    counts[v.vote_option_id] = (counts[v.vote_option_id] || 0) + 1
    if (v.user_id === userId) userVotes.value = v.vote_option_id
  })
  voteCounts.value = counts
}

const toggleVote = async (optionId: number) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return showNotification('❌ You must be logged in to vote!')
  if (userVotes.value === optionId) {
    const { error } = await supabase.from('votes')
        .delete()
        .eq('poll_id', pollId)
        .eq('user_id', user.id)
        .eq('vote_option_id', optionId)
    if (error) return showNotification(`❌ ${error.message || error}`)
    voteCounts.value[optionId] = (voteCounts.value[optionId] || 1) - 1
    userVotes.value = null
    showNotification('🗳️ Vote removed!')
  }
  else {
    if (userVotes.value) {
      await supabase.from('votes')
          .delete()
          .eq('poll_id', pollId)
          .eq('user_id', user.id)
          .eq('vote_option_id', userVotes.value)
      voteCounts.value[userVotes.value] = (voteCounts.value[userVotes.value] || 1) - 1
    }
    const { error } = await supabase.from('votes')
        .insert([{ poll_id: pollId, vote_option_id: optionId, user_id: user.id }])
    if (error) return showNotification(`❌ ${error.message || error}`)
    voteCounts.value[optionId] = (voteCounts.value[optionId] || 0) + 1
    userVotes.value = optionId
    showNotification('✅ Vote recorded!')
  }
}

const toggleSubscribe = () => {
  if (subscribed.value) {
    supabase.removeChannel(subscription)
    subscription = null
    subscribed.value = false
    showNotification('📴 Unsubscribed from live votes.')
  } else {
    subscription = supabase
        .channel('public:votes')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'votes',
          filter: `poll_id=eq.${pollId}`
        }, payload => {
          const optionId = payload.new.vote_option_id
          voteCounts.value[optionId] = (voteCounts.value[optionId] || 0) + 1
        })
        .on('postgres_changes', {
          event: 'DELETE',
          schema: 'public',
          table: 'votes',
          filter: `poll_id=eq.${pollId}`
        }, payload => {
          const optionId = payload.old.vote_option_id
          voteCounts.value[optionId] = (voteCounts.value[optionId] || 1) - 1
          if (userVotes.value === optionId) userVotes.value = null
        })
        .subscribe()
    subscribed.value = true
    showNotification('📡 Subscribed to live votes.')
  }
}

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return navigateTo('/login')

  await fetchPoll()
})

onBeforeUnmount(() => {
  if (subscription) supabase.removeChannel(subscription)
})
</script>
<template>
  <div class="p-6 min-h-screen bg-gray-50">
    <div v-if="!poll" class="text-center text-gray-500">Loading poll...</div>

    <div v-else class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-lg mx-auto">
      <h1 class="text-2xl font-bold mb-4">{{ poll.question }}</h1>

      <ul class="space-y-2">
        <li v-for="option in poll.vote_options" :key="option.id" class="flex justify-between items-center p-2 border rounded-lg hover:bg-gray-50 transition">
          <span>{{ option.caption }} — {{ voteCounts[option.id] || 0 }} votes</span>
          <button
              @click="toggleVote(option.id)"
              :class="userVotes === option.id ? 'bg-gray-500' : 'bg-blue-500'"
              class="text-white px-3 py-1.5 rounded hover:bg-blue-600 transition"
          >
            {{ userVotes === option.id ? 'Unvote' : 'Vote' }}
          </button>
        </li>
      </ul>

      <button @click="toggleSubscribe" class="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition">
        {{ subscribed ? 'Unsubscribe from Live Votes' : 'Subscribe to Live Votes' }}
      </button>
    </div>

    <transition name="fade">
      <div v-if="notification.visible" class="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium">
        {{ notification.message }}
      </div>
    </transition>
  </div>
</template>