
<template>

    <div>
    <ContenusParMatiere :contenus_matiere="contenus_matiere" />
</div>

</template>


<script setup>

import { ref } from 'vue';
import 'bootstrap/dist/css/bootstrap.css'
import ContenusParMatiere from '../../components/ContenusParMatiere.vue';

const contenus_matiere = ref([]);

</script>