<template>
    <div class="accordion" id="accordionPanelsStayOpenExample">
        <div  v-for="guilde in guildes" :key="guilde.id" class="accordion-item">
            <h2 class="accordion-header" :id="'panelsStayOpen-heading' + guilde.id">
                <button class="accordion-button" type="button" data-bs-toggle="collapse"
                    :data-bs-target="'#panelsStayOpen-collapse' + guilde.id" aria-expanded="true"
                    :aria-controls="'panelsStayOpen-collapse' + guilde.id">
                    {{ guilde.nom }}
                </button>
            </h2>
            <div :id="'panelsStayOpen-collapse' + guilde.id" class="accordion-collapse collapse show"
                :aria-labelledby="'panelsStayOpen-heading' + guilde.id">
                <div class="accordion-body">
                    <strong>{{ guilde.description }}</strong>
                    <!-- Tableau des élèves-->
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Nom</th>
                                <th scope="col">Prénom</th>
                                <th scope="col">Retirer</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="eleve in eleves" :key="eleve.id">
                                <td>{{ eleve.nom }}</td>
                                <td>{{ eleve.prenom }}</td>
                                <td>un bouyon</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div> 
    </div>

</template>

<script setup lang="ts">
import { onMounted,ref } from 'vue';
import { getSubFromToken, returnUserType } from "../utils/session.mjs";
import axios from 'axios';

const headers = useRequestHeaders(["cookie"]) as HeadersInit;

const { data: token } = await useFetch("/api/token", { headers });



const id = getSubFromToken(token);
const type = await returnUserType(id);

interface Guildes {
    id: number;
    nom: string;
    description: string;
    id_prof: number;
}

interface Eleves {
    id: number;
    nom: string;
    prenom: string;
}

const guildes = ref<Guildes[]>([]);
const eleves = ref<Eleves[]>([]);

onMounted(() => {
    axios.get(`http://localhost:3001/guildes/prof/${id}`)
        .then(response => {
            guildes.value = response.data;
            console.log(guildes.value);
            console.log(guildes.value[0].id_prof);

            axios.get(`http://localhost:3001/eleves/guilde/${guildes.value[0].id}`)
                .then(response => {
                    eleves.value = response.data;
                    console.log(eleves.value);
                })
                .catch(error => {
                    console.error('Error fetching eleves:', error);
                });
        })
        .catch(error => {
            console.error('Error fetching guilds:', error);
        });
})

</script>