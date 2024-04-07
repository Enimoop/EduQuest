<template>
    <div>
      <h1>Liste des professeurs</h1>
      <ul>
        <li v-for="professeur in professeurs" :key="professeur.id_u">
          {{ professeur.nom }} {{ professeur.prenom }} {{ professeur.diplome }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';

  const professeurs = ref([]);
  
  onMounted(() => {
  axios.get('http://localhost:3001/professeurs')
    .then(response => {
      professeurs.value = response.data;
    })
    .catch(error => {
      console.error('Error fetching professeurs:', error);
    });
});
  </script>