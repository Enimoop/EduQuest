<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-header bg-primary text-white text-center">
            <h5 class="card-title mb-0">Notes des Contenus</h5>
          </div>
          <div class="card-body">
            <table class="table table-borderless custom-table">
              <thead>
                <tr>
                  <th scope="col" class="text-black">Contenu</th>
                  <th scope="col" class="text-black">Date</th>
                  <th scope="col" class="text-black">Note</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="note in note" :key="note.id_contenu">
                  <td>{{ note.description_contenu }}</td>
                  <td>{{ formatDate(note.date_note) }}</td>
                  <td>{{ note.note }}</td>
                </tr>
              </tbody>
            </table>
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
  
  interface Notes {
    id_contenu: number;
    date_note: string;
    note: number;
    description_contenu: string;
  }
  
  const note = ref<Notes[]>([]);
  
  onMounted(() => {
      axios.get(`http://localhost:3001/eleves/notes/${id}`)
      .then(response => {
        note.value = response.data;
      })
      .catch(error => {
        console.error('Error fetching notes:', error);
      });
  });

  const options: {
    day: string;
    month: string;
    year: string;
} = { day: 'numeric', month: 'numeric', year: 'numeric' };

function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
}
  
  </script>