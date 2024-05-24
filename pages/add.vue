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
import { getSubFromToken, returnUserType } from "../utils/session.mjs";
import { useRouter } from 'vue-router';

const router = useRouter();

const headers = useRequestHeaders(["cookie"]);

const { data: token } = await useFetch("/api/token", { headers });

const id = getSubFromToken(token);

const type = await returnUserType(id);
if (type !== "Prof" && type !== "Admin") {
    router.push("/");
}
</script>