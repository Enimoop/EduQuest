<template>
  <NuxtLayout layout="default">
    <div>
    
    <ExerciceParID :exercice="exercice" />
  </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';
import ExerciceParID from '../components/ExerciceParID.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const exercice = ref([]);


</script>