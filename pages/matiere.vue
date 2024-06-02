<template>

    <div>
        <br>
    <ListeMatiere :matieres="matieres" />
    <NuxtPage />
</div>

</template>


<script setup>
import { ref } from 'vue';
import ListeMatiere from '../components/ListeMatiere.vue';
import 'bootstrap/dist/css/bootstrap.css'


const matieres = ref([]);

</script>