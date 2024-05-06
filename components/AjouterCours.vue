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

let id = null;

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
  
  function onFileChange(e) {
    const file = e.target.files[0];
    pdf.value = URL.createObjectURL(file);
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

    // Si le téléchargement est réussi, enregistrez les autres données dans la base de données
    const nouveauCours = {
      description_contenu: contentDescription.value,
      date_contenu: "2024-04-30", // Vous pouvez mettre la date que vous souhaitez ici
      id_matiere: selectedSubject.value,
      id_u: id, // Mettez l'ID de l'utilisateur approprié ici
      nom_fichier: pdfName // Utilisez le nom de fichier renvoyé par l'API si nécessaire
    };

    // Envoi des autres données à votre endpoint de sauvegarde
    const saveResponse = await axios.post('http://localhost:3001/contenus/cours', nouveauCours, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(saveResponse.data); // Affichez la réponse de l'enregistrement en base de données si nécessaire

    success.value = message;

  } catch (e) {
    error.value = e.statusMessage;
  }
}
  </script>
  