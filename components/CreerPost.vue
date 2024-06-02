<template>
  <div class="container mt-5">
    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label for="title" class="form-label">Titre</label>
        <input
          type="text"
          class="form-control"
          id="title"
          v-model="formData.nom_post"
          required
        />
      </div>
      <div class="mb-3">
        <label for="input" class="form-label">Votre Input</label>
        <input
          type="text"
          class="form-control"
          id="input"
          v-model="formData.contenu_post"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary">Soumettre</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

const headers = useRequestHeaders(["cookie"]) as HeadersInit;
const { data: token } = await useFetch("/api/token", { headers });
const idu = getSubFromToken(token);

const formData = ref({
  nom_post: "",
  contenu_post: "",
  id_u: idu,
});

const submitForm = () => {
  console.log(formData.value);
  axios
    .post("http://localhost:3001/posts/addPost", formData.value)
    .then((response) => {
      formData.value = {
        nom_post: "",
        contenu_post: "",
      };
    })
    .catch((error) => {
      console.error("Error adding post:", error);
    });
};
</script>
