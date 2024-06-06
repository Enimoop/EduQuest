<template>
  <br>
  <form class="registration-form py-4 px-2 bg-light rounded shadow-sm mx-auto" style="max-width: 400px;" @submit.prevent="handleSignIn">
    <h2 class="mb-4 text-center">Se connecter</h2>
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
      <label for="email" class="form-label">Adresse Email</label>
      <input v-model="email" type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="exemple@mail.com" required>
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Mot de Passe</label>
      <input v-model="password" type="password" class="form-control" id="password" placeholder="••••••••" required>
    </div>
    <button type="submit" class="btn btn-primary w-100">Connexion</button>
    <p class="mt-3 mb-0 text-center">Pas encore de compte ? <router-link to ="/inscription" class="text-primary">Créer un compte</router-link></p>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { hashPassword } from '~/utils/func.mjs';
const { signIn } = useAuth();

const email = ref("");
const password = ref("");
const success = ref("");
const error = ref("");
const warning = ref("");

const user = ref({
  id: "",
  mail: "",
  mdp:"",
  type: "",
});

const handleSignIn = async () => {

    const emailExists = await checkUser(email.value);
    if (!emailExists) {
      password.value = "";
      error.value = "Email ou mot de passe incorrect"
      
      return;
    }
    user.value = emailExists;
    password.value = await hashPassword(password.value);

    if (user.value.mdp === password.value) {
      password.value = "";
      signIn('credentials', { email: email.value, password: password.value });
      
    } else {
      password.value = "";
      error.value = "Email ou mot de passe incorrect"
      
    }
 

  
 
}

const checkUser = async (email) => {
  try {
    const response = await axios.get(`http://localhost:3001/profils/${email}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return false;
    }
  }
}


</script>
