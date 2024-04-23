<template>
    <div class="container">
        <h1>Connexion</h1>
        <form @submit.prevent="submitForm">
        <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" v-model="email">
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password" v-model="password">
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>
</template>

<script setup>

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';



const email = ref('');
const password = ref('');

const router = useRouter();


const submitForm = () => {

    axios.get(`http://localhost:3001/profils/${email.value}`)
      .then(response => {
        const compte = response.data;
        if (compte && compte.mdp === password.value) {
            console.log('Connexion réussie');
            router.push('/');
        } else {
            alert('Email ou mot de passe incorrect');
        }
      })
      .catch(error => {
        if (error.response.status === 404) {
            alert('Aucun compte trouvé pour cet email');
        } else {
            console.error('Erreur lors de la récupération du compte:', error);
        }
      });
}
</script>