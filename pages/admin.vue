<template>
        <br>
        <div>
            <br>
            <AdminAllUser />
            <ContenusAdmin />
            <br>
            <AdminUpgradeProfil />
            <br>
        </div>

</template>

<script setup>


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
import AdminAllUser from '~/components/AdminAllUser.vue';
import AdminUpgradeProfil from '~/components/AdminUpgradeProfil.vue';
import 'bootstrap/dist/css/bootstrap.css'

</script>
