<template>
  <div>
    <CoursParID :cours="cours" />
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';
import CoursParID from '../components/CoursParID.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const cours = ref([]);

const headers = useRequestHeaders(["cookie"]);

const { data: token } = await useFetch("/api/token", { headers });

const idu = getSubFromToken(token);
const type = await returnUserType(idu);

const route = useRoute();
const id = route.params.id;

if (type =="Eleve") {
      const accesAutorise = await verifierAccesContenuEleve(idu,id);
      if (!accesAutorise) {
        router.push('/cours');
      }
  } else if (type == "Prof"){
      const accesAutorise = await verifierAccesContenuProf(idu,id);
      if (!accesAutorise) {
        router.push('/cours');
      }
  }



</script>