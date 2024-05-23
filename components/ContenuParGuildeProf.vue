<template>
    <div class="container container-cours">
        <h1 class="title title-cours">{{ nom_guilde}}</h1>
        <div class="cours-details">

        <!-- Liste des guildes -->

        <!-- Tableau des élèves -->
        <table class="table table-striped table-hover mt-2">
            <thead>
                <tr>
                    <th scope="col">Titre</th>
                    <th scope="col">date</th>
                    <th scope="col">Retirer</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>

                <tr v-for="contenu in contenus" :key="contenu.id">
                    <td>{{ contenu.description_contenu }}</td>
                    <td>{{ format(new Date(contenu.date_contenu),
                    'dd/MM/yyyy')}}</td>
                    <td><button @click="retirerContenu(contenu.id)" class="btn btn-danger">Retirer</button></td>
                    <td><button @click="voirPlus(eleve.id, guilde.id)" class="btn btn-primary">Voir plus</button>
                    </td>
                    <td><button @click="voirPlus(eleve.id, guilde.id)" class="btn btn-primary">Modifier</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
</template>

<script setup lang="ts">

import { format } from 'date-fns';
import { ref, onMounted } from 'vue';
import axios from 'axios';


const headers = useRequestHeaders(["cookie"]) as HeadersInit;

const { data: token } = await useFetch("/api/token", { headers });

const idu = getSubFromToken(token);

interface Contenus {
    id: number;
    description_contenu: string;
    date_contenu: string;
    type_contenu: string;
}

const nom_guilde = ref('');
const description_guilde = ref('');

const contenus = ref<Contenus[]>([]);

onMounted(() => {
    const route = useRoute()
    const id = route.params.id;
    axios.get(`http://localhost:3001/contenus/guilde/${id}`)
        .then(response => {
            contenus.value = response.data;
            nom_guilde.value = response.data[0].nom_guilde;
            description_guilde.value = response.data[0].description_guilde;
        })
        .catch(error => {
            console.error('Error fetching contents:', error);
        });
});

const retirerContenu = (id: number) => {
  axios.delete(`http://localhost:3001/contenus/delete/${id}`)
    .then(() => {
      // Supprimer le contenu de la liste locale après suppression réussie
      contenus.value = contenus.value.filter(contenu => contenu.id !== id);
    })
    .catch(error => {
      console.error('Erreur lors de la suppression du contenu:', error);
    });
};

</script>
