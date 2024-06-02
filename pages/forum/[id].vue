<template>
  <NuxtLayout>
    <div>
      <AfficherPost :commentaires_post="commentaires_post" />
    </div>
  </NuxtLayout>
</template>

<script setup>
import AfficherPost from "../../components/AfficherPost.vue";

const commentaires_post = ref([]);
</script>
