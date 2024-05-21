<template>
    <div>
      <h1>Tableau de bord des guildes</h1>
  
      <!-- Liste des guildes -->
      <ul class="list-group">
        <li v-for="guilde in guildes" :key="guilde.id" class="list-group-item">
          <!-- Nom de la guilde et bouton pour afficher les détails -->
          <div>
            <button @click="fetchGuildDetails(guilde.id)" class="btn btn-link">{{ guilde.nom }}</button>
          </div>
  
          <!-- Affichage des détails de la guilde -->
          <div v-if="currentGuildeId === guilde.id">
            <p>{{ guilde.description }}</p>
  
            <!-- Bouton pour ajouter un élève -->
            <button @click="() => toggleSearchForm(guilde.id)" class="btn btn-primary">Ajouter un élève</button>
  
            <!-- Formulaire de recherche -->
            <div v-if="showSearchForm">
              <input v-model="searchQuery" type="text" placeholder="Rechercher un élève par nom ou prénom" class="form-control mb-2" />
              <ul v-if="searchQuery && searchResults.length > 0" class="list-group">
                <li v-for="result in searchResults" :key="result.id" class="list-group-item">
                  {{ result.nom }} {{ result.prenom }}
                  <button @click="addEleveToGuilde(result, guilde.id)" class="btn btn-primary">Ajouter</button>
                </li>
              </ul>
            </div>
  
            <!-- Tableau des élèves -->
            <table class="table table-striped table-hover mt-2">
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
                  <tr>
                    <td>{{ eleve.nom }}</td>
                    <td>{{ eleve.prenom }}</td>
                    <td><button @click="retirerEleve(eleve.id)" class="btn btn-danger">Retirer</button></td>
                    <td><button @click="voirPlus(eleve.id, guilde.id)" class="btn btn-primary">Voir plus</button></td>
                  </tr>
  
                  <!-- Tableau des notes -->
                  <tr v-if="currentEleveId === eleve.id">
                    <td colspan="4">
                      <h3>Notes de l'élève</h3>
                      <table class="table table-striped table-hover">
                        <thead>
                          <tr>
                            <th scope="col">Description du contenu</th>
                            <th scope="col">Note</th>
                            <th scope="col">Date de la note</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="note in currentEleveNotes" :key="note.id">
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
        </li>
      </ul>
  
      <!-- Bouton pour créer une nouvelle guilde -->
      <button @click="toggleNewGuildeForm" class="btn btn-primary mt-3">Créer une nouvelle guilde</button>
  
      <!-- Formulaire pour créer une nouvelle guilde -->
      <div v-if="showNewGuildeForm" class="mt-3">
        <h3>Créer une nouvelle guilde</h3>
        <form @submit.prevent="creerNouvelleGuilde">
          <div class="mb-3">
            <label for="nomGuilde" class="form-label">Nom de la guilde</label>
            <input v-model="nouvelleGuilde.nom" type="text" class="form-control" id="nomGuilde" required>
          </div>
          <div class="mb-3">
            <label for="descriptionGuilde" class="form-label">Description de la guilde</label>
            <textarea v-model="nouvelleGuilde.description" class="form-control" id="descriptionGuilde" rows="3" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Créer</button>
        </form>
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
const showNewGuildeForm = ref(false);
const nouvelleGuilde = ref({ nom: '', description: '' });

onMounted(() => {
    axios.get(`http://localhost:3001/guildes/prof/${id}`)
        .then(response => {
            guildes.value = response.data;
        })
        .catch(error => {
            console.error('Error fetching guilds:', error);
        });
});

// Fonction pour récupérer les détails de la guilde et les élèves associés
const fetchGuildDetails = (guildeId: number) => {
    if (currentGuildeId.value === guildeId) {
        currentGuildeId.value = null;
        return;
    }
    axios.get(`http://localhost:3001/eleves/guilde/${guildeId}`)
        .then(response => {
            eleves.value = response.data;
            currentGuildeId.value = guildeId;
        })
        .catch(error => {
            console.error('Error fetching guild details:', error);
        });
};

// Toggle search form visibility
const toggleSearchForm = (guildeId: number) => {
    showSearchForm.value = !showSearchForm.value;
    currentGuildeId.value = guildeId;
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

const retirerEleve = (eleveId: number) => {
    axios.delete(`http://localhost:3001/guildes/deleteEleve/${eleveId}`)
        .then(response => {
            // Rafraîchir la liste des élèves après la suppression
            return axios.get(`http://localhost:3001/eleves/guilde/${currentGuildeId.value}`);
        })
        .then(response => {
            eleves.value = response.data;
        })
        .catch(error => {
            console.error('Erreur lors de la suppression de l\'élève:', error);
        });
};

const voirPlus = (eleveId: number, guildeId:number) => {
    if (currentEleveId.value === eleveId) {
        currentEleveId.value = null;
        return;
    }
    axios.get(`http://localhost:3001/eleves/guilde/${eleveId}/${guildeId}`)
        .then(response => {
            currentEleveNotes.value = response.data;
            currentEleveId.value = eleveId;
        })
        .catch(error => {
            console.error('Error fetching eleve notes:', error);
        });
};

const toggleNewGuildeForm = () => {
    showNewGuildeForm.value = !showNewGuildeForm.value;
};

// Créer une nouvelle guilde
const creerNouvelleGuilde = () => {
    axios.post(`http://localhost:3001/guildes/addGuilde`, {
        nom_guilde: nouvelleGuilde.value.nom,
        description_guilde: nouvelleGuilde.value.description,
        id_prof: id // Utilisation de l'ID du professeur connecté
    })
        .then(response => {
            // Réinitialiser le formulaire et masquer le formulaire de création de guilde
            nouvelleGuilde.value.nom = '';
            nouvelleGuilde.value.description = '';
            showNewGuildeForm.value = false;
            // Rafraîchir la liste des guildes
            refreshGuildes();
        })
        .catch(error => {
            console.error('Erreur lors de la création de la guilde:', error);
        });
};

const refreshGuildes = () => {
    axios.get(`http://localhost:3001/guildes/prof/${id}`)
        .then(response => {
            guildes.value = response.data;
        })
        .catch(error => {
            console.error('Erreur lors du rafraîchissement des guildes:', error);
        });
};
</script>