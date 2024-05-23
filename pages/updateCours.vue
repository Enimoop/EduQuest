<template>
    <NuxtLayout layout="default">
        <div>
            <NuxtPage />

        </div>
    </NuxtLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import 'bootstrap/dist/css/bootstrap.css';
import { useRouter } from 'vue-router';

const router = useRouter();
const cours = ref([]);


</script>