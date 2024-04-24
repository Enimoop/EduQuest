<template>
    <div class="container mt-5">
      <h1 class="mb-4 text-center quiz-title">{{ description_contenu }}</h1>
      <div v-for="question in questions" :key="question.id" class="card mb-4">
        <div class="card-body">
          <p class="card-title">Intitulé: {{ question.intitule }}</p>
          <div class="form-check">
            <input class="form-check-input" type="radio" value="vrai" id="vrai" :name="`${question.id}`">
            <label class="form-check-label" for="vrai">
              Vrai
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" value="faux" id="faux" :name="`${question.id}`">
            <label class="form-check-label" for="faux">
              Faux
            </label>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-center">
      <button @click="submitResponses" class="btn btn-primary btn-lg btn-block sub-btn">Soumettre les réponses</button>
    </div>
      <div v-if="score !== null" class="text-center mt-3">
      <h2>Votre score est de {{ score.toFixed(2) }}%</h2>
    </div>
    </div>
  </template>

<script setup>
import { format } from 'date-fns';
import { ref, onMounted } from 'vue';
import axios from 'axios';


const questions = ref([]);
const description_contenu = ref('');

let responses = null;
const score = ref(null);


onMounted(() => {
  const route = useRoute()
  const id = route.params.id;
  axios.get(`http://localhost:3001/contenus/exercices/${id}`)
    .then(response => {
      questions.value = response.data;
      description_contenu.value = response.data[0].description_contenu;
      
    })
    .catch(error => {
      console.error('Error fetching quiz:', error);
    });
});


const submitResponses = () => {
  // Collecter les réponses lorsque l'utilisateur clique sur le bouton
  responses = {};
  questions.value.forEach(question => {
    const response = document.querySelector(`input[name="${question.id}"]:checked`);
    if (response) {
      responses[question.id] = response.value;
    }
  });
  
  // Envoyer les réponses au backend pour vérification
  console.log('Réponses soumises:', responses);
  // Vous pouvez envoyer les réponses au backend via une requête axios, par exemple

  // Calculer le score
  score.value = calculateScore(responses);
  console.log('Score:', score);
};


const calculateScore = (userResponses) => {
  let score = 0;
  questions.value.forEach(question => {
    const correctResponse = question.reponse; // Utilisation de la propriété "reponse"
    const userResponse = userResponses[question.id];
    if (userResponse === correctResponse) {
      score++;
    }
  });
  const totalQuestions = questions.value.length;
  return (score / totalQuestions) * 100; // Score en pourcentage
};




</script>