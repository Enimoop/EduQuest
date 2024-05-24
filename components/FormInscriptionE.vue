<template>
    <form class="registration-form py-4 px-2 bg-light rounded shadow-sm mx-auto" @submit.prevent="handleInsc">
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
        <input v-model="eleve.nom" type="text" class="form-control" id="nom" aria-describedby="emailHelp" placeholder="" required>
      </div>
      <div class="mb-3">
        <label for="nom" class="form-label">Prénom</label>
        <input v-model="eleve.prenom" type="text" class="form-control" id="prenom" aria-describedby="emailHelp" placeholder="" required>
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Adresse Email</label>
        <input v-model="eleve.mail" type="email" class="form-control" id="mail" aria-describedby="emailHelp" placeholder="" required>
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
      <button type="submit" class="btn btn-primary w-100">Créer</button>
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
  
  const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
  const handleInsc = async () => {
  try {
    const emailExists = await checkExist(eleve.value.mail);
    if (emailExists) {
      warning.value = "Le mail existe déjà";
      return;
    }
  
    if (!passwordPolicy.test(password.value)) {
      error.value = "Le mot de passe n'est pas assez fort";
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
  
  const checkExist = async (email: string): Promise<boolean> => {
  try {
    const response = await axios.get(`http://localhost:3001/profils/${email}`);
    console.log(response.data);
    return true; // Si le profil est trouvé, l'email existe
  } catch (error) {
    const axiosError = error as { response?: { status?: number } }; // Spécifiez le type de l'erreur ici
    if (axiosError.response && axiosError.response.status === 404) {
      return false; // Si une erreur 404 est renvoyée, l'email n'existe pas
    }
    console.error(error);
    throw new Error("Erreur lors de la vérification de l'existence de l'email");
  }
  };
  </script>
  