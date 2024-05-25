<template>
    <div class="container container-cours">
        <h1 class="title title-cours">{{ nom_guilde }}</h1>
        <div class="cours-details">
            <table class="table table-striped table-hover mt-2">
                <thead>
                    <tr>
                        <th scope="col">Titre</th>
                        <th scope="col">Date</th>
                        <th scope="col">Retirer</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="contenu in contenus" :key="contenu.id">
                        <td>{{ contenu.description_contenu }}</td>
                        <td>{{ format(new Date(contenu.date_contenu), 'dd/MM/yyyy') }}</td>
                        <td>
                            <button @click="retirerContenu(contenu.id, contenu.type_contenu)" class="btn btn-danger">
                                Retirer
                            </button>
                        </td>
                        <td>
                            <button @click="voirPlus(contenu.id, contenu.type_contenu)" class="btn btn-primary">
                                Voir plus
                            </button>
                            <button @click="modifierContenu(contenu.id, contenu.type_contenu)" class="btn btn-primary">
                                Modifier
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
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

import { format } from 'date-fns';
import { ref, onMounted, computed  } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';


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
const currentPage = ref(1);
const pageSize = 5;
const totalContenus = ref(0);

const router = useRouter();


const route = useRoute();
const id = route.params.id;


const fetchContenus = async (page: number, pageSize: number) => {
    console.log('Fetching contents...');
    console.log(page, pageSize)
    
    try {
        const response = await axios.get(`http://localhost:3001/contenus/guilde/prof/${id}`, {
            params: {
                page,
                pageSize
            }
        });
        console.log('Response data:', response.data); // Afficher les données reçues du serveur
        contenus.value = response.data.contenus;
        console.log('Updated contenus:', contenus.value); // Vérifier si contenus est correctement mis à jour
        totalContenus.value = response.data.total;
        console.log('Total contenus:', totalContenus.value);

        
        if (response.data.contenus.length > 0) {
            nom_guilde.value = response.data.contenus[0].nom_guilde;
            description_guilde.value = response.data.contenus[0].description_guilde;
        }
    } catch (error) {
        console.error('Error fetching contents:', error);
    }
};

onMounted(() => {
    fetchContenus(currentPage.value, pageSize);
});

watch([currentPage, totalContenus], () => {
    fetchContenus(currentPage.value, pageSize);
});

const nextPage = () => {
    if ((currentPage.value * pageSize) < totalContenus.value) {
        currentPage.value++;
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

const isLastPage = computed(() => {
    return (currentPage.value * pageSize) >= totalContenus.value;
});

const retirerContenu = async (id: number, type_contenu: string) => {
    if(!confirm('Voulez-vous vraiment retirer ce contenu ?')) {
        return;
    } 
    let deleteRoute = '';
    if (type_contenu === 'Exercice') {
        deleteRoute = `/delete/exercice/${id}`;
    } else if (type_contenu === 'Cours') {
        deleteRoute = `/delete/cours/${id}`;
    } else {
        console.warn('Type de contenu non pris en charge:', type_contenu);
        return;
    }

    try {
        await axios.delete(`http://localhost:3001/contenus${deleteRoute}`);
        fetchContenus(currentPage.value, pageSize); // Rafraîchir les contenus après la suppression
    } catch (error) {
        console.error('Erreur lors de la suppression du contenu:', error);
    }
};

const voirPlus = (id_contenu: number, type_contenu: string) => {
    if (type_contenu === 'Exercice') {
        router.push(`/exercice/${id_contenu}`);
    } else if (type_contenu === 'Cours') {
        router.push(`/cours/${id_contenu}`);
    } else {
        console.warn('Type de contenu non pris en charge:', type_contenu);
    }
};

const modifierContenu = (id_contenu: number, type_contenu: string) => {
    if (type_contenu === 'Exercice') {
        router.push(`/updateexo/${id_contenu}`);
    } else if (type_contenu === 'Cours') {
        router.push(`/updatecours/${id_contenu}`);
    } else {
        console.warn('Type de contenu non pris en charge:', type_contenu);
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
</style>