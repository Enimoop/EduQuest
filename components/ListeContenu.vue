<template>
  <div class="container">
    <h3 class="my-4">Liste de tous contenus </h3>
    <div class="row">
      <div class="col-md-4" v-for="contenu in contenus" :key="contenu.id">
        <div class="card mb-4 contenu-card">
          <div class="card-body">
            <h5 class="card-title">{{ contenu.description_contenu }}</h5>
            <p class="card-text"><small class="text-muted">{{  format(new Date(contenu.date_contenu), 'dd/MM/yyyy')}}</small></p>
            <p class="card-text">{{ contenu.type_contenu }}</p> 
          </div>
        </div>
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


const contenus = ref([]);
  
  onMounted(() => {
  axios.get(`http://localhost:3001/contenus/all/${id}`)
    .then(response => {
      contenus.value = response.data;
    })
    .catch(error => {
      console.error('Error fetching contents:', error);
    });
});
  </script>
  