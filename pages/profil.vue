<template>
<br>
    <br>

    <div class="container mt-5">
      <!-- Section de bienvenue -->
      <div class="text-center mb-5">
        <h1 class="display-4">Profil</h1>
        <p class="lead"></p>
      </div>
    <AfficherProfil />
    <br>
    <NotesParMatiere v-if="type === 'Eleve'"/>
    <LvlParMatiere v-if="type === 'Eleve'"/> 

    </div>

</template>

<script setup lang="ts">

import AfficherProfil from '../components/AfficherProfil.vue';
import LvlParMatiere from '../components/LvlParMatiere.vue';
import NotesParMatiere from '../components/NotesParMatiere.vue';
import 'bootstrap/dist/css/bootstrap.css';

const headers = useRequestHeaders(["cookie"]) as HeadersInit;

const { data: token } = await useFetch("/api/token", { headers });



const id = getSubFromToken(token);
const type = await returnUserType(id);





</script>