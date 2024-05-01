<template>
  <div class="container">
    <h3 class="my-4">Liste de tous Exercices </h3>
    <div class="row">
      <div class="col-md-4" v-for="exercice in exercices" :key="exercice.id">
        <router-link :to="'/exercice/' + exercice.id" class="col text-decoration-none">
          <div class="card mb-4 contenu-card">
            <div class="card-body">
              <h5 class="card-title">{{ exercice.description_contenu }}</h5>
              <p class="card-text"><small class="text-muted">{{ format(new Date(contenu.date_contenu), 'dd/MM/yyyy') }}</small></p>
              <!-- <p class="card-text">{{ cour.type_contenu }}</p>  -->
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>
    
  <script setup>
  import { format } from 'date-fns';
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const exercices = ref([]);
    
    onMounted(() => {
    axios.get('http://localhost:3001/contenus/exercices')
      .then(response => {
        exercices.value = response.data;
      })
      .catch(error => {
        exercices.error('Error fetching lesson:', error);
      });
  });
    </script>