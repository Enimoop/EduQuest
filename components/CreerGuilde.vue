<template>
  
    
      <h2 class="form-title mb-4 text-center">Créer une Guilde</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group mb-3">
          <label for="guildName" class="form-label">Nom de la Guilde</label>
          <input v-model="nom" type="text" class="form-control" id="guildName" placeholder="Entrez le nom de la guilde" required>
        </div>
        <div class="form-group mb-3">
          <label for="guildDescription" class="form-label">Description de la Guilde</label>
          <textarea v-model="description" class="form-control" id="guildDescription" rows="3" placeholder="Entrez la description de la guilde" required></textarea>
        </div>
        <button type="submit" class="btn btn-primary w-100">Soumettre</button>
      </form>
  
  
</template>


<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const nom = ref('');
const description = ref('');

const headers = useRequestHeaders(["cookie"]) as HeadersInit;
const { data: token } = await useFetch("/api/token", { headers });
const idu = getSubFromToken(token);

const emit = defineEmits(['guildeCreated']);

// Interface pour la guilde
interface Guilde {
  nom_guilde: string;
  description_guilde: string;
  id_prof: number;
}

// Fonction pour soumettre le formulaire
const submitForm = async () => {
  if (!nom.value || !description.value) {
    alert('Veuillez remplir tous les champs');
    return;
  }

  const nouvelleGuilde: Guilde = {
    nom_guilde: nom.value,
    description_guilde: description.value,
    id_prof: idu
  };

  console.log(nouvelleGuilde);

  try {
    const response = await axios.post('http://localhost:3001/guildes/addGuilde', nouvelleGuilde, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    nom.value = '';
    description.value = '';
    emit('guildeCreated');
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la guilde:', error);
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
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
}

.btn-primary {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.btn-primary:focus {
  outline: none;
}

.btn-primary:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.btn-primary:active {
  background-color: #004494;
  transform: translateY(0);
}
</style>

