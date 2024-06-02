<template>
  <NuxtLayout layout="default">
    <br>
    <br>
    <div class="container">
      <div class="text-center">
        <h3 class="mb-4">Liste des posts</h3>
      </div>
      <div class="row justify-content-center">
        <div class="col-md-8">
          <ul class="list-group">
            <li v-for="post in posts" :key="post.id" class="list-group-item d-flex justify-content-between align-items-center shadow-sm mb-2">
              <div>
                <strong>{{ post.eleve.nom }} {{ post.eleve.prenom }}</strong>: {{ post.nom }}
              </div>
              <router-link :to="`/forum/${post.id}`" class="btn btn-primary btn-sm">Voir plus</router-link>
            </li>
          </ul>
        </div>
      </div>
      <!-- Pagination -->
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Précédent</button>
        <span>Page {{ currentPage }}</span>
        <button @click="nextPage" :disabled="isLastPage">Suivant</button>
      </div>
      <div class="text-center mt-4">
        <button @click="ouvrirModal" class="btn btn-primary create-post-btn">Créer un Post</button>
      </div>
    </div>
    
    <!-- Modal -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="fermerModal">
      <div class="modal-content form p-4 shadow rounded bg-light" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">Créer un Post</h5>
          <button type="button" class="close" @click="fermerModal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <CreerPost @postCreated="handlePostCreated" @close="fermerModal" />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import CreerPost from "~/components/CreerPost.vue";

const posts = ref([]);
const isModalOpen = ref(false);
const currentPage = ref(1);
const pageSize = 9;
const totalPosts = ref(0);

const ouvrirModal = () => {
  isModalOpen.value = true;
  document.body.classList.add('modal-open');
};

const fermerModal = () => {
  isModalOpen.value = false;
  document.body.classList.remove('modal-open');
};

const fetchPosts = async (page, pageSize) => {
  try {
    const response = await axios.get("http://localhost:3001/posts", {
      params: { page, pageSize },
    });
    posts.value = response.data.posts;
    totalPosts.value = response.data.total;
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};

const handlePostCreated = () => {
  fetchPosts(currentPage.value, pageSize);
};

onMounted(() => {
  fetchPosts(currentPage.value, pageSize);
});

watch(currentPage, () => {
  fetchPosts(currentPage.value, pageSize);
});

const nextPage = () => {
  if ((currentPage.value * pageSize) < totalPosts.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const isLastPage = computed(() => {
  return (currentPage.value * pageSize) >= totalPosts.value;
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

.create-post-btn {
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
  transition: background-color 0.3s, transform 0.3s;
}

.create-post-btn:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.create-post-btn:active {
  background-color: #004494;
  transform: translateY(0);
}

.list-group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  transition: transform 0.2s, box-shadow 0.2s;
  border: none;
  border-radius: 10px;
}

.list-group-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 0.875rem;
  font-weight: bold;
  color: white;
  transition: background-color 0.3s, transform 0.3s;
}

.btn-primary:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.btn-primary:active {
  background-color: #004494;
  transform: translateY(0);
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
</style>

