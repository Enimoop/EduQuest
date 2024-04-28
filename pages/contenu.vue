<template>
    <NuxtLayout layout="default">
        <div>
            <br>
            <ListeContenu :contenus="contenus" />
            <NuxtPage />
        </div>
    </NuxtLayout>
</template>


<script setup>
import { ref } from 'vue';
import ListeContenu from '../components/ListeContenu.vue';
import 'bootstrap/dist/css/bootstrap.css'


const contenus = ref([]);

</script>