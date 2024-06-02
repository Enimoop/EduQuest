<template>
        <div>
            <updateExo />

        </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import UpdateExo from '../components/UpdateExo.vue';
import 'bootstrap/dist/css/bootstrap.css';
import { useRouter } from 'vue-router';


const headers = useRequestHeaders(["cookie"]);

const { data: token } = await useFetch("/api/token", { headers });

const idu = getSubFromToken(token);
const type = await returnUserType(idu);


const router = useRouter();
const route = useRoute();

const id = route.params.id;

const checkType = async () => {
  if (type === 'Eleve') {
   router.push('/');
  }
  const accesAutorise = await verifierAccesContenuProf(idu,id);
      if (!accesAutorise) {
        router.push('/exercice');
      }
};
checkType();


</script>