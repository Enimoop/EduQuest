<template>
  <div class="container container-cours">
    <h1 class="title title-cours">Détails du cours</h1>
    <div class="cours-details">
      <p class="cours-title">{{ cours.description_contenu }}</p>
      <p class="cours-matiere">Matière : {{ cours.libelle_matiere }}</p>
      <div class="pdf-container">
        <iframe :src="pdfPath" width="1000px" height="1000px" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const cours = ref([]);
let pdfPath = '';

onMounted(() => {
  const route = useRoute();
  const id = route.params.id;

  axios.get(`http://localhost:3001/contenus/cour/${id}`)
    .then(response => {
      cours.value = response.data;
      pdfPath = "/pdf/" + response.data.nom_fichier;
    })
    .catch(error => {
      console.error('Error fetching contents:', error);
    });
});
</script>

<style scoped>
.container-cours {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.title-cours {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #444;
}

.cours-details {
  background-color: #f4f4f4;
  padding: 2rem;
  border-radius: 5px;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cours-title {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.cours-matiere {
  font-size: 1.2rem;
  color: #666;
}

.pdf-container {
  margin-top: 2rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
}

</style>