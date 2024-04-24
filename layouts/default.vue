<template>
    <div class="main-container">
      <Header :isLoggedIn="isLoggedIn" />
        <slot />
      <Footer />
    </div>
  </template>
  
  <script setup>
  import Header from '~/components/Header.vue';
  import Footer from '~/components/Footer.vue';
  import { ref, watch } from 'vue';
  import { checkSession } from '~/utils/session';
  
  const isLoggedIn = ref(checkSession());
  
  watch(isLoggedIn, (newValue) => {
    console.log("Changement d'état de connexion :", newValue);
  });
  </script>
  