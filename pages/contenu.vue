<template>
    <div>
        <br>
    <ListeMatiere :matieres="matieres" />
    <NuxtPage />
</div>
</template>


<script setup>
import { ref } from 'vue';
import 'bootstrap/dist/css/bootstrap.css'
import ListeMatiere from '../components/ListeMatiere.vue';


const matieres = ref([]);

</script>