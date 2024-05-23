<template>
  <div class="container">
    <h3 class="my-4">Liste de tous Cours </h3>
    <div class="row">
      <div class="col-md-4" v-for="cour in cours" :key="cour.id">
        <router-link :to="'/cours/' + cour.id" class="col text-decoration-none">
          <div class="card mb-4 contenu-card">
            <div class="card-body">
              <h5 class="card-title">{{ cour.description_contenu }}</h5>
              <p class="card-text"><small class="text-muted">{{ format(new Date(cour.date_contenu), 'dd/MM/yyyy') }}</small></p>
              <!-- <p class="card-text">{{ cour.type_contenu }}</p>  -->
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { format } from 'date-fns';
import { ref, onMounted } from 'vue';
import axios from 'axios';

const headers = useRequestHeaders(["cookie"]) as HeadersInit;

const { data: token } = await useFetch("/api/token", { headers });

const id = getSubFromToken(token);


const cours = ref([]);


  onMounted(() => {
  axios.get(`http://localhost:3001/contenus/cours/${id}`)
    .then(response => {
      cours.value = response.data;
    })
    .catch(error => {
      cours.error('Error fetching lesson:', error);
    });
});
  </script>