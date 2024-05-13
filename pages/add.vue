<template>
    <NuxtLayout layout="default">
        <div>
            <br>
            <AjouterQuiz />
            <br>
            <AjouterCours />
        </div>
    </NuxtLayout>
</template>

<script setup>
import AjouterQuiz from '../components/AjouterQuiz.vue';
import AjouterCours from '../components/AjouterCours.vue';
import 'bootstrap/dist/css/bootstrap.css'
</script>