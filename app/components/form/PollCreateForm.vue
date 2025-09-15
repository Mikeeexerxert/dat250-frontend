<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<(e: 'close') => void>()

const question = ref("")
const options = ref<string[]>([""])

function addOption() {
  options.value.push("")
}

function submit() {
  console.log("Creating poll:", { question: question.value, options: options.value })
  emit("close")
}
</script>

<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center">
    <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-semibold mb-4">Create Poll</h2>

      <input
          v-model="question"
          placeholder="Poll question"
          class="w-full border rounded p-2 mb-4"
      />

      <div v-for="(opt, index) in options" :key="index" class="mb-2">
        <input
            v-model="options[index]"
            placeholder="Option"
            class="w-full border rounded p-2"
        />
      </div>

      <button @click="addOption" class="text-blue-600 text-sm">+ Add option</button>

      <div class="flex justify-end gap-2 mt-4">
        <button @click="emit('close')" class="px-4 py-2 rounded bg-gray-200">Cancel</button>
        <button @click="submit" class="px-4 py-2 rounded bg-blue-600 text-white">Create</button>
      </div>
    </div>
  </div>
</template>