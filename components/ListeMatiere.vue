<template>
  <!-- <h3>Listes des matières</h3> -->
  <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4">
    <div v-for="matiere in matieres" :key="matiere.id" class="col mb-4">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">{{ matiere.libelle_matiere }}</h5>         
          <a :href="'/contenu/' +matiere.id" class="card-link">Card link</a>
        </div>
      </div>
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
