<template>
  <div class="container">
    <div class="col-md-4">
      <h1>
        {{ nom_post.nom }}
      </h1>
      <p>
        {{ nom_post.contenu }}
      </p>
      <h3>Commentaires</h3>
      <ul class="list-group">
        <li
          v-for="contenu in contenus"
          :key="contenu.id"
          class="list-group-item"
        >
          {{ contenu.user }} - {{ contenu.contenu }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const contenus = ref([]);
const nom_post = ref([]);

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
</script>
