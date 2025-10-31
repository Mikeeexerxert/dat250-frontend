<script setup lang="ts">
const supabase = useSupabaseClient()
const currentUser = ref<{ id: string; email: string; username: string } | null>(null)

const fetchProfile = async (userId: string) => {
  if (!userId) return
  const { data: profile } = await supabase
      .from('profiles')
      .select('id, username, email')
      .eq('id', userId)
      .single()
  currentUser.value = profile || null
}

let { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
  if (session?.user) {
    fetchProfile(session.user.id)
  } else {
    currentUser.value = null
  }
})

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user?.id) await fetchProfile(user.id)
})

onUnmounted(() => {
  authListener?.subscription.unsubscribe()
})

const handleLogout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) alert(error.message)
  else {
    currentUser.value = null
    navigateTo('/login')
  }
}
</script>
<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <header class="bg-blue-600 text-white p-4 flex justify-between items-center shadow">
      <h1 class="text-xl font-bold">Poll App</h1>
      <div class="flex items-center gap-4">
        <span v-if="currentUser" class="text-sm">
          Logged in as: <strong>{{ currentUser.username }}</strong>
        </span>
        <span v-else class="text-sm italic">Not logged in</span>
        <button
            v-if="currentUser"
            @click="handleLogout"
            class="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition-colors text-white text-sm"
        >
          Logout
        </button>
      </div>
    </header>

    <main class="flex-1 p-6">
      <slot />
    </main>
  </div>
</template>