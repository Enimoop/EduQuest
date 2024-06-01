<template>
  <NuxtLayout layout="default">
    <div>  
      <!-- Contenu de la page parent -->
      <template v-if="!afficherPageEnfant">
        <br>
        <div class="container">
      <div class="guilde-details">
        <ListeGuildeEleve v-if="type === 'Eleve'" @afficherPageEnfant="afficherEnfant" />
        <ListeGuildeProf v-if="type === 'Prof'" @afficherPageEnfant="afficherEnfant" />
        <div class="text-center mt-4">
          <br>
          <button v-if="type === 'Prof'" @click="ouvrirModal" class="btn btn-primary create-guild-btn">Créer une Guilde</button>
        </div>
      </div>
    </div>
      </template>
      
      <!-- Contenu de la page enfant -->
      <template v-if="afficherPageEnfant">
        <NuxtPage />
      </template>

      <!-- Modal -->
      <div v-if="isModalOpen" class="modal-overlay" @click.self="fermerModal">
        <div class="modal-content form p-4 shadow rounded bg-light" @click.stop>
          <div class="modal-header">
            
            <button type="button" class="close" @click="fermerModal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <CreerGuilde />
          </div>
        </div>
      </div>
    </div>
   
  </NuxtLayout>
</template>


<script setup lang="ts">
import { ref, watch } from 'vue';
import ListeGuildeEleve from '../components/ListeGuildeEleve.vue';
import ListeGuildeProf from '../components/ListeGuildeProf.vue';
import CreerGuilde from '../components/CreerGuilde.vue';
import 'bootstrap/dist/css/bootstrap.css';
import { useRouter, useRoute } from 'vue-router';

// Import necessary for server-side rendering if using Nuxt ou similaire frameworks
const headers = useRequestHeaders(["cookie"]) as HeadersInit;
const { data: token } = await useFetch("/api/token", { headers });
const id = getSubFromToken(token);
const type = await returnUserType(id);

const router = useRouter();
const route = useRoute();

const afficherPageEnfant = ref(false);
const isModalOpen = ref(false);

// Fonction pour afficher la page enfant
const afficherEnfant = () => {
  afficherPageEnfant.value = true;
};

// Fonction pour ouvrir le modal
const ouvrirModal = () => {
  isModalOpen.value = true;
  document.body.classList.add('modal-open');
};

// Fonction pour fermer le modal
const fermerModal = () => {
  isModalOpen.value = false;
  document.body.classList.remove('modal-open');
};

// Watch for route changes to show/hide child page content
watch(router.currentRoute, (newRoute, oldRoute) => {
  if (newRoute.path.startsWith('/guilde/')) {
    afficherPageEnfant.value = true;
  } else if (oldRoute && oldRoute.path.startsWith('/guilde/')) {
    afficherPageEnfant.value = false;
  }
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  position: relative;
  z-index: 1001;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 500px; /* Adjusted for smaller width */
  max-height: 80vh;
  overflow-y: auto;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
.modal-open {
  overflow: hidden;
}

.create-guild-btn {
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
  transition: background-color 0.3s, transform 0.3s;
}

.create-guild-btn:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.create-guild-btn:active {
  background-color: #004494;
  transform: translateY(0);
}

.guilde-details {
  background-color: #f4f4f4;
  padding: 2rem;
  border-radius: 5px;
  margin-top: 2rem;
}
</style>


