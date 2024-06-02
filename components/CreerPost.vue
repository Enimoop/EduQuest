<template>

    
      <h2 class="form-title mb-4 text-center">Nouveau Post</h2>
      <form @submit.prevent="submitForm">
      <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
        {{ successMessage }}
        <button type="button" class="btn-close" @click="successMessage = ''"></button>
      </div>
      <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
        {{ errorMessage }}
        <button type="button" class="btn-close" @click="errorMessage = ''"></button>
      </div>

      <!-- Titre du Post -->
      <div class="mb-3">
        <label for="title" class="form-label">Titre:</label>
        <input
          id="title"
          class="form-control"
          v-model="formData.nom_post"
          required
        />
      </div>

      <!-- Contenu du Post -->
      <div class="mb-3">
        <label for="content" class="form-label">Contenu:</label>
        <textarea
          id="content"
          class="form-control"
          v-model="formData.contenu_post"
          rows="5"
          required
        ></textarea>
      </div>

      <!-- Bouton de soumission -->
      <button type="submit" class="btn btn-primary w-auto mx-auto d-block">Soumettre</button>
    </form>

</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

const emit = defineEmits(["postCreated"]);

const headers = useRequestHeaders(["cookie"]) as HeadersInit;
const { data: token } = await useFetch("/api/token", { headers });
const idu = getSubFromToken(token);

const formData = ref({
  nom_post: "",
  contenu_post: "",
  id_u: idu,
});

const successMessage = ref<string>("");
const errorMessage = ref<string>("");

const submitForm = () => {
  console.log(formData.value);
  axios
    .post("http://localhost:3001/posts/addPost", formData.value)
    .then((response) => {
      successMessage.value = "Post ajouté avec succès";
      formData.value = {
        nom_post: "",
        contenu_post: "",
        id_u: idu,
      };
      emit("postCreated");
    })
    .catch((error) => {
      console.error("Error adding post:", error);
      errorMessage.value = "Une erreur s'est produite lors de l'ajout du post";
    });
};
</script>

<style scoped>
.container {
  margin-top: 2rem;
}

.form {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
}

.form-label {
  margin-bottom: 0.5rem;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
}

.form-select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  background-color: #fff;
}

.input-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn-primary {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
}

.btn-primary:focus,
.btn-danger:focus {
  outline: none;
}

.btn-primary:hover,
.btn-danger:hover {
  filter: brightness(0.9);
}
</style>