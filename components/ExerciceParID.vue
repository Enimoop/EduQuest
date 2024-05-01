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
      <div v-if="affscore !== null" class="text-center mt-3">
      <h2>Votre score est de {{ affscore.toFixed(2) }}%</h2>
    </div>
    </div>
  </template>

<script setup lang="ts">
import { format } from 'date-fns';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import {getSubFromToken,returnUserType} from "../utils/session.mjs";

const headers = useRequestHeaders(["cookie"]) as HeadersInit;

const { data: token } = await useFetch("/api/token", { headers });

const { status } = useAuth();

let id = null;
let type = null;

if (status.value === "authenticated") {
    id = getSubFromToken(token);
    type = await returnUserType(id);
}


const questions = ref([]);
const description_contenu = ref('');

let responses = {};
const score = ref(null);
const affscore = ref(null);


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
  

  if (type === "Eleve") {
      const nouveauScore = {
        id_u: id,
        id_contenu: questions.value[0].id_contenu,
        note: score.value
      };

      axios.get(`http://localhost:3001/contenus/exercices/score/${id}/${questions.value[0].id_contenu}`)
        .then(response => {
          if (response.data.length === 0) {
            axios.post('http://localhost:3001/contenus/exercices/score', nouveauScore, {
              headers: {
                'Content-Type': 'application/json'
              }
            })
              .then(response => {
                console.log('Score enregistré:', response.data);
              })
              .catch(error => {
                console.error('Erreur lors de l\'enregistrement du score:', error);
              });
              affscore.value = score.value;
          } else {
              let date = format(new Date(), 'yyyy-MM-dd');
              let date_note = format (new Date(response.data[0].date_note), 'yyyy-MM-dd');
              if(date_note !== date) {
                console.log ('date_note', response.data[0].date_note);
                console.log ('date', date);
                axios.put('http://localhost:3001/contenus/exercices/score', nouveauScore, {
                  headers: {
                    'Content-Type': 'application/json'
                  }
                })
                  .then(response => {
                    console.log('Score mis à jour:', response.data);
                  })
                  .catch(error => {
                    console.error('Erreur lors de la mise à jour du score:', error);
                  });
            affscore.value = score.value;
            } else {
              alert('Vous avez déjà passé ce quiz aujourd\'hui');
            }
          }
        })
        .catch(error => {
          console.error('Erreur lors de la récupération du score:', error);
        });
      
  }
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