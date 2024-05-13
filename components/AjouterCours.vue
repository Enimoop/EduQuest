<template>
    <form @submit.prevent="uploadPdf" class="container mt-4">
      <div class="mb-3">
        <label for="dropzone-file" class="form-label">Choisir un fichier PDF:</label>
        <div class="dropzone">
          <div v-if="!pdf" class="dropzone-placeholder">
            <p>Click pour télécharger</p>
          </div>
          <img v-else :src="pdf" alt="PDF téléchargé" class="img-fluid">
          <input ref="files" id="dropzone-file" type="file" class="form-control" @change="onFileChange" />
        </div>
      </div>
  
      <div class="mb-3">
        <label for="description" class="form-label">Description du contenu:</label>
        <textarea id="description" class="form-control" v-model="contentDescription"></textarea>
      </div>
  
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
  
      <div class="mb-3">
        <span v-if="success" class="text-success">{{ success }}</span>
        <span v-if="error" class="text-danger">{{ error }}</span>
      </div>
  
      <button type="submit" class="btn btn-primary">Télécharger le PDF</button>
    </form>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import axios from 'axios';

  import { getSubFromToken } from "../utils/session.mjs";
import { fi } from 'date-fns/locale';

const headers = useRequestHeaders(["cookie"]) as HeadersInit;

const { data: token } = await useFetch("/api/token", { headers });

let id: number | null;

const { status } = useAuth();

if (status.value === "authenticated") {
    id = getSubFromToken(token);
}
  
  const files = ref();
  const pdf = ref();
  const success = ref();
  const error = ref();
  const contentDescription = ref('');
  const selectedSubject = ref('Français');
  
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
      date_contenu: new Date().toISOString().slice(0, 10), 
      id_matiere: selectedSubject.value,
      id_u: id,
      nom_fichier: pdfName 
    };

    const saveResponse = await axios.post('http://localhost:3001/contenus/cours', nouveauCours, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
   

    success.value = message;

  } catch (e: any) {
    error.value = e.statusMessage;
  }
}
  </script>
  