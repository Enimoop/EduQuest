<template>
  <div class="container container-cours mt-5" style="width: 50%;" >
    <form @submit.prevent="uploadPdf" class="form p-4 shadow rounded bg-light">
      <h2 class="form-title mb-4 text-center">Ajouter un Cours</h2>
      <div class="mb-3">
        <div v-if="success" class="alert alert-success alert-dismissible fade show" role="alert">
          Téléchargement réussi
          <button type="button" class="btn-close" @click="success = null"></button>
        </div>
        <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
          Erreur lors de la mise en ligne
          <button type="button" class="btn-close" @click="error = null"></button>
        </div>
      </div>
  
      <!-- Choix du fichier PDF -->
      <div class="mb-3">
        <label for="dropzone-file" class="form-label">Choisir un fichier PDF:</label>
        <div class="dropzone p-3 border rounded text-center">
          <div v-if="!pdf" class="dropzone-placeholder">
            <p>Cliquer pour télécharger</p>
          </div>
          <img v-else :src="pdf" alt="PDF téléchargé" class="img-fluid">
          <input ref="files" id="dropzone-file" type="file" class="form-control mt-2" @change="onFileChange" />
        </div>
      </div>

      <!-- Titre contenu -->
      <div class="mb-3">
        <label for="titre" class="form-label">Titre du contenu:</label>
        <input id="titre" class="form-control" v-model="contentTitre" rows="3"></input>
      </div>
  
      <!-- Description du contenu -->
      <div class="mb-3">
        <label for="description" class="form-label">Description du contenu:</label>
        <textarea id="description" class="form-control" v-model="contentDescription" rows="3"></textarea>
      </div>
  
      <!-- Sélection de la matière -->
      <div class="mb-3">
        <label for="subject" class="form-label">Matière:</label>
        <select id="subject" class="form-select" v-model="selectedSubject">
          <option value="1">Français</option>
          <option value="2">Maths</option>
          <option value="3">Histoire</option>
          <option value="4">Géographie</option>
          <option value="5">Anglais</option>
        </select>
      </div>
  
      <!-- Bouton de soumission -->
      <button type="submit" class="btn btn-primary w-auto mx-auto d-block">Télécharger le PDF</button>
    </form>
  </div>
</template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import axios from 'axios';
  

  import { getSubFromToken } from "../utils/session.mjs";
import { fi } from 'date-fns/locale';

const headers = useRequestHeaders(["cookie"]) as HeadersInit;

const { data: token } = await useFetch("/api/token", { headers });

let idu: number | null;

const { status } = useAuth();

if (status.value === "authenticated") {
    idu = getSubFromToken(token);
}

const route = useRoute()
const id = route.params.id;

  const files = ref();
  const pdf = ref();
  const success = ref();
  const error = ref();
  const contentTitre = ref('');
  const contentDescription = ref('');
  const selectedSubject = ref('Français');
  const selectedGuilde = ref('');

  interface Guildes {
    id: number;
    nom: string;
    description: string;
    id_prof: number;
}

const guildes = ref<Guildes[]>([]);


  
  function onFileChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    pdf.value = URL.createObjectURL(file);
  }
  }
  
  async function uploadPdf() {
  try {
    error.value = null;
    success.value = null;
    const formData = new FormData();
    Array.from(files.value.files).map((file, index) => formData.append(index, file));
  
    // Logs
    console.log("Description du contenu:", contentDescription.value);
    console.log("Matière:", selectedSubject.value);
    console.log("Fichier PDF uploadé:", files.value.files[0].name);

    const {pdfName, message } = await $fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    
    const nouveauCours = {
      description_contenu: contentDescription.value,
      titre_contenu: contentTitre.value,
      date_contenu: new Date().toISOString().slice(0, 10), 
      id_matiere: selectedSubject.value,
      id_u: idu,
      id_guilde: id,
      nom_fichier: pdfName 
    };

    const saveResponse = await axios.post('http://localhost:3001/contenus/cours', nouveauCours, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
   

    success.value = message;
    
    clearFields();

  } catch (e: any) {
    error.value = e.statusMessage;
  }
}

function clearFields() {
  contentTitre.value = '';
  contentDescription.value = '';
  selectedSubject.value = 'Français';
  files.value.value = '';
  pdf.value = null;
}
  </script>
 
<style scoped>
.container-cours {
    margin-top: 2rem;
}
.form {
    background: #ffffff;
}
.form-title {
    font-size: 1.5rem;
    color: #333;
}
.dropzone {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 150px;
    border: 2px dashed #ccc;
    border-radius: 5px;
    cursor: pointer;
    transition: border-color 0.3s;
}
.dropzone:hover {
    border-color: #007bff;
}
.dropzone-placeholder {
    text-align: center;
    color: #777;
}
</style>