<template>
    <NuxtLayout layout="default">
    <div>
      <!-- Contenu de la page parent -->
      <template v-if="!afficherPageEnfant">
        <ListeExercices :exercices="exercices" @afficherPageEnfant="afficherEnfant" />
      </template>
      
      <!-- Contenu de la page enfant -->
      <template v-if="afficherPageEnfant">
        <NuxtPage />
      </template>
    </div>
  </NuxtLayout>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import ListeExercices from '../components/ListeExercices.vue';
  import 'bootstrap/dist/css/bootstrap.css';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const cours = ref([]);
  const afficherPageEnfant = computed(() => {
    // Vérifie si l'URL correspond à la structure '/cours/:id'
    return router.currentRoute.value.path.startsWith('/exercice/');
  });


</script>