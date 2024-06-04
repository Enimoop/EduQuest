<template>
    <div class="container mt-5">
      <div class="text-center">
        <button class="btn btn-primary me-2" @click="toggleComponent('quiz')">Ajouter Exercice</button>
        <button class="btn btn-primary" @click="toggleComponent('cours')">Ajouter Cours</button>
      </div>
      <br>
      <div v-if="showQuiz" class="mt-4">
        <AjouterQuiz />
      </div>
      
      <div v-if="showCours" class="mt-4">
        <AjouterCours />
      </div>
    </div>
  </template>

<script setup lang="ts">
import AjouterQuiz from './AjouterQuiz.vue';
import AjouterCours from './AjouterCours.vue';

const showQuiz = ref(false);
const showCours = ref(false);

const toggleComponent = (component: string) => {
  if (component === 'quiz') {
    showQuiz.value = !showQuiz.value;
    if (showQuiz.value) {
      showCours.value = false;
    }
  } else if (component === 'cours') {
    showCours.value = !showCours.value;
    if (showCours.value) {
      showQuiz.value = false;
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
}
.text-center {
  display: flex;
  justify-content: center;
  gap: 1rem;
}
.mt-5 {
  margin-top: 3rem;
}
.mt-4 {
  margin-top: 1.5rem;
}
</style>