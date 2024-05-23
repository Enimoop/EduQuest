<template>
  <NuxtLayout layout="default">
    <AfficherProfil />
    <br>
    <GuildeProf v-if="type === 'Prof'"/>
    <br>
    <NotesParMatiere v-if="type === 'Eleve'"/>
    <LvlParMatiere v-if="type === 'Eleve'"/> 
  </NuxtLayout>
</template>

<script setup lang="ts">

import AfficherProfil from '../components/AfficherProfil.vue';
import LvlParMatiere from '../components/LvlParMatiere.vue';
import GuildeProf from '../components/GuildeProf.vue';
import NotesParMatiere from '../components/NotesParMatiere.vue';
import 'bootstrap/dist/css/bootstrap.css';

const headers = useRequestHeaders(["cookie"]) as HeadersInit;

const { data: token } = await useFetch("/api/token", { headers });



const id = getSubFromToken(token);
const type = await returnUserType(id);





</script>