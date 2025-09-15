<script setup lang="ts">
const currentUser = {
  id: 1,
  username: "testuser",
  email: "test@example.com"
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Header -->
    <header class="bg-blue-600 text-white p-4 flex justify-between items-center shadow">
      <h1 class="text-xl font-bold">Poll App</h1>
      <div>
        <span class="text-sm">
          Logged in as: <strong>{{ currentUser.username }}</strong>
        </span>
      </div>
    </header>
    <!-- Main page content -->
    <main class="flex-1 p-6">
      <slot />
    </main>
  </div>
</template>