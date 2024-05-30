<template>
  <NuxtLayout layout="default">
    <div class="container">
      <div class="row">
        <CreerPost />
        <div class="col-md-4">
          <h3>Liste des posts</h3>
          <ul class="list-group">
            <li v-for="post in posts" :key="post.id" class="list-group-item">
              {{ post.eleve.nom }} {{ post.eleve.prenom }} : {{ post.nom }} =>
              <router-link :to="`/forum/${post.id}`">Voir plus</router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
// import CreerPost from "~/components/CreerPost.vue";

const posts = ref([]);

onMounted(() => {
  axios
    .get("http://localhost:3001/posts")
    .then((response) => {
      posts.value = response.data;
    })
    .catch((error) => {
      console.error("Error fetching posts:", error);
    });
  console.log(posts);
});
</script>
