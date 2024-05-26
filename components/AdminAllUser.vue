<template>
    <div class="container container-cours">
        <h1 class="title title-cours">Gérer les utilisateurs</h1>
        <div class="cours-details">
            <div class="table-responsive w-100">
            <table class="table table-striped table-hover mt-2">
                <thead>
                    <tr>
                        <th scope="col" class="text-center">ID</th>
                        <th scope="col" class="text-center">Nom</th>
                        <th scope="col" class="text-center">Prenom</th>
                        <th scope="col" class="text-center">Mail</th>
                        <th scope="col" class="text-center">Type</th>
                        <th scope="col" class="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.id">
                        <td>{{ user.id }}</td>
                        <td>{{ user.nom }}</td>
                        <td>{{ user.prenom }}</td>
                        <td>{{ user.mail }}</td>
                        <td>{{ user.type }}</td>
                        <td>
                            <button @click="supprimerUser(user.id)" class="btn btn-danger">
                                Retirer
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- Pagination -->
        <div class="pagination">
            <button @click="prevPage" :disabled="currentPage === 1">Précédent</button>
            <span>Page {{ currentPage }}</span>
            <button @click="nextPage" :disabled="isLastPage">Suivant</button>
        </div>
    </div>
    </div>
</template>

<script setup lang="ts">

import { ref, onMounted, computed } from 'vue';
import axios from 'axios';



const headers = useRequestHeaders(["cookie"]) as HeadersInit;

const { data: token } = await useFetch("/api/token", { headers });

const idu = getSubFromToken(token);

interface Users {
    id: number;
    nom: string;
    prenom: string;
    mail: string;
    type: string;
}

const users = ref<Users[]>([]);
const currentPage = ref(1);
const pageSize = 5;
const totalUsers = ref(0);




const fetchUsers = async (page: number, pageSize: number) => {

    try {
        const response = await axios.get(`http://localhost:3001/profils`, {
            params: {
                page,
                pageSize
            }
        });
        users.value = response.data.profils;
        totalUsers.value = response.data.total;

    } catch (error) {
        console.error('Error fetching contents:', error);
    }
};

onMounted(() => {
    fetchUsers(currentPage.value, pageSize);
});

watch([currentPage, totalUsers], () => {
    fetchUsers(currentPage.value, pageSize);
});

const nextPage = () => {
    if ((currentPage.value * pageSize) < totalUsers.value) {
        currentPage.value++;
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

const isLastPage = computed(() => {
    return (currentPage.value * pageSize) >= totalUsers.value;
});

const supprimerUser = async (id: number) => {
    if (!confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
        return;
    }

    try {
        await axios.delete(`http://localhost:3001/profils/${id}`);
        fetchUsers(currentPage.value, pageSize); // Rafraîchir les contenus après la suppression
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    }
};




</script>
<style>
.list-group {
    max-height: 200px;
    overflow-y: auto;
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

.table-responsive th,
.table-responsive td {
    vertical-align: middle;
    text-align: center;
}
</style>