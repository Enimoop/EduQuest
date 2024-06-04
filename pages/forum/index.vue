<template>
  <div class="container mt-5">
    <div class="text-center mb-4">
      <h3 class="display-4">Forum</h3>
    </div>
    <div class="row justify-content-center mb-4">
      <div class="col-md-8 d-flex">
        <input
          type="text"
          class="form-control me-2"
          placeholder="Rechercher par titre"
          v-model="searchQuery"
          @keyup.enter="searchPosts"
        />
        <button class="btn btn-secondary" @click="resetSearch">Réinitialiser</button>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-md-8">
        <ul class="list-group custom-list-group">
          <li v-for="post in posts" :key="post.id" class="list-group-item d-flex justify-content-between align-items-center shadow-sm mb-2 post-item">
            <div>
              <strong>{{ post.eleve.nom }} {{ post.eleve.prenom }}</strong>: {{ post.nom }}
            </div>
            <div>
              <router-link :to="`/forum/${post.id}`" class="btn btn-primary btn-sm">Voir plus</router-link>
              <button v-if="type === 'Admin'" @click="deletePost(post.id)" class="btn btn-danger btn-sm ms-2">Supprimer</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Précédent</button>
      <span>Page {{ currentPage }}</span>
      <button @click="nextPage" :disabled="isLastPage">Suivant</button>
    </div>
    <div class="text-center mt-4">
      <button @click="ouvrirModal" class="btn btn-primary create-post-btn">Créer un Post</button>
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import CreerPost from "~/components/CreerPost.vue";

const headers = useRequestHeaders(["cookie"]);
const { data: token } = await useFetch("/api/token", { headers });
const idu = getSubFromToken(token);
const type = await returnUserType(idu);

const posts = ref([]);
const isModalOpen = ref(false);
const currentPage = ref(1);
const pageSize = 7;
const totalPosts = ref(0);
const searchQuery = ref("");
const isAdmin = ref(type === 'Admin'); // Ajouter la vérification du type d'utilisateur

const ouvrirModal = () => {
  isModalOpen.value = true;
  document.body.classList.add('modal-open');
};

const fermerModal = () => {
  isModalOpen.value = false;
  document.body.classList.remove('modal-open');
};

const fetchPosts = async (page, pageSize, query = "") => {
  try {
    const response = await axios.get("http://localhost:3001/posts/", {
      params: { page, pageSize, titre: query },
    });
    posts.value = response.data.posts;
    totalPosts.value = response.data.total;
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};

const handlePostCreated = () => {
  fetchPosts(currentPage.value, pageSize, searchQuery.value);
};

const searchPosts = () => {
  fetchPosts(1, pageSize, searchQuery.value);
  currentPage.value = 1; // Reset to first page when searching
};

const resetSearch = () => {
  searchQuery.value = "";
  fetchPosts(1, pageSize);
  currentPage.value = 1; // Reset to first page when resetting search
};

const deletePost = async (postId) => {
  try {
    await axios.delete(`http://localhost:3001/posts/${postId}`);
    fetchPosts(currentPage.value, pageSize, searchQuery.value);
  } catch (error) {
    console.error("Error deleting post:", error);
  }
};

onMounted(() => {
  fetchPosts(currentPage.value, pageSize);
});

watch(currentPage, () => {
  fetchPosts(currentPage.value, pageSize, searchQuery.value);
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
.container {
  margin-top: 2rem;
}

.custom-list-group {
  max-height: 600px; /* Ajustez cette valeur selon vos besoins */
  overflow-y: auto;
}

.post-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  transition: transform 0.2s, box-shadow 0.2s;
  border: none;
  border-radius: 10px;
  min-height: 50px; /* Hauteur réduite */
  margin-bottom: 0.5rem;
}

.post-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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