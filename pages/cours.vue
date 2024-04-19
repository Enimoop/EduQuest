<template>
    <div>
      <!-- Contenu de la page parent -->
      <template v-if="!afficherPageEnfant">
        <ListeCours :cours="cours" @afficherPageEnfant="afficherEnfant" />
      </template>
      
      <!-- Contenu de la page enfant -->
      <template v-if="afficherPageEnfant">
        <NuxtPage />
      </template>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import ListeCours from '../components/ListeCours.vue';
  import 'bootstrap/dist/css/bootstrap.css';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const cours = ref([]);
  const afficherPageEnfant = computed(() => {
    // Vérifie si l'URL correspond à la structure '/cours/:id'
    return router.currentRoute.value.path.startsWith('/cours/');
  });


</script>