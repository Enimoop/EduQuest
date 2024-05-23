<template>
    <div class="container container-cours">
        <h1 class="title title-cours">{{ nom_guilde}}</h1>
        <div class="cours-details">
            <div class="row">
                <div class="col-md-4" v-for="contenu in contenus" :key="contenu.id">
                    <router-link :to="'/' + contenu.type_contenu.toLowerCase() + '/' + contenu.id"
                        class="col text-decoration-none">
                        <div class="card mb-4 contenu-card">
                            <div class="card-body">
                                <h5 class="card-title">{{ contenu.description_contenu }}</h5>
                                <p class="card-text"><small class="text-muted">{{ format(new Date(contenu.date_contenu),
                    'dd/MM/yyyy') }}</small></p>
                                <p class="card-text">{{ contenu.type_contenu }}</p>
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getSubFromToken, returnUserType } from "../utils/session.mjs";
import { format } from 'date-fns';
import axios from 'axios';

const headers = useRequestHeaders(["cookie"]) as HeadersInit;

const { data: token } = await useFetch("/api/token", { headers });

const idu = getSubFromToken(token);
const type = await returnUserType(idu);

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
            console.log(response.data);
            contenus.value = response.data;
            nom_guilde.value = response.data[0].nom_guilde;
            description_guilde.value = response.data[0].description_guilde;
        })
        .catch(error => {
            console.error('Error fetching contents:', error);
        });
});
</script>