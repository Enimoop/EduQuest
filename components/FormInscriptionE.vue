<template>
    <form class="py-4 px-2 bg-light rounded shadow-sm mx-auto" style="max-width: 1000px;" @submit.prevent="handleInsc">
      <h2 class="mb-4 text-center">S'enregistrer</h2>
      <div v-if="success" class="alert alert-success alert-dismissible fade show" role="alert">
        {{ success }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" @click="clearFields"></button>
      </div>
      <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
        {{ error }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" @click="error = ''"></button>
      </div>
      <div v-if="warning" class="alert alert-warning alert-dismissible fade show" role="alert">
      {{ warning }}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" @click="warning = ''"></button>
    </div>
      <div class="mb-3">
        <label for="nom" class="form-label">Nom</label>
        <input v-model="eleve.nom" type="text" class="form-control" id="nom" aria-describedby="emailHelp" placeholder="name@company.com" required>
      </div>
      <div class="mb-3">
        <label for="nom" class="form-label">Prénom</label>
        <input v-model="eleve.prenom" type="text" class="form-control" id="prenom" aria-describedby="emailHelp" placeholder="name@company.com" required>
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Adresse Email</label>
        <input v-model="eleve.mail" type="email" class="form-control" id="mail" aria-describedby="emailHelp" placeholder="name@company.com" required>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Mot de Passe</label>
        <input v-model="password" type="password" class="form-control" id="password" placeholder="••••••••" required>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Confirmez le mot de passe</label>
        <input v-model="confirmPassword" type="password" class="form-control" id="confirmPassword" placeholder="••••••••" required>
      </div>
      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="remember">
        <label class="form-check-label" for="remember">Se Souvenir de moi</label>
      </div>
      <button type="submit" class="btn btn-primary w-100">Connexion</button>
      <p class="mt-3 mb-0 text-center">Déjà un compte ? <router-link to="/login" class="text-primary">Se connecter</router-link></p>
    </form>
  </template>

<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';
import { hashPassword } from '../utils/func.mjs';



interface Eleve {
  nom: string;
  prenom: string;
  mail: string;
  password: string;
}

const password = ref<string>("");
const confirmPassword = ref<string>("");
const success = ref<string>("");
const error = ref<string>("");
const warning = ref<string>("");

const eleve = ref<Eleve>({
  nom: "",
  prenom: "",
  mail: "",
  password: "",
});


const handleInsc = async () => {
  try {
    const emailExists = await checkExist(eleve.value.mail);
    console.log(emailExists);
    if (emailExists) {
      warning.value = "Le mail existe déjà";
      return;
    }

    if (password.value !== confirmPassword.value) {
      error.value = "Les mots de passe ne correspondent pas";
      return;
    }

    eleve.value.password = await hashPassword(password.value);
    const newUser = {
      nom: eleve.value.nom,
      prenom: eleve.value.prenom,
      mail: eleve.value.mail,
      mdp: eleve.value.password,
    };

    await axios.post("http://localhost:3001/eleves/new", newUser);
    success.value = "Compte créé avec succès !";
    clearFields();
  } catch (err) {
    console.error(err);
    error.value = "Une erreur s'est produite lors de la création du compte";
  }
};

const clearFields = () => {
  eleve.value.nom = "";
  eleve.value.prenom = "";
  eleve.value.mail = "";
  password.value = "";
  confirmPassword.value = "";
};

const checkExist = async (email: string) => {
  try {
    const response = await axios.get(`http://localhost:3001/profils/${email}`);
    // Adaptez cette logique selon la structure de la réponse de votre API
    return response.data && Object.keys(response.data).length > 0;
  } catch (error) {
    console.error(error);
    throw new Error("Erreur lors de la vérification de l'existence de l'email");
  }
};
</script>