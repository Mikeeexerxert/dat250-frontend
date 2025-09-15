<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  poll: { id: number; question: string; options: string[] }
}>()

const emit = defineEmits<(e: 'close') => void>()

const selected = ref<string | null>(null)

function submit() {
  console.log("Vote cast:", { pollId: props.poll.id, choice: selected.value })
  emit("close")
}
</script>

<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center">
    <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-semibold mb-4">{{ poll.question }}</h2>

      <div v-for="opt in poll.options" :key="opt" class="mb-2">
        <label class="flex items-center gap-2">
          <input type="radio" v-model="selected" :value="opt" />
          {{ opt }}
        </label>
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <button @click="emit('close')" class="px-4 py-2 rounded bg-gray-200">Cancel</button>
        <button @click="submit" class="px-4 py-2 rounded bg-blue-600 text-white">Vote</button>
      </div>
    </div>
  </div>
</template>