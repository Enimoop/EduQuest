<template>
    <div class="text-center">
        <br>
        <br>
        <h1 class="title title-cours">{{ guilde.nom }}</h1>
      
        <div class="btn-group mb-4" role="group">
      <button v-if="type === 'Prof'" @click="showContenuParGuildeProf" class="btn btn-outline-primary">Contenu</button>
      <button v-if="type === 'Prof'" @click="showGuildeProf" class="btn btn-outline-primary">Élèves</button>
    </div>

      <div class="content-area">
      <ContenuParGuilde v-if="type === 'Eleve'" />
      <ContenuParGuildeProf v-if="type === 'Prof' && currentView === 'contenuParGuildeProf'" />
      <GuildeProf v-if="type === 'Prof' && currentView === 'guildeProf'" />
    </div>
    </div>
  </template>

<script setup lang="ts">

import { ref } from 'vue';
import 'bootstrap/dist/css/bootstrap.css';
import { getSubFromToken, returnUserType } from "../../utils/session.mjs";
import ContenuParGuilde from '../../components/ContenuParGuilde.vue';
import ContenuParGuildeProf from '../../components/ContenuParGuildeProf.vue';
import GuildeProf from '~/components/GuildeProf.vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const headers = useRequestHeaders(["cookie"]) as HeadersInit;

const { data: token } = await useFetch("/api/token", { headers });

const idu = getSubFromToken(token);
const type = await returnUserType(idu);

const route = useRoute();
const id = route.params.id;

interface Guilde {
  id: number;
  nom: string;
  description: string;
  id_prof: number;
}

const guilde = ref<Guilde>({
  id: 0,
  nom: '',
  description: '',
  id_prof: 0,
});

const router = useRouter();
const currentView = ref<'contenuParGuildeProf' | 'guildeProf'>('contenuParGuildeProf');

const showContenuParGuildeProf = () => {
  currentView.value = 'contenuParGuildeProf';
};

const showGuildeProf = () => {
  currentView.value = 'guildeProf';
};

onMounted(() => {
  axios.get(`http://localhost:3001/guildes/${id}`)
    .then(response => {
      guilde.value = response.data;
      console.log(response.data);
    })
    .catch(error => {
      console.error('Error fetching guilde:', error);
    });
});

</script>