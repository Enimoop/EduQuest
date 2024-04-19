<template>
  <div class="container">
    <h3 class="my-4">Liste des contenus en {{ libelle_matiere }}</h3>
    <div class="row">
      <div class="col-md-4">
        <router-link
        v-for="contenu in contenus"
        :key="contenu.id"
        :to="'/' +contenu.type_contenu.toLowerCase() +'/' + contenu.id"
        class="col text-decoration-none"
        >
        <div class="card mb-4 contenu-card">
          <div class="card-body">
            <h5 class="card-title">{{ contenu.description_contenu }}</h5>
            <p class="card-text"><small class="text-muted">{{ format(Date(contenu.date_contenu), 'dd/MM/yyyy') }}</small></p>
            <p class="card-text">{{ contenu.type_contenu }}</p>
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

const contenus = ref([]);
const libelle_matiere = ref('');



onMounted(() => {
  const route = useRoute()
  const id = route.params.id;
  axios.get(`http://localhost:3001/matieres/${id}`)
    .then(response => {
      contenus.value = response.data;
      libelle_matiere.value = response.data[0].libelle_matiere;
    })
    .catch(error => {
      console.error('Error fetching contents:', error);
    });
});
</script>