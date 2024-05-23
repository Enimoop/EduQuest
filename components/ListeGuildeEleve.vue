<template>
    <div class="container">
      <h3 class="my-4">Liste de tes Guildes </h3>
      <div class="row">
        <div class="col-md-4" v-for="guilde in guildes" :key="guilde.id">
          <router-link :to="'/guilde/' + guilde.id" class="col text-decoration-none">
            <div class="card mb-4 contenu-card">
              <div class="card-body">
                <h5 class="card-title">{{ guilde.nom }}</h5>
                <p class="card-text"><small class="text-muted">{{ guilde.prof }}</small></p>
                <!-- <p class="card-text">{{ cour.type_contenu }}</p>  -->
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getSubFromToken, returnUserType } from "../utils/session.mjs";
import axios from 'axios';

const headers = useRequestHeaders(["cookie"]) as HeadersInit;

const { data: token } = await useFetch("/api/token", { headers });

const id = getSubFromToken(token);


interface Guildes {
    id: number;
    nom: string;
    description: string;
    prof: string;
}

const guildes = ref<Guildes[]>([]);
  
  onMounted(() => {
  axios.get(`http://localhost:3001/guildes/eleve/${id}`)
    .then(response => {
      guildes.value = response.data;
    })
    .catch(error => {
      console.error('Error fetching guildes:', error);
    });
});

</script>