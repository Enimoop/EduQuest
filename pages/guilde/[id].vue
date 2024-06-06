<template>
  <br>
  <br>
    <div class="text-center">
        <h1 class="title title-cours">{{ guilde.nom }}</h1>
        <p class="guilde-description">{{ guilde.description }}</p>

        <div class="btn-group mb-4" role="group">
            <button v-if="type === 'Prof'" @click="showContenuParGuildeProf" class="btn btn-outline-primary">Contenu</button>
            <button v-if="type === 'Prof'" @click="showGuildeProf" class="btn btn-outline-primary">Élèves</button>
            <button v-if="type === 'Prof'" @click="deleteGuilde" class="btn btn-outline-danger">Supprimer la guilde</button>
        </div>

      <div class="content-area">
        <ContenuParGuilde v-if="type === 'Eleve'" />
        <ContenuParGuildeProf v-if="type === 'Prof' && currentView === 'contenuParGuildeProf'" />
        <GuildeProf v-if="type === 'Prof' && currentView === 'guildeProf'" />
      </div>
    </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import 'bootstrap/dist/css/bootstrap.css';
import { getSubFromToken, returnUserType } from "../../utils/session.mjs";
import ContenuParGuilde from '../../components/ContenuParGuilde.vue';
import ContenuParGuildeProf from '../../components/ContenuParGuildeProf.vue';
import GuildeProf from '~/components/GuildeProf.vue';
import { useRouter, useRoute } from 'vue-router';
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

const fetchGuilde = async () => {
  await axios.get(`http://localhost:3001/guildes/${id}`)
    .then(response => {
      guilde.value = response.data;
    })
    .catch(error => {
      console.error('Error fetching guilde:', error);
    });
};

const deleteGuilde = async () => {
  try {
    await axios.delete(`http://localhost:3001/guildes/delete/${id}`);
    router.push('/guilde');
  } catch (error) {
    console.error('Error deleting guilde:', error);
  }
};

if (type =="Eleve") {
  const accesAutorise = await verifierAccesGuildeEleve(idu,id);
  if (!accesAutorise) {
    router.push('/guilde');
  }
} else if (type == "Prof"){
  const accesAutorise = await verifierAccesGuildeProf(idu,id);
  if (!accesAutorise) {
    router.push('/guilde');
  }
}

onMounted(async () => {
  fetchGuilde();
});
</script>
<style scoped>
.container {
  max-width: 700px; /* Adjust the max-width as needed */
  margin: 0 auto;
  padding: 20px;
}

.title-cours {
  font-size: 2rem;
  font-weight: bold;
  color: #343a40;
  margin-bottom: 10px;
}

.guilde-description {
  font-size: 1rem;
  color: #6c757d;
  margin-bottom: 20px;
}

.btn-group .btn {
  margin: 5px;
}

.content-area {
  margin-top: 20px;
}
</style>
