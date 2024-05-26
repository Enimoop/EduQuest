<template>
    <div>
        <ContenuParGuilde v-if="type === 'Eleve'"/>
        <ContenuParGuildeProf v-if="type === 'Prof'"/>
        <ModifierContenu v-if="type === 'Prof'" />
        
    </div>
</template>


<script setup lang="ts">

import { ref } from 'vue';
import 'bootstrap/dist/css/bootstrap.css';
import { getSubFromToken, returnUserType } from "../../utils/session.mjs";
import ContenuParGuilde from '../../components/ContenuParGuilde.vue';
import ContenuParGuildeProf from '../../components/ContenuParGuildeProf.vue';
import { useRouter } from 'vue-router';

const headers = useRequestHeaders(["cookie"]) as HeadersInit;

const { data: token } = await useFetch("/api/token", { headers });

const id = getSubFromToken(token);
const type = await returnUserType(id);

const router = useRouter();
const contenuGuilde = ref([]);



</script>