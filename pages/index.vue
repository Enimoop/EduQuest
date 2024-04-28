<template>
   <NuxtLayout layout="default">
  home
  <div>{{ token || "pas de token" }}</div>
  <div>
    <h1>Home</h1>
    <p>Welcome to EduQuest</p>
  </div>
</NuxtLayout>
</template>

<script setup lang="ts">
const headers = useRequestHeaders(["cookie"]) as HeadersInit;

const { data: token } = await useFetch("/api/token", { headers });
</script>
