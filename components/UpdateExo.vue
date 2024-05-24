<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center">Nouveau Quiz/Exercice</h1>
    <form @submit.prevent="submitForm" class="mx-auto" style="max-width: 400px;">
      <!-- Sélection de la guilde -->
      <div class="mb-3">
        <label for="guilde" class="form-label">Guilde</label>
        <select class="form-select" v-model="selectedGuilde" id="guilde" required>
          <option value="">Choisir une guilde</option>
          <option v-for="guilde in guildes" :key="guilde.id" :value="guilde.id">{{ guilde.nom }}</option>
        </select>
      </div>
      <!-- Description du contenu -->
      <div class="mb-3">
        <label for="descriptionContenu" class="form-label">Description du contenu</label>
        <textarea class="form-control" v-model="descriptionContenu" id="descriptionContenu" rows="3"
          required></textarea>
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
          <input type="text" class="form-control" v-model="questions[index].intitule"
            placeholder="Intitulé de la question" required>
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
      <button type="submit" class="btn btn-primary mb-3">Enregistrer</button>
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

interface Exo {
  id: number;
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

const guildes = ref<Guildes[]>([]);
const exo = ref<Exo>({
  id: 0,
  description_contenu: '',
  date_contenu: '',
  id_matiere: 0,
  libelle_matiere: '',
  nom_fichier: '',
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

const questions = ref([{ intitule: '', reponse: '' }]);

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
      alert(response.data.message);
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


        })
        .catch(error => {
          console.error('Erreur lors de l\'envoi des questions :', error);
          alert('Une erreur s\'est produite lors de l\'envoi des questions. Veuillez réessayer.');
        });
    })
    .catch(error => {
      console.error('Erreur lors de la soumission du formulaire :', error);
      alert('Une erreur s\'est produite. Veuillez réessayer.');
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
        alert(response.data.message);
        // Suppression de la question de la liste locale
        questions.value.splice(index, 1);
      })
      .catch(error => {
        console.error('Erreur lors de la suppression de la question :', error);
        alert('Une erreur s\'est produite lors de la suppression de la question. Veuillez réessayer.');
      });
  } else {
    // Si la question n'existe pas en base de données, nous la supprimons simplement de la liste locale
    questions.value.splice(index, 1);
  }
};

</script>