<script setup lang="ts">
const { signIn } = useAuth();
</script>

<template>
  <button
    class="flex items-center border border-gray-500 px-4 py-2 rounded-lg text-gray-500 text-sm font-medium hover:text-black hover:bg-gray-100"
    @click="signIn('github')"
  >
    Log in with Github
  </button>
</template>
