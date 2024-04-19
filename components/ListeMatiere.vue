<template>
  <div class="container mt-5">
    <h2 class="text-center mb-5">Explorez nos matières</h2>
    <div class="row row-cols-2 row-cols-md-5 g-4">
      <router-link
        v-for="matiere in matieres"
        :key="matiere.id"
        :to="'/matiere/' + matiere.id"
        class="col text-decoration-none"
      >
        <div class="card h-75 border-0 shadow-sm matiere-card">
          <div class="card-body d-flex flex-column justify-content-between">
            <h5 class="card-title text-center">{{ matiere.libelle_matiere }}</h5>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';

  const matieres = ref([]);
  
   
  onMounted(() => {
  axios.get('http://localhost:3001/matieres')
    .then(response => {
      matieres.value = response.data;
    })
    .catch(error => {
      console.error('Error fetching matieres:', error);
    });
  });
  </script>
