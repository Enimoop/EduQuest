<template>
    <NuxtLayout layout="default">
        <div>
            <br>
            <AdminUpgradeProfil />
        </div>
    </NuxtLayout>
</template>

<script setup>
import AdminUpgradeProfil from '~/components/AdminUpgradeProfil.vue';
import 'bootstrap/dist/css/bootstrap.css'

import { getSubFromToken, returnUserType } from "../utils/session.mjs";
import { useRouter } from 'vue-router';

const router = useRouter();

const headers = useRequestHeaders(["cookie"]);

const { data: token } = await useFetch("/api/token", { headers });

const id = getSubFromToken(token);

const type = await returnUserType(id);
if (type !== "Admin") {
    router.push("/");
}

</script>
