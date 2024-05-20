<template>
    <div class="accordion" id="accordionPanelsStayOpenExample">
        <div v-for="guilde in guildes" :key="guilde.id" class="accordion-item">
            <h2 class="accordion-header" :id="'panelsStayOpen-heading' + guilde.id">
                <button class="accordion-button" type="button" data-bs-toggle="collapse"
                    :data-bs-target="'#panelsStayOpen-collapse' + guilde.id" aria-expanded="true"
                    :aria-controls="'#panelsStayOpen-collapse' + guilde.id">
                    {{ guilde.nom }}
                </button>
            </h2>
            <div :id="'panelsStayOpen-collapse' + guilde.id" class="accordion-collapse collapse show"
                :aria-labelledby="'panelsStayOpen-heading' + guilde.id">
                <div class="accordion-body">
                    <strong>{{ guilde.description }}</strong>
                    <!-- Bouton pour afficher le formulaire de recherche -->
                    <button @click="() => toggleSearchForm(guilde.id)">Ajouter un élève</button>

                    <!-- Formulaire de recherche -->
                    <div v-if="showSearchForm">
                        <input v-model="searchQuery" type="text" placeholder="Rechercher un élève par nom ou prénom" />
                        <ul v-if="searchQuery && searchResults.length > 0" class="list-group">
                            <li v-for="result in searchResults" :key="result.id" class="list-group-item">
                                {{ result.nom }} {{ result.prenom }}
                                <button @click="addEleveToGuilde(result, guilde.id)">Ajouter</button>
                            </li>
                        </ul>
                    </div>

                    <!-- Tableau des élèves -->
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Nom</th>
                                <th scope="col">Prénom</th>
                                <th scope="col">Retirer</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="eleve in eleves" :key="eleve.id">
                                <tr >
                                    <td>{{ eleve.nom }}</td>
                                    <td>{{ eleve.prenom }}</td>
                                    <td>un bouyon</td>
                                    <td><button @click="voirPlus(eleve.id)">voir plus</button></td>
                                </tr>
                                <!-- Tableau des notes -->
                                <tr v-if="currentEleveId === eleve.id">
                                    <td colspan="4">
                                        <h3>Notes de l'élève</h3>
                                        <table class="table table-striped table-hover" style="max-width: 400px;">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Description du contenu</th>
                                                    <th scope="col">Note</th>
                                                    <th scope="col">Date de la note</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="note in currentEleveNotes" :key="note.id" class="bg-light">
                                                    <td>{{ note.description }}</td>
                                                    <td>{{ note.note }}</td>
                                                    <td>{{ format(new Date(note.date), 'dd/MM/yyyy') }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns';
import { onMounted, ref } from 'vue';
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

interface Notes {
    id: number;
    description: string;
    note: number;
    date: string;
}

const guildes = ref<Guildes[]>([]);
const eleves = ref<Eleves[]>([]);
const showSearchForm = ref(false);
const searchQuery = ref('');
const searchResults = ref<Eleves[]>([]);
const currentGuildeId = ref<number | null>(null); 
const currentEleveNotes = ref<Notes[] | null>(null);
    const currentEleveId = ref<number | null>(null);

onMounted(() => {
    axios.get(`http://localhost:3001/guildes/prof/${id}`)
        .then(response => {
            guildes.value = response.data;

            axios.get(`http://localhost:3001/eleves/guilde/${guildes.value[0].id}`)
                .then(response => {
                    eleves.value = response.data;
                })
                .catch(error => {
                    console.error('Error fetching eleves:', error);
                });
        })
        .catch(error => {
            console.error('Error fetching guilds:', error);
        });
});

// Toggle search form visibility
const toggleSearchForm = (guildeId: number) => {
    showSearchForm.value = !showSearchForm.value;
    currentGuildeId.value = guildeId;  // Définir l'ID de la guilde actuelle
};

// Watch for changes in the search query
watch(searchQuery, (newQuery) => {
    if (newQuery.length > 1 && currentGuildeId.value !== null) {
        searchEleves(newQuery, currentGuildeId.value);
    } else {
        searchResults.value = [];
    }
});

// Search for students
const searchEleves = (query: string, guildeId: number) => {
    axios.get(`http://localhost:3001/eleves/nom/${query}/guilde/${guildeId}`)
        .then(response => {
            searchResults.value = response.data;
        })
        .catch(error => {
            console.error('Error searching eleves:', error);
        });
};

// Add a student to a guild
const addEleveToGuilde = (eleve: Eleves, guildeId: number) => {
    const nouveauEleve = {
        id: eleve.id,
        id_guilde: guildeId
    };
    axios.post('http://localhost:3001/guildes/addEleve', nouveauEleve, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(() => {
            // Fetch the updated list of students for the guild
            return axios.get(`http://localhost:3001/eleves/guilde/${guildeId}`);
        })
        .then(response => {
            eleves.value = response.data;
        })
        .catch(error => {
            console.error('Error adding eleve to guilde:', error);
        });
};

const voirPlus = (eleveId: number) => {
    axios.get(`http://localhost:3001/eleves/guilde/${id}/${eleveId}`)
        .then(response => {
            currentEleveNotes.value = response.data;
            currentEleveId.value = eleveId;
        })
        .catch(error => {
            console.error('Error fetching eleve notes:', error);
        });
};

</script>