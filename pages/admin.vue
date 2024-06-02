<template>
    <NuxtLayout layout="default">
        <div>
            <br>
            <AdminAllUser />
            <br>
            <AdminUpgradeProfil />
            <br>
            <AjouterContenu />
        </div>
    </NuxtLayout>
</template>

<script setup>
import AdminAllUser from '~/components/AdminAllUser.vue';
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
