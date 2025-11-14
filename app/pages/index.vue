<script setup lang="ts">
import type { Database } from '~/types/database.types'

const supabase = useSupabaseClient<Database>()
const { polls, fetchPolls, loading } = usePolls()
const redirectInfo = useSupabaseCookieRedirect()
const redirectTo = redirectInfo.pluck() || '/login'

const showCreateModal = ref(false)
const newPollQuestion = ref('')
const newOptions = ref(['', ''])
const notification = ref<{ visible: boolean; message: string }>({ visible: false, message: '' })

const voteCounts = ref<Record<number, number>>({})
const userVotes = ref<Record<number, number>>({})

const showNotification = (message: string) => {
  notification.value = { visible: true, message }
  setTimeout(() => (notification.value.visible = false), 3000)
}

const fetchVotes = async (userId: string) => {
  const { data: votes } = await supabase.from('votes').select('poll_id, vote_option_id')
  const counts: Record<number, number> = {}
  votes?.forEach(v => counts[v.vote_option_id] = (counts[v.vote_option_id] || 0) + 1)
  voteCounts.value = counts

  const { data: myVotes } = await supabase.from('votes').select('poll_id, vote_option_id').eq('user_id', userId)
  const myVoteMap: Record<number, number> = {}
  myVotes?.forEach(v => myVoteMap[v.poll_id] = v.vote_option_id)
  userVotes.value = myVoteMap
}

const toggleVote = async (pollId: number, optionId: number) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return showNotification('❌ You must be logged in to vote!')

  const currentVote = userVotes.value[pollId]

  if (currentVote === optionId) {
    await supabase.from('votes').delete().eq('poll_id', pollId).eq('user_id', user.id).eq('vote_option_id', optionId)
    voteCounts.value[optionId] = (voteCounts.value[optionId] || 1) - 1
    delete userVotes.value[pollId]
    showNotification('🗳️ Vote removed!')
  }
  else {
    if (currentVote) {
      await supabase.from('votes').delete().eq('poll_id', pollId).eq('user_id', user.id).eq('vote_option_id', currentVote)
      voteCounts.value[currentVote] = (voteCounts.value[currentVote] || 1) - 1
    }
    await supabase.from('votes').insert([{ poll_id: pollId, vote_option_id: optionId, user_id: user.id }])
    voteCounts.value[optionId] = (voteCounts.value[optionId] || 0) + 1
    userVotes.value[pollId] = optionId
    showNotification('✅ Vote recorded!')
  }
}

const handleCreatePoll = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return showNotification('❌ You must be logged in to create a poll.')
  if (!newPollQuestion.value.trim()) return showNotification('❌ Please enter a poll question.')

  const validOptions = newOptions.value.filter(o => o.trim() !== '')
  if (validOptions.length < 2) return showNotification('❌ Add at least two options.')

  const { data: pollData } = await supabase.from('polls')
      .insert([{
        question: newPollQuestion.value,
        published_at: new Date().toISOString(),
        created_by: user.id,
        valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }])
      .select('id')
      .single()

  if (!pollData?.id) return showNotification('❌ Failed to create poll.')

  await supabase.from('vote_options').insert(validOptions.map((caption, index) => ({
    poll_id: pollData.id,
    caption,
    presentation_order: index,
    created_at: new Date().toISOString()
  })))

  showNotification('✅ Poll created successfully!')
  showCreateModal.value = false
  newPollQuestion.value = ''
  newOptions.value = ['', '']
  await fetchPolls()
}

const subscribeVotes = () => {
  const subscription = supabase.channel('public:votes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes' }, payload => {
        voteCounts.value[payload.new.vote_option_id] = (voteCounts.value[payload.new.vote_option_id] || 0) + 1
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'votes' }, payload => {
        voteCounts.value[payload.old.vote_option_id] = (voteCounts.value[payload.old.vote_option_id] || 1) - 1
      })
      .subscribe()

  onBeforeUnmount(() => supabase.removeChannel(subscription))
}

const initPage = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return navigateTo(redirectTo)
  const userId = session.user.id
  await fetchPolls()
  await fetchVotes(userId)
  subscribeVotes()
}

onMounted(initPage)
</script>
<template>
  <div class="min-h-screen bg-gray-50 p-6 relative">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Active Polls</h1>
      <button
          class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          @click="showCreateModal = true"
      >
        + New Poll
      </button>
    </div>

    <!-- Loading & Empty -->
    <div v-if="loading" class="text-center text-gray-500">Loading polls...</div>
    <div v-else-if="!polls.length" class="text-center text-gray-500 italic">No polls available.</div>

    <!-- Poll List -->
    <div v-else class="space-y-6">
      <div v-for="poll in polls" :key="poll.id" class="bg-white rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100 p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-800">{{ poll.question }}</h2>
          <NuxtLink :to="`/polls/${poll.id}`" class="text-blue-600 hover:underline text-sm">View →</NuxtLink>
        </div>
        <ul class="space-y-2">
          <li
              v-for="option in poll.vote_options"
              :key="option.id"
              class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
          >
            <span class="text-gray-700">{{ option.caption }} — {{ voteCounts[option.id] || 0 }} votes</span>
            <button
                @click="toggleVote(poll.id, option.id)"
                :class="userVotes[poll.id] === option.id ? 'bg-gray-500' : 'bg-blue-500'"
                class="text-white px-3 py-1.5 rounded hover:bg-blue-600 transition"
            >
              {{ userVotes[poll.id] === option.id ? 'Unvote' : 'Vote' }}
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Notification Popup -->
    <transition name="fade">
      <div v-if="notification.visible" class="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium">
        {{ notification.message }}
      </div>
    </transition>

    <!-- Create Poll Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 class="text-xl font-bold mb-4 text-gray-800">Create a New Poll</h2>
        <input v-model="newPollQuestion" placeholder="Poll question" class="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-blue-500 outline-none" />
        <div class="space-y-2 mb-2">
          <div v-for="(opt, i) in newOptions" :key="i" class="flex items-center gap-2">
            <input v-model="newOptions[i]" placeholder="Option" class="flex-1 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
            <button v-if="newOptions.length > 2" @click="newOptions.splice(i, 1)" class="text-red-500 hover:text-red-600">✕</button>
          </div>
        </div>
        <button class="text-blue-600 hover:text-blue-700 font-medium text-sm" @click="newOptions.push('')">+ Add Option</button>
        <div class="mt-5 flex justify-end gap-3">
          <button class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition" @click="showCreateModal = false">Cancel</button>
          <button class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition" @click="handleCreatePoll">Create</button>
        </div>
      </div>
    </div>
  </div>
</template>