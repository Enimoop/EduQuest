<template>
  <div class="container container-cours">
    <div class="row justify-content-center">
      <div class="cours-details">
        <h2>Tableau de bord des élèves</h2>
        <div v-if="showSuccessMessage" class="alert alert-success alert-dismissible fade show" role="alert">
          L'élève a été ajouté avec succès !
          <button type="button" class="btn-close" @click="hideSuccessMessage" aria-label="Close"></button>
        </div>
        <div class="search-bar mb-3 d-flex align-items-center">
          <div class="position-relative flex-grow-1 me-2">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher un élève par nom ou prénom"
              class="form-control mb-2"
              @input="searchEleves"
            />
            <ul v-if="searchResults.length > 0" class="list-group position-absolute start-0 w-100 shadow" style="z-index: 1000;">
              <li class="list-group-item" v-for="result in searchResults" @click="selectUser(result)">
                {{ result.mail }}
              </li>
            </ul>
          </div>
          <button @click="addEleveToGuilde(selectedUser)" class="btn btn-success btn-sm">Ajouter</button>
        </div>
        <!-- Tableau des élèves -->
        <table class="table table-striped table-hover">
          <!-- Table header -->
          <thead>
            <tr>
              <th scope="col" class="text-center">Nom</th>
              <th scope="col" class="text-center">Prénom</th>
              <th scope="col" class="text-center">Retirer</th>
              <th scope="col" class="text-center">Actions</th>
            </tr>
          </thead>
          <!-- Table body -->
          <tbody>
            <template v-for="eleve in eleves" :key="eleve.id">
              <tr>
                <td>{{ eleve.nom }}</td>
                <td>{{ eleve.prenom }}</td>
                <td><button @click="retirerEleve(eleve.id)" class="btn btn-danger btn-sm">Retirer</button></td>
                <td><button @click="voirPlus(eleve.id)" class="btn btn-primary btn-sm">Voir plus</button></td>
              </tr>
              <!-- Tableau des notes -->
              <tr v-if="currentEleveId === eleve.id">
                <td colspan="4">
                  <h5 class="mt-3">Notes de l'élève</h5>
                  <table class="table table-striped table-hover mt-2">
                    <!-- Table header -->
                    <thead class="thead-dark">
                      <tr>
                        <th scope="col" class="text-center">Titre du contenu</th>
                        <th scope="col" class="text-center">Note</th>
                        <th scope="col" class="text-center">Date de la note</th>
                      </tr>
                    </thead>
                    <!-- Table body -->
                    <tbody>
                      <tr v-for="note in currentEleveNotes" :key="note.id">
                        <td>{{ note.titre }}</td>
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
        <!-- Pagination controls -->
        <div class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1">Précédent </button>
          <span> Page {{ currentPage }} </span>
          <button @click="nextPage" :disabled="isLastPage" >Suivant</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns';
import { onMounted, ref, computed, watch } from 'vue';
import { getSubFromToken, returnUserType } from "../utils/session.mjs";
import axios from 'axios';
import { useRoute } from 'vue-router';

const headers = useRequestHeaders(["cookie"]) as HeadersInit;
const { data: token } = await useFetch("/api/token", { headers });
const idu = getSubFromToken(token);
const type = await returnUserType(idu);
const route = useRoute();
const id = route.params.id;

interface Eleves {
  id: number;
  mail: string;
  nom: string;
  prenom: string;
}

interface Notes {
  id: number;
  titre: string;
  description: string;
  note: number;
  date: string;
}

const eleves = ref<Eleves[]>([]);
const searchQuery = ref('');
const searchResults = ref<Eleves[]>([]);
const currentEleveNotes = ref<Notes[] | null>(null);
const currentEleveId = ref<number | null>(null);
const selectedUser = ref<Eleves>({ id: 0, mail: "", nom: "", prenom: "" });

const currentPage = ref(1);
const pageSize = 5;
const totalEleves = ref(0);
const showSuccessMessage = ref(false);

const resetSearch = () => {
  searchQuery.value = '';
  searchResults.value = [];
};

const fetchEleves = async (page: number, pageSize: number) => {
  try {
    const response = await axios.get(`http://localhost:3001/eleves/guilde/${id}`, {
      params: { page, pageSize }
    });
    eleves.value = response.data.eleves;
    totalEleves.value = response.data.total;
  } catch (error) {
    console.error('Error fetching eleves:', error);
  }
};

onMounted(() => {
  fetchEleves(currentPage.value, pageSize);
});

watch(currentPage, () => {
  fetchEleves(currentPage.value, pageSize);
});

const searchEleves = (event: Event) => {
  const query = (event.target as HTMLInputElement).value;
  if (query.length > 1) {
    axios.get(`http://localhost:3001/eleves/nom/${query}/guilde/${id}`)
      .then(response => {
        searchResults.value = response.data;
      })
      .catch(error => {
        console.error('Error searching profils:', error);
      });
  } else {
    searchResults.value = [];
  }
};

const selectUser = (user: Eleves) => {
  axios.get(`http://localhost:3001/profils/id/${user.id}`)
    .then(response => {
      selectedUser.value = response.data;
      searchQuery.value = selectedUser.value.mail;
      searchResults.value = [];
    })
    .catch(error => {
      console.error('Error fetching user:', error);
    });
};

const addEleveToGuilde = async (eleve: Eleves) => {
  const nouveauEleve = { id: eleve.id, id_guilde: id };
  try {
    await axios.post('http://localhost:3001/guildes/addEleve', nouveauEleve, {
      headers: { 'Content-Type': 'application/json' }
    });
    await fetchEleves(currentPage.value, pageSize);
    resetSearch();
    showSuccessMessage.value = true;
  } catch (error) {
    console.error('Error adding eleve to guilde:', error);
  }
};

const retirerEleve = async (eleveId: number) => {
  try {
    await axios.delete(`http://localhost:3001/guildes/deleteEleve/${eleveId}`);
    await fetchEleves(currentPage.value, pageSize);
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'élève:', error);
  }
};

const voirPlus = (eleveId: number) => {
  if (currentEleveId.value === eleveId) {
    currentEleveId.value = null;
    return;
  }
  axios.get(`http://localhost:3001/eleves/guilde/${eleveId}/${id}`)
    .then(response => {
      currentEleveNotes.value = response.data;
      currentEleveId.value = eleveId;
    })
    .catch(error => {
      console.error('Error fetching eleve notes:', error);
    });
};

const nextPage = () => {
  if ((currentPage.value * pageSize) < totalEleves.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const isLastPage = computed(() => {
  return (currentPage.value * pageSize) >= totalEleves.value;
});

const hideSuccessMessage = () => {
  showSuccessMessage.value = false;
};
</script>

<style scoped>
.list-group {
  max-height: 200px;
  overflow-y: auto;
}

.cours-details {
  margin-top: 32px;
}

.search-bar {
  display: flex;
  align-items: center;
}

.search-bar .form-control {
  flex-grow: 1;
  margin-right: 10px;
}

.search-bar button {
  margin-left: 10px;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
}
.pagination button {
    margin: 0 10px;
}
</style>
