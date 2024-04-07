<template>
    <div>
      <h1>Liste des élèves</h1>
      <ul class = "list-group">
        <li v-for="eleve in eleves" :key="eleve.id_u" class="list-group-item">
          {{ eleve.nom }} {{ eleve.prenom }}
        </li>
      </ul>
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
  