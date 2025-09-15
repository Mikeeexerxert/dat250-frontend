<script setup lang="ts">
defineProps<{
  label: string
  variant?: "primary" | "secondary"
}>()
</script>

<template>
  <button
      class="px-4 py-2 rounded-xl shadow font-medium transition
      text-white
      focus:outline-none focus:ring-2 focus:ring-offset-2"
      :class="variant === 'secondary'
      ? 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-400'
      : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-400'"
  >
    {{ label }}
  </button>
</template>