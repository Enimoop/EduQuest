<template>
  <div class="container mt-5">
    <div class="list-details">
    <h1 class="title-cours my-4 text-center">Les Exercices</h1>
    <div class="row">
      <div class="col-md-4 d-flex align-items-stretch" v-for="exercice in exercices" :key="exercice.id">
        <router-link :to="'/exercice/' + exercice.id" class="col text-decoration-none">
          <div class="card mb-4 contenu-card shadow-sm">
            <div class="card-body d-flex flex-column align-items-center justify-content-center">
              <span class="badge position-absolute top-0 end-0 m-2">
                <img src="@/public/image/epee2c.png" alt="Exercice" class="icon-image">
              </span>
              <h5 class="card-title text-center">{{ exercice.titre_contenu }}</h5>
              <p class="card-description text-center">{{ truncate(exercice.description_contenu, 100) }}</p>
              <p class="card-text text-center"><small class="text-muted">{{ format(new Date(exercice.date_contenu), 'dd/MM/yyyy') }}</small></p>
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
import { ref, onMounted, computed, watch } from 'vue';
import { format } from 'date-fns';
import axios from 'axios';

const headers = useRequestHeaders(["cookie"]) as HeadersInit;

const { data: token } = await useFetch("/api/token", { headers });
const id = getSubFromToken(token);

interface Exercices {
  id: number;
  titre_contenu: string;
  description_contenu: string;
  date_contenu: string;
}

const exercices = ref<Exercices[]>([]);
const currentPage = ref(1);
const pageSize = 12;
const totalExercices = ref(0);

const fetchExercices = async (page: number, pageSize: number) => {
  try {
    const response = await axios.get(`http://localhost:3001/contenus/exercices/${id}`, {
      params: {
        page,
        pageSize
      }
    });
    exercices.value = response.data.exercices;
    totalExercices.value = response.data.total;
  } catch (error) {
    console.error('Error fetching exercices:', error);
  }
};

onMounted(() => {
  fetchExercices(currentPage.value, pageSize);
});

watch([currentPage], () => {
  fetchExercices(currentPage.value, pageSize);
});

const nextPage = () => {
  if ((currentPage.value * pageSize) < totalExercices.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const isLastPage = computed(() => {
  return (currentPage.value * pageSize) >= totalExercices.value;
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

.my-4 {
  margin-top: 2rem;
  margin-bottom: 2rem;
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

.title-cours {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #444;
  text-align: center;
}

.text-center {
  font-weight: bold;

}

.list-details {
  background-color: #f4f4f4;
  padding: 2rem;
  border-radius: 5px;
  margin-top: 2rem;
}
</style>
