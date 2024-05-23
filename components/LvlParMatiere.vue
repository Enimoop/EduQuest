<template>
  <div class="container mt-5">
    <div class="card">
      <div class="card-header bg-primary text-white text-center">
        <h5 class="card-title mb-0">Niveaux par Matière</h5>
      </div>
      <div class="card-body">
        <div class="row justify-content-center text-center">
          <div v-for="lvl in lvls" :key="lvl.id_matiere" class="col-lg-2 mb-4">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">{{ lvl.libelle_matiere }}</h5>
                <div class="progress" style="height: 20px;">
                  <div class="progress-bar bg-success" role="progressbar" :style="{ width: (lvl.lvl * 20) + '%' }" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{{ lvl.lvl }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { onMounted } from 'vue';
import { getSubFromToken, returnUserType } from "../utils/session.mjs";
import axios from 'axios';

const headers = useRequestHeaders(["cookie"]) as HeadersInit;

const { data: token } = await useFetch("/api/token", { headers });



const id = getSubFromToken(token);
const type = await returnUserType(id);


const { status } = useAuth();

interface Lvls {
  id_matiere: number;
  libelle_matiere: string;
  lvl: number;
}

interface Note {
  id_contenu: number;
  date_note: string;
  note: number;
}

const lvls = ref<Lvls[]>([]);
const notes = ref<Note[]>([]);

onMounted(() => {
  axios.get(`http://localhost:3001/eleves/lvl/${id}`)
    .then(response => {
      lvls.value = response.data;
      console.log(lvls.value);

    })
    .catch(error => {
      console.error('Error fetching levels:', error);
    });
    axios.get(`http://localhost:3001/eleves/notes/${id}`)
    .then(response => {
      notes.value = response.data;
      console.log(notes.value);
    })
    .catch(error => {
      console.error('Error fetching notes:', error);
    });
});

</script>