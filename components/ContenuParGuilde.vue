<template>
    <div class="container mt-5">
      <div class="list-details">
        <h3 class="guilde-description text-center">{{ description_guilde }}</h3>
        <br>
        <div class="row">
          <div class="col-md-4 d-flex align-items-stretch" v-for="contenu in contenus" :key="contenu.id">
            <router-link :to="'/' + contenu.type_contenu.toLowerCase() + '/' + contenu.id" class="col text-decoration-none">
              <div class="card mb-4 contenu-card shadow-sm">
                <div class="card-body d-flex flex-column align-items-center justify-content-center">
                  <span class="badge position-absolute top-0 end-0 m-2">
                    <img v-if="contenu.type_contenu === 'Cours'" src="@/public/image/parcheminc.png" alt="Cours" class="icon-image">
                    <img v-else-if="contenu.type_contenu === 'Exercice'" src="@/public/image/epee2c.png" alt="Exercice" class="icon-image">
                  </span>
                  <h5 class="card-title text-center">{{ contenu.titre_contenu }}</h5>
                  <p class="card-description text-center">{{ truncate(contenu.description_contenu, 100) }}</p>
                  <p class="card-text text-center"><small class="text-muted">{{ format(new Date(contenu.date_contenu), 'dd/MM/yyyy') }}</small></p>
                </div>
              </div>
            </router-link>
          </div>
        </div>
        <!-- Pagination -->
        <div class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1">Précédent</button>
          <span>Page {{ currentPage }}</span>
          <button @click="nextPage" :disabled="isLastPage">Suivant</button>
        </div>
      </div>
    </div>
  </template>
  
  
  <script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getSubFromToken } from "../utils/session.mjs";
import { format } from 'date-fns';
import axios from 'axios';
import { useRoute } from 'vue-router';



interface Contenus {
  id: number;
  titre_contenu: string;
  description_contenu: string;
  date_contenu: string;
  type_contenu: string;
}

const nom_guilde = ref('');
const description_guilde = ref('');
const contenus = ref<Contenus[]>([]);
const currentPage = ref(1);
const pageSize = 12;
const totalContenus = ref(0);

const route = useRoute();
const id = route.params.id;

const fetchContenus = async (page: number, pageSize: number) => {

  try {
    const response = await axios.get(`http://localhost:3001/contenus/guilde/page/${id}`, {
      params: {
        page,
        pageSize
      }
    });
    contenus.value = response.data.contenus;
    totalContenus.value = response.data.total;
    if (response.data.contenus.length > 0) {
      nom_guilde.value = response.data.contenus[0].nom_guilde;
      description_guilde.value = response.data.contenus[0].description_guilde;
    }
  } catch (error) {
    console.error('Error fetching contents:', error);
  }
};

onMounted(() => {
  fetchContenus(currentPage.value, pageSize);
});

watch([currentPage], () => {
  fetchContenus(currentPage.value, pageSize);
});

const nextPage = () => {
  if ((currentPage.value * pageSize) < totalContenus.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const isLastPage = computed(() => {
  return (currentPage.value * pageSize) >= totalContenus.value;
});


// Fonction pour tronquer le texte
const truncate = (text: string, length: number) => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};
</script>

  
<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  transition: transform 0.2s, box-shadow 0.2s;
  border: none;
  border-radius: 10px;
  overflow: hidden;
  width: 90%;
  margin: auto;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
}

.card-description {
  font-size: 1rem;
  color: #666;
  margin-bottom: 1rem;
}

.card-text {
  color: #555;
}

.card-body {
  padding: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.guilde-description {
  color: #333;
  font-weight: normal;
}

.text-center {
  color: #333; /* Changer la couleur du texte à noir */
}

.my-4 {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.title-cours {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #444;
  text-align: center;
}

.contenu-card {
  background-color: #f8f9fa;
  transition: transform 0.3s ease-in-out;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1) !important;
}

.contenu-card:hover {
  background-color: #f8f9fa;
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2) !important;
}

.badge {
  font-size: 1rem;
  padding: 0.5em 0.75em;
  border-radius: 0.25rem;
}

.icon-image {
  width: 48px;
  height: 48px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  margin: 0 10px;
}

.list-details {
  background-color: #f4f4f4;
  padding: 2rem;
  border-radius: 5px;
  margin-top: 2rem;
}
</style>

