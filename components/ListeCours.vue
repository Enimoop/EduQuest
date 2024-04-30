<template>
  <div class="container">
    <h3 class="my-4">Liste de tous Cours </h3>
    <div class="row">
      <div class="col-md-4" v-for="cour in cours" :key="cour.id">
        <router-link :to="'/cours/' + cour.id" class="col text-decoration-none">
          <div class="card mb-4 contenu-card">
            <div class="card-body">
              <h5 class="card-title">{{ cour.description_contenu }}</h5>
              <p class="card-text"><small class="text-muted">{{ format(Date(cour.date_contenu), 'dd/MM/yyyy') }}</small></p>
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

const cours = ref([]);
  
  onMounted(() => {
  axios.get('http://localhost:3001/contenus/cours')
    .then(response => {
      cours.value = response.data;
    })
    .catch(error => {
      cours.error('Error fetching lesson:', error);
    });
});
  </script>