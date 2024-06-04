<template>

    <AfficherAccueil />
    <br>

</template>

<script setup lang="ts">
import AfficherAccueil from '~/components/AfficherAccueil.vue';
import 'bootstrap/dist/css/bootstrap.css';

const headers = useRequestHeaders(["cookie"]) as HeadersInit;

const { data: token } = await useFetch("/api/token", { headers });



const id = getSubFromToken(token);
const type = await returnUserType(id);
</script>
