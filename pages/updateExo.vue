<template>
    <NuxtLayout layout="default">
        <NuxtPage/>
    </NuxtLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import updateExo from '../components/updateExo.vue';
import 'bootstrap/dist/css/bootstrap.css';
import { useRouter } from 'vue-router';

const router = useRouter();
const cours = ref([]);


</script>