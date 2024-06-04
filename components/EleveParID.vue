<template>
    <div>
      <div v-if="eleve">
        <h2>Détails de l'élève</h2>
        <p>Nom: {{ eleve.nom }}</p>
        <p>Prénom: {{ eleve.prenom }}</p>
      </div>
  
      <form @submit.prevent="afficherDetailsParId">
        <label for="idEleve">ID de l'élève:</label>
        <input type="text" id="idEleve" v-model="idEleve">
        <button type="submit">Afficher les détails</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount, onUnmounted } from 'vue';
  import axios from 'axios';

  const eleve = ref(null);
  const idEleve = ref('');

  const afficherDetailsParId = () => {
    const id = parseInt(idEleve.value);
    axios.get(`http://localhost:3001/eleves/${id}`)
      .then(response => {
        eleve.value = response.data;
      })
      .catch(error => {
        console.error('Error fetching student:', error);
      });
  };

  onUnmounted(() => {
    
  });

  
  
  
  </script>
  