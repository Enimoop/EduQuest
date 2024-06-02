<template>

  <Login />

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
