<template>
<br>
    <br>
    <div>
      <!-- Contenu de la page parent -->
      <template v-if="!afficherPageEnfant">
        <br>
        <div class="container">
          <div class="guilde-details">
            <ListeGuildeEleve v-if="type === 'Eleve'" @afficherPageEnfant="afficherEnfant" />
            <ListeGuildeProf v-if="type === 'Prof' || type === 'Admin'" @afficherPageEnfant="afficherEnfant" />
          </div>
        </div>
      </template>
      
      <!-- Contenu de la page enfant -->
      <template v-if="afficherPageEnfant">
        <NuxtPage />
      </template>
    </div>

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
  return router.currentRoute.value.path.startsWith('/guilde/');
});
</script>

<style scoped>
.guilde-details {
  background-color: #f4f4f4;
  padding: 2rem;
  border-radius: 5px;
  margin-top: 2rem;
}
</style>
