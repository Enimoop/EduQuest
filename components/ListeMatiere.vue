<template>
<h1>Liste des matières</h1>
    <ul>
      <li v-for="matiere in matieres" :key="matieres.id_matiere">
        {{ matiere.id_matiere }} {{ matiere.libelle_matiere }} 
      </li>
    </ul>

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