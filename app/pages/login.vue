<script setup lang="ts">
import type { Database } from '~/types/supabase'

const supabase = useSupabaseClient<Database>()
const redirectInfo = useSupabaseCookieRedirect()

const email = ref('')
const password = ref('')
const username = ref('')
const error = ref<string | null>(null)
const redirectTo = redirectInfo.pluck() || '/'

onMounted(() => {
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      navigateTo(redirectTo)
    }
  })
})

const handleSignup = async () => {
  error.value = null
  if (!email.value || !password.value || !username.value) {
    error.value = 'Email, username and password are required.'
    return
  }
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      emailRedirectTo: `${globalThis.location.origin}/confirm`
    }
  })
  if (authError) {
    error.value = authError.message
    return
  }
  if (authData.user) {
    const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            email: email.value,
            username: username.value
          }
        ])
    if (profileError) {
      error.value = profileError.message
      return
    }
  }
  alert('Signup successful! Check your email to confirm your account.')
}

const handleLogin = async () => {
  error.value = null
  if (!email.value || !password.value) {
    error.value = 'Email and password are required.'
    return
  }
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })
  if (loginError) {
    error.value = loginError.message
  }
}
</script>
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold text-center mb-6">Login / Signup</h1>

      <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
          v-model="username"
          type="text"
          placeholder="Username (Signup only)"
          class="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <div class="flex gap-4">
        <button
            @click="handleLogin"
            class="flex-1 bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors"
        >
          Login
        </button>

        <button
            @click="handleSignup"
            class="flex-1 bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition-colors"
        >
          Signup
        </button>
      </div>

      <p v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</p>
    </div>
  </div>
</template>