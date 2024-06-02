<template>
  <div class="container mt-5">
    <div class="card">
      <div class="card-header bg-primary text-white text-center">
        <h5 class="card-title mb-0">Profil Utilisateur</h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleUpdate">
          <div v-if="success" class="alert alert-success alert-dismissible fade show" role="alert">
            {{ success }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"
              @click="success = ''"></button>
          </div>
          <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
            {{ error }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"
              @click="error = ''"></button>
          </div>
          <div v-if="warning" class="alert alert-warning alert-dismissible fade show" role="alert">
            {{ warning }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"
              @click="warning = ''"></button>
          </div>
          <div class="mb-3">
            <label for="userId" class="form-label">Identifiant : <span id="userId">{{ user.id }}</span></label>
            <small class="text-muted d-block">Cet identifiant est unique pour chaque utilisateur.</small>
          </div>
          <div class="mb-3">
            <label for="userEmail" class="form-label">Email :</label>
            <input type="email" id="userEmail" v-model="user.mail" class="form-control" name=mail required>
            <small class="text-muted">L'adresse email associée à ce compte utilisateur.</small>
          </div>
          <div class="mb-3">
            <label for="userType" class="form-label">Type : <span id="userType">{{ user.type }}</span></label>
            
          </div>
          <div v-if="user.type === 'Prof'" class="mb-3">
            <label for="userEtablissement" class="form-label">Etablissement :</label>
            <input type="text" id="userEtablissement" v-model="user.etablissement" class="form-control" name="etablissement">
            <small class="text-muted">Nom de l'établissement où le professeur enseigne.</small>
          </div>
          <div class="mb-3">
            <label for="newPassword" class="form-label">Changer le mot de passe :</label>
            <input type="password" id="newPassword" v-model="password" class="form-control"
              placeholder="Nouveau mot de passe" name=mdp>
          </div>
          <div class="mb-3">
            <label for="confirmPassword" class="form-label">Confirmer le mot de passe :</label>
            <input type="password" id="confirmPassword" v-model="confirmPassword" class="form-control"
              placeholder="Confirmer le mot de passe" name=mdpConfirm>
            <small class="text-muted">Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre
              et un caractère spécial.</small>
          </div>
          <div class="text-center">
            <button type="submit" class="btn btn-primary">Mettre à jour</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getSubFromToken, returnUserType } from "../utils/session.mjs";
import { updateProfil, hashPassword } from "../utils/func.mjs";
import axios from 'axios';

const headers = useRequestHeaders(["cookie"]) as HeadersInit;

const { data: token } = await useFetch("/api/token", { headers });

const id = getSubFromToken(token);
const type = await returnUserType(id);

const { status } = useAuth();

const error = ref<string>("");
const warning = ref<string>("");
const success = ref<string>("");

interface User {
  id: number;
  mail: string;
  type: string;
  etablissement?: string;
}

const user = ref<User>({
  id: 0,
  mail: "",
  type: "",
  etablissement: "",
});

const password = ref<string>("");
const confirmPassword = ref<string>("");

const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const handleUpdate = async () => {

  if (password.value && !passwordPolicy.test(password.value)) {
    warning.value = "Le mot de passe n'est pas assez fort";
    return;
  }

  if (password.value !== confirmPassword.value) {
    error.value = "Les mots de passe ne correspondent pas";
    return;
  }
  const updatedUser: any = {
    id: id,
    mail: user.value.mail,
    etablissement: user.value.etablissement,
  };

  if (password.value) {
    updatedUser.mdp = await hashPassword(password.value);
  }

  try {
    await updateProfil(updatedUser);
    success.value = "Profil mis à jour avec succès";
    password.value = "";
    confirmPassword.value = "";
  } catch (e) {
    error.value = "Erreur lors de la mise à jour du profil";
  }
};



onMounted(() => {
  axios.get(`http://localhost:3001/profils/id/${id}`)
    .then(response => {
      user.value = response.data;
    })
    .catch(error => {
      console.error('Error fetching profils:', error);
    });
});

</script>
