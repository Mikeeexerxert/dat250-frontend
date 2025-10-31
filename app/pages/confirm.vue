<script setup lang="ts">
const supabase = useSupabaseClient()
const redirectInfo = useSupabaseCookieRedirect()
const redirectTo = redirectInfo.pluck() || '/'

const message = ref('Confirming your email...')
const error = ref<string | null>(null)

onMounted(async () => {
  const urlParams = new URLSearchParams(globalThis.location.search)
  const access_token = urlParams.get('access_token')
  const refresh_token = urlParams.get('refresh_token')
  if (!access_token) {
    error.value = 'No access token found. Please log in again.'
    message.value = ''
    return
  }

  const { data, error: err } = await supabase.auth.setSession({
    access_token: access_token!,
    refresh_token: refresh_token ?? ''
  })
  if (err) {
    error.value = err.message
    message.value = ''
  } else {
    navigateTo(redirectTo)
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
      <p v-if="message" class="text-lg">{{ message }}</p>
      <p v-if="error" class="text-red-500">{{ error }}</p>
    </div>
  </div>
</template>