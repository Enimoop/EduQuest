<template>
    <div class="container">
  <div class="row">
    <div class="col-md-4">
      <h3>Liste des élèves</h3>
      <ul class="list-group">
        <li v-for="eleve in eleves" :key="eleve.id_u" class="list-group-item">
          {{ eleve.nom }} {{ eleve.prenom }}
        </li>
      </ul>
    </div>
    
  </div>
</div>
  </template>
  
  <script setup>
  
  import { ref, onMounted } from 'vue';
  import axios from 'axios';

  const eleves = ref([]);
  
  onMounted(() => {
  axios.get('http://localhost:3001/eleves')
    .then(response => {
      eleves.value = response.data;
    })
    .catch(error => {
      console.error('Error fetching students:', error);
    });
});
  </script>
  