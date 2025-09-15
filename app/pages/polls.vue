<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '~/components/base/BaseButton.vue'
import PollCreateForm from '~/components/form/PollCreateForm.vue'
import PollVoteForm from '~/components/form/PollVoteForm.vue'

// stub data
const polls = [
  { id: 1, question: "What's your favorite language?", options: ["Java", "Kotlin", "Python"] },
  { id: 2, question: "Frontend framework of choice?", options: ["Vue", "React", "Svelte"] }
]

const showCreate = ref(false)
const votingPoll = ref<typeof polls[0] | null>(null)

function createPoll() {
  showCreate.value = true
}

function votePoll(poll: typeof polls[0]) {
  votingPoll.value = poll
}
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <h2 class="text-2xl font-semibold text-center">Available Polls</h2>

    <div v-for="poll in polls" :key="poll.id" class="p-4 border rounded-xl shadow-sm bg-white">
      <h3 class="text-lg font-medium">{{ poll.question }}</h3>
      <ul class="text-gray-600 ml-4 list-disc">
        <li v-for="option in poll.options" :key="option">{{ option }}</li>
      </ul>
      <div class="mt-4 flex gap-2">
        <BaseButton label="Vote" variant="secondary" @click="votePoll(poll)" />
      </div>
    </div>

    <div class="text-center">
      <BaseButton label="Create New Poll" @click="createPoll" />
    </div>

    <!-- Modals -->
    <PollCreateForm v-if="showCreate" @close="showCreate = false" />
    <PollVoteForm v-if="votingPoll" :poll="votingPoll" @close="votingPoll = null" />
  </div>
</template>
