<template>
  <div class="container container-cours mt-5" style="width: 50%;">
    <form @submit.prevent="submitForm" class="form p-4 shadow rounded bg-light">
      <h2 class="form-title mb-4 text-center">Modifier la quête</h2>
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
        <input id="titre" class="form-control" v-model="contentTitre" rows="3" required></input>
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
import { getSubFromToken } from "../utils/session.mjs";

// Variables réactives pour stocker les données du formulaire
const descriptionContenu = ref('');
const selectedMatiere = ref('');
const selectedGuilde = ref('');
const contentTitre = ref('');
let idu = null;
let insertedId: number | null = null;


const headers = useRequestHeaders(["cookie"]) as HeadersInit;

const { data: token } = await useFetch("/api/token", { headers });

const { status } = useAuth();

if (status.value === "authenticated") {
  idu = getSubFromToken(token);
}

const route = useRoute();
const id = route.params.id;

const successMessage = ref('');
const errorMessage = ref('');

interface Exo {
  id: number;
  titre_contenu: string;
  description_contenu: string;
  date_contenu: string;
  id_matiere: number;
  libelle_matiere: string;
  id_guilde: number;
  nom_guilde: string;
}

interface Guildes {
  id: number;
  nom: string;
  description: string;
  id_prof: number;
}

interface Question {
  id_question?: number;
  intitule: string;
  reponse: string;
}


const guildes = ref<Guildes[]>([]);
const exo = ref<Exo>({
  id: 0,
  titre_contenu: '',
  description_contenu: '',
  date_contenu: '',
  id_matiere: 0,
  libelle_matiere: '',
  id_guilde: 0,
  nom_guilde: ''
});

// Fonction pour récupérer les guildes du professeur
const fetchGuildes = async () => {
  try {
    const response = await axios.get(`http://localhost:3001/guildes/prof/${idu}`);
    guildes.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des guildes:', error);
    alert('Une erreur s\'est produite lors de la récupération des guildes.');
  }
};

const fetchExerciceEtQuestions = async () => {
  try {
    await axios.get(`http://localhost:3001/contenus/exercice/${id}`)
      .then(response => {
        exo.value = response.data;
        contentTitre.value = response.data[0].titre_contenu;
        descriptionContenu.value = response.data[0].description_contenu;
        selectedMatiere.value = response.data[0].id_matiere;
        selectedGuilde.value = response.data[0].id_guilde;
        questions.value = response.data.map((question: any) => {
          return {
            id_question: question.id,
            intitule: question.intitule,
            reponse: question.reponse
          };
        });
      })
  } catch (error) {
    console.error('Erreur lors de la récupération du quiz et des questions :', error);
  }
};

onMounted(() => {
  fetchGuildes();
  fetchExerciceEtQuestions();
});

const questions = ref<Question[]>([{ intitule: '', reponse: '' }]);;

// Fonction pour ajouter une question
const addQuestion = () => {
  questions.value.push({ intitule: '', reponse: '' });
};


// Fonction pour soumettre le formulaire
const submitForm = () => {
  // Vérification si tous les champs sont remplis
  if (!descriptionContenu.value || !selectedMatiere.value) {
    alert('Veuillez remplir tous les champs');
    return;
  }

  // Construction de l'objet à envoyer
  const updatedQuiz = {
    id_contenu: id,
    titre_contenu: contentTitre.value,
    description_contenu: descriptionContenu.value,
    id_matiere: selectedMatiere.value,
    id_guilde: selectedGuilde.value
  };

  // Envoi des données du formulaire à l'API
  axios.put('http://localhost:3001/contenus/update/exo', updatedQuiz, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      // Affichage de la réponse
      insertedId = response.data.insertedId;

      // Envoi des données des questions à l'API
      Promise.all(questions.value.map((question, index) => {
        // Si la question est nouvelle, nous la créons
        if (!question.id_question) {
          
          const nouvelleQuestion = {
            intitule: question.intitule,
            reponse: question.reponse,
            id_contenu: id // ID de l'exercice auquel la question est associée
          };

          return axios.post('http://localhost:3001/contenus/exercices/question', nouvelleQuestion, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
        } else {
          // Si la question existe déjà, nous la mettons à jour
          const updatedQuestion = {
            id_question: question.id_question,
            intitule: question.intitule,
            reponse: question.reponse
          };

          return axios.put('http://localhost:3001/contenus/update/question', updatedQuestion, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
        }
      }))
        .then((responses) => {
          /* responses.forEach((response) => {
            // Affichage de la réponse pour chaque question
            alert(response.data.message);
          }); */

          successMessage.value = 'Le quiz a été mis à jour avec succès.';
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


const removeQuestion = (index: number) => {
  const questionToDelete = questions.value[index];

  // Vérification si la question existe déjà en base de données
  if (questionToDelete.id_question) {
    // Si oui, nous envoyons une requête DELETE pour la supprimer
    axios.delete(`http://localhost:3001/contenus/delete/question/${questionToDelete.id_question}`)
      .then(response => {
        // Affichage de la réponse
        // Suppression de la question de la liste locale
        questions.value.splice(index, 1);
      })
      .catch(error => {
        console.error('Erreur lors de la suppression de la question :', error);
        errorMessage.value = 'Une erreur s\'est produite lors de la suppression de la question. Veuillez réessayer.';
      });
  } else {
    // Si la question n'existe pas en base de données, nous la supprimons simplement de la liste locale
    questions.value.splice(index, 1);
  }
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