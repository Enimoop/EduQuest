<template>
  <br>
  <div class="container">
    <div class="list-details">
      <h1 class="title-cours my-4 text-center">Vos Guildes</h1>
      <div class="row">
        <div class="col-md-4 d-flex align-items-stretch" v-for="guilde in guildes" :key="guilde.id">
          <router-link :to="'/guilde/' + guilde.id" class="col text-decoration-none">
            <div class="card mb-4 contenu-card shadow-sm">
              <div class="card-body">
                <h5 class="card-title">{{ guilde.nom }}</h5>
                <p class="card-text"><small class="text-muted">{{ guilde.prof }}</small></p>
                <p class="card-text">{{ guilde.description }}</p>
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
      <div class="text-center mt-4">
        <button @click="ouvrirModal" class="btn btn-primary create-guild-btn">Créer une Guilde</button>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div v-if="isModalOpen" class="modal-overlay" @click.self="fermerModal">
    <div class="modal-content form p-4 shadow rounded bg-light" @click.stop>
      <div class="modal-header">
        <button type="button" class="close" @click="fermerModal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <CreerGuilde @guildeCreated="handleGuildeCreated" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import CreerGuilde from '../components/CreerGuilde.vue';
import { getSubFromToken } from "../utils/session.mjs";

const headers = useRequestHeaders(["cookie"]) as HeadersInit;
const { data: token } = await useFetch("/api/token", { headers });
const id = getSubFromToken(token);

interface Guildes {
  id: number;
  nom: string;
  description: string;
  prof: string;
}

const guildes = ref<Guildes[]>([]);
const currentPage = ref(1);
const pageSize = 9; // 9 guildes per page
const totalGuildes = ref(0);
const isModalOpen = ref(false);

const ouvrirModal = () => {
  isModalOpen.value = true;
  document.body.classList.add('modal-open');
};

const fermerModal = () => {
  isModalOpen.value = false;
  document.body.classList.remove('modal-open');
};

const fetchGuildes = async (page: number, pageSize: number) => {
  try {
    const response = await axios.get(`http://localhost:3001/guildes/prof/${id}`, {
      params: {
        page,
        pageSize
      }
    });
    guildes.value = response.data.guildes;
    totalGuildes.value = response.data.total;
  } catch (error) {
    console.error('Error fetching guildes:', error);
  }
};

const handleGuildeCreated = () => {
  fermerModal();
  fetchGuildes(currentPage.value, pageSize);
};

onMounted(() => {
  fetchGuildes(currentPage.value, pageSize);
});

watch([currentPage], () => {
  fetchGuildes(currentPage.value, pageSize);
});

const nextPage = () => {
  if ((currentPage.value * pageSize) < totalGuildes.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const isLastPage = computed(() => {
  return (currentPage.value * pageSize) >= totalGuildes.value;
});
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
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.card-text {
  color: #555;
}

.card-body {
  padding: 20px;
}

.text-center {
  color: #007bff;
  font-weight: bold;
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

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  margin: 0 10px;
}

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
  max-width: 500px;
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
</style>
