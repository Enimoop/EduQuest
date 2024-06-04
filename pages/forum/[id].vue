<template>

    <div>
      <AfficherPost :commentaires_post="commentaires_post" />
    </div>

</template>

<script setup>
import AfficherPost from "../../components/AfficherPost.vue";

const commentaires_post = ref([]);
</script>
