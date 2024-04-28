<template>
  <NuxtLayout layout="default">
  <Login />
</NuxtLayout>
</template>

<script setup>
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});
const { signIn } = useAuth();
</script>
