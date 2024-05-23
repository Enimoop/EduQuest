<template>
  <div class="container mt-5">
    <div class="card">
      <div class="card-header bg-primary text-white text-center">
        <h5 class="card-title mb-0">Profil Utilisateur</h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleUpdate">
          <div class="mb-3">
            <label for="userId" class="form-label">Identifiant : <span id="userId">{{ user.id }}</span></label>
            <small class="text-muted d-block">Cet identifiant est unique pour chaque utilisateur.</small>
          </div>
          <div class="mb-3">
            <label for="userEmail" class="form-label">Email :</label>
            <input type="email" id="userEmail" v-model="user.mail" class="form-control" name = mail required>
            <small class="text-muted">L'adresse email associée à ce compte utilisateur.</small>
          </div>
          <div class="mb-3">
            <label for="userType" class="form-label">Type : <span id="userType">{{ user.type }}</span></label>
            <small class="text-muted d-block">Le type d'utilisateur (ex: administrateur, utilisateur standard, etc.).</small>
          </div>
          <div class="mb-3">
            <label for="newPassword" class="form-label">Changer le mot de passe :</label>
            <input type="password" id="newPassword" v-model="password" class="form-control" placeholder="Nouveau mot de passe" name = mdp>
          </div>
          <div class="mb-3">
            <label for="confirmPassword" class="form-label">Confirmer le mot de passe :</label>
            <input type="password" id="confirmPassword" v-model="confirmPassword" class="form-control" placeholder="Confirmer le mot de passe" name = mdpConfirm>
            <small class="text-muted">Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.</small>
          </div>
          <div class="text-center">
            <button type = "submit" class="btn btn-primary">Mettre à jour</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getSubFromToken, returnUserType } from "../utils/session.mjs";
import {updateProfil} from "../utils/func.mjs";
import axios from 'axios';

const headers = useRequestHeaders(["cookie"]) as HeadersInit;

const { data: token } = await useFetch("/api/token", { headers });

const id = getSubFromToken(token);
const type = await returnUserType(id);

const { status } = useAuth();

interface User {
  id: number;
  mail: string;
  type: string;
}

const user = ref<User>({
  id: 0,
  mail: "",
  type: "",
});

const password = ref<string>("");
const confirmPassword = ref<string>("");


const handleUpdate = () => {
  if (password.value !== confirmPassword.value) {
    console.error("Les mots de passe ne correspondent pas.");
    return;
  }

  const updatedUser = {
    id: id,
    mail: user.value.mail,
    mdp: password.value,
  };
  updateProfil(updatedUser);
  password.value = "";
  confirmPassword.value = "";
};


onMounted(() => {
  axios.get(`http://localhost:3001/profils/id/${id}`)
    .then(response => {
      user.value = response.data;
      console.log(user.value);
    })
    .catch(error => {
      console.error('Error fetching profils:', error);
    });
});

</script>
