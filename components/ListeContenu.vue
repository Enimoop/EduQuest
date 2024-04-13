<template>
    <div class="container">
  <div class="row">
    <div class="col-md-4">
      <h3>Liste des contenus</h3>
      <ul class="list-group">
        <li v-for="contenu in contenus" :key="contenu.id" class="list-group-item">
          {{ contenu.description_contenu }} {{ contenu.date_contenu }} {{ contenu.libelle_matiere }}
        </li>
      </ul>
    </div>
    
  </div>
</div>
  </template>
  
  <script setup>
  
  import { ref, onMounted } from 'vue';
  import axios from 'axios';

  const contenus = ref([]);
  
  onMounted(() => {
  axios.get('http://localhost:3001/contenus')
    .then(response => {
      contenus.value = response.data;
    })
    .catch(error => {
      console.error('Error fetching contents:', error);
    });
});
  </script>
  