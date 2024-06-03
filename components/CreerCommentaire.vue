<template>
  <div class="container mt-5">
    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label for="title" class="form-label">Contenu</label>
        <input
          type="text"
          class="form-control"
          id="title"
          v-model="formData.contenu_com"
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
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const headers = useRequestHeaders(["cookie"]) as HeadersInit;
const { data: token } = await useFetch("/api/token", { headers });
const idu = getSubFromToken(token);
const idcom = route.params.id;

const formData = ref({
  contenu_com: "",
  id_post: idcom,
  id_u: idu,
});

const emit = defineEmits(['commentCreated', 'close']);

const submitForm = async () => {
  try {
    const response = await axios.post("http://localhost:3001/commentaires/addCommentaire", formData.value);
    formData.value.contenu_com = "";
    const newComment = response.data; // Assuming the response contains the new comment data
    // Emit an event with the new comment data
    emit("commentCreated", newComment);
  } catch (error) {
    console.error("Error adding comment:", error);
  }
};
</script>
