<template>
    <div class="container mt-5">
        <div class="card">
            <div class="card-header custom-card-header text-white text-center">
                <h5 class="card-title mb-0">Recherche Utilisateur</h5>
            </div>
            <div class="card-body">
                <form @submit.prevent="handleUpdate">
                    <div v-if="success" class="alert alert-success alert-dismissible fade show" role="alert">
                        {{ success }}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"
                            @click="success = ''"></button>
                    </div>
                    <div v-if="errorNot" class="alert alert-danger alert-dismissible fade show" role="alert">
                        {{ errorNot }}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"
                            @click="errorNot = ''"></button>
                    </div>
                    <div v-if="warning" class="alert alert-warning alert-dismissible fade show" role="alert">
                        {{ warning }}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"
                            @click="warning = ''"></button>
                    </div>
                    <div class="mb-3">
                        <div class="position-relative">
                            <label for="userEmail" class="form-label">Email :</label>
                            <input v-model="searchQuery" type="text" placeholder="Rechercher un élève par nom ou prénom"
                                class="form-control mb-2" @input="searchProfils($event)" />
                            <ul v-if="searchResults.length > 0"
                                class="list-group position-absolute start-0 w-100 shadow" style="z-index: 1000;">
                                <li class="list-group-item" v-for="result in searchResults" @click="selectUser(result)">
                                    {{ result.mail }}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="userId" class="form-label">Identifiant : <span id="userId">{{ idUser }}</span></label>
                        <small class="text-muted d-block">Cet identifiant est unique pour chaque utilisateur.</small>
                    </div>
                    <div class="mb-3">
                        <label for="userType" class="form-label">Type :</label>
                        <select v-model="typeUser" class="form-select" id="userType">
                            <option value="Eleve">Eleve</option>
                            <option value="Prof">Prof</option>
                        </select>
                    </div>
                    <div class="text-center">
                        <button type="submit" class="btn btn-primary">Mettre à jour</button>
                        <button type="button" class="btn btn-danger ms-2" @click="handleDelete">Supprimer</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getSubFromToken, returnUserType } from "../utils/session.mjs";
import { updateProfil, hashPassword } from "../utils/func.mjs";
import axios from 'axios';
import { id } from 'date-fns/locale';

const headers = useRequestHeaders(["cookie"]) as HeadersInit;

const { data: token } = await useFetch("/api/token", { headers });

const idu = getSubFromToken(token);
const type = await returnUserType(idu);

const { status } = useAuth();

const errorNot = ref<string>("");
const warning = ref<string>("");
const success = ref<string>("");
const searchQuery = ref<string>("");
const searchResults = ref<any[]>([]);;
const typeUser = ref<string>("");
const idUser = ref<number>();

interface User {
    id: number;
    mail: string;
    type: string;
}

const user = ref<User>({
    id: 0,
    mail: "",
    type: "",
});

const selectedUser = ref<User>({
    id: 0,
    mail: "",
    type: "",
});


const handleUpdate = async () => {
    if (idUser.value === 0) {
        errorNot.value = "Veuillez sélectionner un utilisateur.";
        return;
    }
    if (typeUser.value === "") {
        errorNot.value = "Veuillez sélectionner un type d'utilisateur.";
        return;
    }
    try {
        const newType = {
            id: idUser.value,
            type: typeUser.value
        }
        const updatedUser = await axios.put(`http://localhost:3001/profils/update/type`, newType, {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        );

        success.value = "Profil mis à jour avec succès.";
    } catch (error) {
        console.error('Error updating user:', error);
        errorNot.value = "Erreur lors de la mise à jour du profil.";
    }


};

const handleDelete = async () => {
    if (idUser.value === 0) {
        errorNot.value = "Veuillez sélectionner un utilisateur.";
        return;
    }
    try {
        await axios.delete(`http://localhost:3001/profils/delete/${idUser.value}`);
        success.value = "Utilisateur supprimé avec succès.";
        // Reset fields after deletion
        idUser.value = 0;
        typeUser.value = "";
        selectedUser.value = { id: 0, mail: "", type: "" };
        searchQuery.value = "";
        searchResults.value = [];
    } catch (error) {
        console.error('Error deleting user:', error);
        errorNot.value = "Erreur lors de la suppression de l'utilisateur.";
    }
};


const searchProfils = (event: Event) => {
    const query = (event.target as HTMLInputElement).value;
    if (query.length > 1) {
        axios.get(`http://localhost:3001/profils/nom/${query}`)
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

const selectUser = (user: any) => {
    axios.get(`http://localhost:3001/profils/id/${user.id}`)
        .then(response => {
            selectedUser.value = response.data;
            searchQuery.value = selectedUser.value.mail;
            searchResults.value = [];
            idUser.value = selectedUser.value.id;
            typeUser.value = selectedUser.value.type;
        })
        .catch(error => {
            console.error('Error fetching user:', error);
        });
};

watch(searchQuery, (newQuery, oldQuery) => {
    if (newQuery !== selectedUser.value.mail) {
        idUser.value = 0;
        typeUser.value = "";
        selectedUser.value = { id: 0, mail: "", type: "" };
    }
});
</script>

<style>
.list-group {
    max-height: 200px;
    overflow-y: auto;
}

.custom-card-header {
  background-color: #4a87ce !important;
}

</style>