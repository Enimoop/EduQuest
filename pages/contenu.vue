<template>
    <br>
    <br>
        <div>
            <br>
            <ListeContenu :contenus="contenus" />
            <NuxtPage />
        </div>

</template>


<script setup>
import { ref } from 'vue';
import ListeContenu from '../components/ListeContenu.vue';
import 'bootstrap/dist/css/bootstrap.css'


const contenus = ref([]);

</script>