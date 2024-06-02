<template>
  <div>
    <ExerciceParID :exercice="exercice" />
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';
import ExerciceParID from '../components/ExerciceParID.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const exercice = ref([]);

const headers = useRequestHeaders(["cookie"]);

const { data: token } = await useFetch("/api/token", { headers });

const idu = getSubFromToken(token);
const type = await returnUserType(idu);

const route = useRoute();
const id = route.params.id;


if (type =="Eleve") {
      const accesAutorise = await verifierAccesContenuEleve(idu,id);
      if (!accesAutorise) {
        router.push('/exercice');
      }
  } else if (type == "Prof"){
      const accesAutorise = await verifierAccesContenuProf(idu,id);
      if (!accesAutorise) {
        router.push('/exercice');
      }
  }

</script>