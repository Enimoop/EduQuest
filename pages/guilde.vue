<template>
    <NuxtLayout layout="default">
        <div>
      <!-- Contenu de la page parent -->
      <template v-if="!afficherPageEnfant">
        <ListeGuildeEleve v-if="type === 'Eleve'" @afficherPageEnfant="afficherEnfant" />
        <ListeGuildeProf v-if="type === 'Prof'" @afficherPageEnfant="afficherEnfant" />
      </template>
      
      <!-- Contenu de la page enfant -->
      <template v-if="afficherPageEnfant">
        <NuxtPage />
      </template>
    </div>
</NuxtLayout>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue';
import ListeGuildeEleve from '../components/ListeGuildeEleve.vue';
import ListeGuildeProf from '../components/ListeGuildeProf.vue';
import 'bootstrap/dist/css/bootstrap.css'
import { useRouter } from 'vue-router';

const router = useRouter();

const headers = useRequestHeaders(["cookie"]) as HeadersInit;

const { data: token } = await useFetch("/api/token", { headers });

const id = getSubFromToken(token);
const type = await returnUserType(id);

const afficherPageEnfant = computed(() => {
    // Vérifie si l'URL correspond à la structure '/cours/:id'
    return router.currentRoute.value.path.startsWith('/guilde/');
  });
</script>