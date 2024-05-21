<template>
    <NuxtLayout layout="default">
        <div>
      <!-- Contenu de la page parent -->
      <template v-if="!afficherPageEnfant">
        <ListeGuildeEleve :guildesEleves="guildesEleves" @afficherPageEnfant="afficherEnfant" />
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
import ListeGuildeEleve from '../components/ListeGuildeEleve.vue';
import 'bootstrap/dist/css/bootstrap.css'
import { useRouter } from 'vue-router';

const router = useRouter();
const guildesEleves = ref([]);
const afficherPageEnfant = computed(() => {
    // Vérifie si l'URL correspond à la structure '/cours/:id'
    return router.currentRoute.value.path.startsWith('/guilde/');
  });
</script>