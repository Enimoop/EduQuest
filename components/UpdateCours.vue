<template>
    <form @submit.prevent="uploadPdf" class="container mt-4">
        <!-- Sélection de la guilde -->
        <div class="mb-3">
            <label for="guilde" class="form-label">Guilde:</label>
            <select id="guilde" class="form-select" v-model="cours.id_guilde" required>
                <option value="">Choisir une guilde</option>
                <option v-for="guilde in guildes" :key="guilde.id" :value="guilde.id">{{ guilde.nom }}</option>
            </select>
        </div>
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
            <textarea id="description" class="form-control" v-model="cours.description_contenu" ></textarea>
        </div>

        <div class="mb-3">
            <label for="subject" class="form-label">Matière:</label>
            <select id="subject" class="form-select" v-model="cours.id_matiere" >
                <option value="1">Français</option>
                <option value="2">Maths</option>
                <option value="3">Histoire</option>
                <option value="4">Géographie</option>
                <option value="5">Anglais</option>
            </select>
        </div>

         <!-- Alertes -->
         <div v-if="success" class="alert alert-success alert-dismissible fade show" role="alert">
            {{ success }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" @click="redirectToPreviousPage"></button>
        </div>
        <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
            {{ error }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>

        <button type="submit" class="btn btn-primary">Télécharger le PDF</button>
    </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { getSubFromToken } from "../utils/session.mjs";

const headers = useRequestHeaders(["cookie"]) as HeadersInit;

const { data: token } = await useFetch("/api/token", { headers });

const idu = getSubFromToken(token);



const route = useRoute();
const id = route.params.id;


const pdf = ref<string | null>(null);
const success = ref<string | null>(null);
const error = ref<string | null>(null);
const files = ref<HTMLInputElement | null>(null);



interface Cours {
    id: number;
    description_contenu: string;
    date_contenu: string;
    id_matiere: number;
    libelle_matiere: string;
    nom_fichier: string;
    id_guilde: number;
    nom_guilde: string;
}

interface Guilde {
    id: number;
    nom: string;
}


const cours = ref<Cours>({
    id: 0,
    description_contenu: '',
    date_contenu: '',
    id_matiere: 0,
    libelle_matiere: '',
    nom_fichier: '',
    id_guilde: 0,
    nom_guilde: ''
});
const guildes = ref<Guilde[]>([]);

const { status } = useAuth();



const fetchGuildes = async () => {
  try {
    const response = await axios.get(`http://localhost:3001/guildes/prof/${idu}`);
    guildes.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des guildes:', error);
    
  }
};

const fetchCours = async () => {
  try {
    axios.get(`http://localhost:3001/contenus/cour/${id}`)
    .then(response => {
      cours.value = response.data;
    })
    
  } catch (error) {
    console.error('Error fetching lesson:', error);
  }
};

onMounted(() => {
    fetchCours();
    fetchGuildes();
});


function onFileChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    pdf.value = URL.createObjectURL(file);
    console.log(pdf.value);
  }
  else {
    pdf.value = cours.value.nom_fichier;
  }
}
  async function uploadPdf() {
  
    error.value = null;
    success.value = null;
    let message = '';
    const formData = new FormData();
    let pdfName = '';

    if (files.value && files.value.files.length > 0) {
      console.log("ici");
    Array.from(files.value.files).map((file, index) => formData.append(index, file));
    // Logs
    console.log("Description du contenu:", cours.value.description_contenu);
    console.log("Matière:", cours.value.id_matiere);
    console.log("Fichier PDF uploadé:", files.value.files[0].name);

    const {pdfName: uploadedPdfName, message:uploadMessage } = await $fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    pdfName = uploadedPdfName;
    message = uploadMessage;
  } else {
    console.log("la");
    console.log(cours.value.nom_fichier);
    pdfName = cours.value.nom_fichier;
    message = "Mise à jour réussi \nLe fichier n'a pas été modifié";
  }
  
    const updatedCours = {
        id_contenu: cours.value.id,
        description_contenu: cours.value.description_contenu,
        id_matiere: cours.value.id_matiere,
        id_guilde: cours.value.id_guilde,
        nom_fichier: pdfName 
    };
    console.log(updatedCours);
    const response = await axios.put('http://localhost:3001/contenus/update/cours', updatedCours, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
   

    success.value = message;
    console.log("success");
    console.log(success.value);

 
}

// Fonction pour rediriger vers la page précédente
function redirectToPreviousPage() {
    window.history.back();
  }

</script>