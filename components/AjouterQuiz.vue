<template>
  <div class="container container-cours mt-5" style="width: 50%;">
    <form @submit.prevent="submitForm" class="form p-4 shadow rounded bg-light">
      <h2 class="form-title mb-4 text-center">Nouveau Quiz</h2>
      <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
        {{ successMessage }}
        <button type="button" class="btn-close" @click="successMessage = ''"></button>
      </div>
      <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
        {{ errorMessage }}
        <button type="button" class="btn-close" @click="errorMessage = ''"></button>
      </div>

       <!-- Titre contenu -->
       <div class="mb-3">
        <label for="titre" class="form-label">Titre du contenu:</label>
        <input id="titre" class="form-control" v-model="contentTitre" rows="3"></input>
      </div>
      <!-- Description du contenu -->
      <div class="mb-3">
        <label for="descriptionContenu" class="form-label">Description du contenu</label>
        <textarea class="form-control" v-model="descriptionContenu" id="descriptionContenu" rows="3" required></textarea>
      </div>
      <!-- Matière -->
      <div class="mb-3">
        <label for="matiere" class="form-label">Matière</label>
        <select class="form-select" v-model="selectedMatiere" id="matiere" required>
          <option value="">Choisir une matière</option>
          <option value="1">Français</option>
          <option value="2">Maths</option>
          <option value="3">Histoire</option>
          <option value="4">Géographie</option>
          <option value="5">Anglais</option>
        </select>
      </div>
      <!-- Ajouter une question -->
      <div class="mb-4" v-for="(question, index) in questions" :key="index">
        <label class="form-label">Question {{ index + 1 }}</label>
        <div class="input-group">
          <input type="text" class="form-control" v-model="questions[index].intitule" placeholder="Intitulé de la question" required>
          <select class="form-select" v-model="questions[index].reponse" required>
            <option value="">Choisir une réponse</option>
            <option value="vrai">Vrai</option>
            <option value="faux">Faux</option>
          </select>
          <button type="button" class="btn btn-danger" @click="removeQuestion(index)">Supprimer</button>
        </div>
      </div>
      <button type="button" class="btn btn-primary mb-3 me-2" @click="addQuestion">Ajouter une question</button>
      <!-- Bouton pour soumettre le formulaire -->
      <button type="submit" class="btn btn-primary w-auto mx-auto d-block">Enregistrer</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';
import {getSubFromToken} from "../utils/session.mjs";

// Variables réactives pour stocker les données du formulaire
const contentTitre = ref('');
const descriptionContenu = ref('');
const selectedMatiere = ref('');
let idu = null;
let insertedId: number | null = null;
const successMessage = ref('');
const errorMessage = ref('');



const headers = useRequestHeaders(["cookie"]) as HeadersInit;

const { data: token } = await useFetch("/api/token", { headers });

const { status } = useAuth();

if (status.value === "authenticated") {
 idu = getSubFromToken(token); 
}


// Fonction pour récupérer les guildes du professeur


const route = useRoute();
const id = route.params.id;

const questions = ref([{ intitule: '', reponse: '' }]);

// Fonction pour ajouter une question
const addQuestion = () => {
questions.value.push({ intitule: '', reponse: '' });
};

// Fonction pour supprimer une question
const removeQuestion = (index: number) => {
questions.value.splice(index, 1);
};

// Fonction pour soumettre le formulaire
const submitForm = () => {
// Vérification si tous les champs sont remplis
if (!descriptionContenu.value || !selectedMatiere.value) {
  alert('Veuillez remplir tous les champs');
  return;
}

// Construction de l'objet à envoyer
const nouveauQuiz = {
  titre_contenu: contentTitre.value,
  description_contenu: descriptionContenu.value,
  date_contenu: new Date().toISOString().slice(0, 10),
  id_matiere: selectedMatiere.value,
  id_u: idu,
  id_guilde: id
};



axios.post('http://localhost:3001/contenus/exercices', nouveauQuiz, {
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then(response => {
    successMessage.value = response.data.message;
    insertedId = response.data.insertedId;

    Promise.all(questions.value.map((question, index) => {
      const nouvelleQuestion = {
        intitule: question.intitule,
        reponse: question.reponse,
        id_contenu: insertedId
      };


      return axios.post('http://localhost:3001/contenus/exercices/question', nouvelleQuestion, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }))
    .then((responses) => {
      contentTitre.value = '';
      descriptionContenu.value = '';
      selectedMatiere.value = '';
      questions.value = [{ intitule: '', reponse: '' }];
    })
    .catch(error => {
      console.error('Erreur lors de l\'envoi des questions :', error);
      errorMessage.value = 'Une erreur s\'est produite lors de l\'envoi des questions. Veuillez réessayer.';
    });
  })
  .catch(error => {
    console.error('Erreur lors de la soumission du formulaire :', error);
    errorMessage.value = 'Une erreur s\'est produite. Veuillez réessayer.';
  });
};




</script>
<style scoped>
.container {
  margin-top: 2rem;
}

.form {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
}

.form-label {
  margin-bottom: 0.5rem;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
}

.form-select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  background-color: #fff;
}

.input-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn-primary {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
}

.btn-danger {
  background-color: #dc3545;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
}

.btn-primary:focus,
.btn-danger:focus {
  outline: none;
}

.btn-primary:hover,
.btn-danger:hover {
  filter: brightness(0.9);
}
</style>
