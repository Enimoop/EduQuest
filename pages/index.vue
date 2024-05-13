<template>
   <NuxtLayout layout="default">
    <AfficherProfil />
    <br>
    <LvlParMatiere v-if="type === 'Eleve'"/> 
  <div>{{ token || "pas de token" }}</div>
  <div>
    <h1>Home</h1>
    <p>Welcome to EduQuest</p>
    
  </div>
</NuxtLayout>
</template>

<script setup lang="ts">
import AfficherProfil from '../components/AfficherProfil.vue';
import LvlParMatiere from '../components/LvlParMatiere.vue';
import 'bootstrap/dist/css/bootstrap.css';

const headers = useRequestHeaders(["cookie"]) as HeadersInit;

const { data: token } = await useFetch("/api/token", { headers });



const id = getSubFromToken(token);
const type = await returnUserType(id);
</script>
