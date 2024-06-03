<template>
  <div class="container mt-5">
    <div class="col-md-10 mx-auto">
      <div class="post-content text-center">
        <h1 class="post-title">{{ nom_post.nom }}</h1>
        <p class="post-text">{{ nom_post.contenu }}</p>
      </div>
      <div class="comments-section mt-4 mx-auto col-md-8">
        <h3 class="comments-title text-center">Commentaires</h3>
        <ul class="list-group list-group-flush">
          <li v-for="contenu in contenus" :key="contenu.id" class="list-group-item">
            <strong>{{ contenu.eleve.nom }} {{ contenu.eleve.prenom }}:</strong>
            <p class="mb-0">{{ contenu.contenu }}</p>
          </li>
        </ul>
      </div>
      <div class="text-center mt-3">
        <button @click="ouvrirModal" class="btn btn-sm btn-primary">Ajouter un commentaire</button>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="fermerModal">
      <div class="modal-content form p-4 shadow rounded bg-light" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">Ajouter un commentaire</h5>
          <button type="button" class="close" @click="fermerModal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <CreerCommentaire @close="fermerModal" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import CreerCommentaire from "~/components/CreerCommentaire.vue";

const contenus = ref([]);
const nom_post = ref({});
const isModalOpen = ref(false);

const ouvrirModal = () => {
  isModalOpen.value = true;
  document.body.classList.add('modal-open');
};

const fermerModal = () => {
  isModalOpen.value = false;
  document.body.classList.remove('modal-open');
};

onMounted(() => {
  const route = useRoute();
  const id = route.params.id;
  axios
    .get(`http://localhost:3001/commentaires/${id}`)
    .then((response) => {
      contenus.value = response.data;
    })
    .catch((error) => {
      console.error("Error fetching contents:", error);
    });
  axios.get(`http://localhost:3001/posts/${id}`).then((response) => {
    nom_post.value = response.data;
  });
});

console.log(nom_post);
</script>

<style scoped>
.container {
  margin-top: 2rem;
}

.post-content {
  background-color: #f8f9fa;
  padding: 2rem;
  border-radius: 5px;
}

.post-title {
  font-size: 3rem;
  color: #343a40;
  margin-bottom: 1rem;
}

.post-text {
  font-size: 1.5rem;
  color: #495057;
}

.comments-section {
  background-color: #ffffff;
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.comments-title {
  font-size: 1.5rem;
  color: #343a40;
  margin-bottom: 1rem;
}

.list-group-item {
  background-color: #f8f9fa;
  border: none;
  border-bottom: 1px solid #dee2e6;
  font-size: 0.875rem;
}

.list-group-item:last-child {
  border-bottom: none;
}

.mt-4 {
  margin-top: 1.5rem;
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

.btn-primary {
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  padding: 5px 15px;
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
</style>
