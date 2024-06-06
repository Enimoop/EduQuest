<template>
<br>
    <br>
        <div>
            <NuxtPage />

        </div>

</template>

<script setup>
import { ref, computed } from 'vue';
import 'bootstrap/dist/css/bootstrap.css';
import { useRouter } from 'vue-router';

const router = useRouter();
const cours = ref([]);


</script>