<template>
    <div>
        <ContenuParGuilde :contenuGuilde="contenuGuilde"/>
    </div>
</template>


<script setup>

import { ref } from 'vue';
import 'bootstrap/dist/css/bootstrap.css'
import ContenuParGuilde from '../../components/ContenuParGuilde.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const contenuGuilde = ref([]);

</script>