<template>
  <div class="container mt-5">
    <h1 class="mb-2 text-center quiz-title">{{ titre_contenu }}</h1>
    <p class="text-center quiz-description">{{ description_contenu }}</p>
    <div v-if="showAlert" class="alert alert-warning text-center alert-box mx-auto" role="alert">
      Vous avez déjà passé ce quiz aujourd'hui
    </div>
    <div v-for="question in questions" :key="question.id" class="card mb-4 shadow-sm question-card mx-auto">
      <div class="card-body">
        <p class="card-title"><strong>Question :</strong> {{ question.intitule }}</p>
        <div class="form-check">
          <input class="form-check-input" type="radio" :value="'vrai'" :id="'vrai' + question.id" :name="`${question.id}`">
          <label class="form-check-label" :for="'vrai' + question.id">
            Vrai
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" :value="'faux'" :id="'faux' + question.id" :name="`${question.id}`">
          <label class="form-check-label" :for="'faux' + question.id">
            Faux
          </label>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-center">
      <button @click="submitResponses" class="btn btn-primary btn-block sub-btn">Soumettre les réponses</button>
    </div>
    <div v-if="affscore !== null" class="text-center mt-3">
      <div class="score-display">
        <h2>Votre score est de</h2>
        <h2 class="score">{{ affscore.toFixed(2) }}%</h2>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { format } from 'date-fns';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { getSubFromToken, returnUserType } from "../utils/session.mjs";
import { calculerNiveau } from "../utils/func.mjs";

const headers = useRequestHeaders(["cookie"]) as HeadersInit;

const { data: token } = await useFetch("/api/token", { headers });

const { status } = useAuth();
let { id } = defineProps(['id']);

let type: string | null = null;

if (status.value === "authenticated") {
  id = getSubFromToken(token);
  type = await returnUserType(id);
}

interface Question {
  id: number;
  intitule: string;
  id_contenu: number;
  id_matiere: number;
  reponse: string;
}

const questions = ref<Question[]>([]);
const description_contenu = ref<string>('');
const titre_contenu = ref<string>('');

let responses: Record<string, string> = {};
const score = ref<number | null>(null);
const affscore = ref<number | null>(null);
const showAlert = ref<boolean>(false);

onMounted(async () => {
  const route = useRoute();
  const id = route.params.id;
  axios.get(`http://localhost:3001/contenus/exercice/${id}`)
    .then(response => {
      questions.value = response.data;
      titre_contenu.value = response.data[0].titre_contenu;
      description_contenu.value = response.data[0].description_contenu;
    })
    .catch(error => {
      console.error('Error fetching quiz:', error);
    });
});

const submitResponses = () => {
  showAlert.value = false; // Reset the alert state
  // Collecter les réponses lorsque l'utilisateur clique sur le bouton
  responses = {};
  questions.value.forEach(question => {
    const response = document.querySelector(`input[name="${question.id}"]:checked`);
    if (response) {
      responses[question.id.toString()] = (response as HTMLInputElement).value;
    }
  });

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
              let niveau = calculerNiveau(questions.value[0].id_matiere, id);
            })
            .catch(error => {
              console.error('Erreur lors de l\'enregistrement du score:', error);
            });
          affscore.value = score.value;
        } else {
          let date = format(new Date(), 'yyyy-MM-dd');
          let date_note = format(new Date(response.data[0].date_note), 'yyyy-MM-dd');
          if (date_note !== date) {
            axios.put('http://localhost:3001/contenus/exercices/score', nouveauScore, {
              headers: {
                'Content-Type': 'application/json'
              }
            })
              .then(response => {
                let niveau = calculerNiveau(questions.value[0].id_matiere, id);
              })
              .catch(error => {
                console.error('Erreur lors de la mise à jour du score:', error);
              });
            affscore.value = score.value;
          } else {
            showAlert.value = true;
          }
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération du score:', error);
      });
  } else {
    affscore.value = score.value;
  }
};

const calculateScore = (userResponses: Record<string, string>) => {
  let score = 0;
  questions.value.forEach(question => {
    const correctResponse = question.reponse;
    const userResponse = userResponses[question.id];
    if (userResponse === correctResponse) {
      score++;
    }
  });
  const totalQuestions = questions.value.length;
  return (score / totalQuestions) * 100; // Score en pourcentage
};
</script>

<style scoped>
.container {
  max-width: 700px; /* Increased max-width */
  margin: 0 auto;
  padding: 20px;
}

.quiz-title {
  font-size: 2rem;
  font-weight: bold;
  color: #343a40;
  margin-bottom: 10px; /* Reduced margin-bottom for closer spacing */
}

.quiz-description {
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 10px; /* Reduced margin-bottom for closer spacing */
}

.alert-box {
  max-width: 500px; /* Match the size of question cards */
  margin: 0 auto 20px auto; /* Center the alert and add spacing */
}

.question-card {
  max-width: 500px; /* Slightly increased width for the question cards */
  margin: 0 auto; /* Center the cards */
  background-color: #f8f9fa;
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

.question-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.card-title {
  font-size: 1rem;
  font-weight: bold;
  color: #343a40;
}

.form-check-label {
  font-size: 1rem;
  color: #495057;
}

.sub-btn {
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  padding: 8px 16px; /* Reduced padding for smaller button */
  font-size: 1rem; /* Reduced font size for smaller button */
  font-weight: bold;
  color: white;
  transition: background-color 0.3s, transform 0.3s;
}

.sub-btn:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.sub-btn:active {
  background-color: #004494;
  transform: translateY(0);
}

.score-display {
  background-color: #e9ecef;
  padding: 20px;
  border-radius: 10px;
  display: inline-block;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  transition: transform 0.3s ease-in-out;
}

.score-display:hover {
  transform: translateY(-5px);
}

.score {
  font-size: 2rem; /* Reduced font size for the score */
  font-weight: bold;
  color: #28a745;
}
</style>
