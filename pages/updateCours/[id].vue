<template>
        <div>
            <UpdateCours />
        </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import UpdateCours from '../components/UpdateCours.vue';
import 'bootstrap/dist/css/bootstrap.css';
import { useRouter } from 'vue-router';

const headers = useRequestHeaders(["cookie"]);

const { data: token } = await useFetch("/api/token", { headers });

const router = useRouter();

const route = useRoute();
const id = route.params.id;

const idu = getSubFromToken(token);
const type = await returnUserType(idu);



const checkRights= async () => {
  if (type === 'Eleve') {
   router.push('/');
  }
  const accesAutorise = await verifierAccesContenuProf(idu,id);
      if (!accesAutorise) {
        router.push('/cours');
      }
};
checkRights();

</script>