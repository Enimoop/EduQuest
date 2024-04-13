<template>
  <div class="container">
    
        <h3>Liste des contenus en {{libelle_matiere}}</h3>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">description</th>
              <th scope="col">date</th>
              <th scope="col">type</th>
            </tr>
          </thead>
          <tbody v-for="contenu in contenus" :key="contenu.id">
            <tr>
              <th scope="row">1</th>
              <td>{{ contenu.description_contenu }}</td>
              <td>{{ format(Date(contenu.date_contenu), 'dd/MM/yyyy') }}</td>
              <td>{{ contenu.type_contenu }}</td>
            </tr>
          </tbody>
        </table>

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
  axios.get(`http://localhost:3001/contenus/${id}`)
    .then(response => {
      contenus.value = response.data;
      libelle_matiere.value = response.data[0].libelle_matiere;
    })
    .catch(error => {
      console.error('Error fetching contents:', error);
    });
});
</script>