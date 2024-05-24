<template>
  <form class="registration-form py-4 px-2 bg-light rounded shadow-sm mx-auto" style="max-width: 400px;" @submit.prevent="handleSignIn">
    <h2 class="mb-4 text-center">Se connecter</h2>
    <div class="mb-3">
      <label for="email" class="form-label">Adresse Email</label>
      <input v-model="email" type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="name@company.com" required>
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Mot de Passe</label>
      <input v-model="password" type="password" class="form-control" id="password" placeholder="••••••••" required>
    </div>
    <div class="mb-3 form-check">
      <input type="checkbox" class="form-check-input" id="remember">
      <label class="form-check-label" for="remember">Se Souvenir de moi</label>
    </div>
    <button type="submit" class="btn btn-primary w-100">Connexion</button>
    <p class="mt-3 mb-0 text-center">Pas encore de compte ? <router-link to ="/inscription" class="text-primary">Créer un compte</router-link></p>
  </form>
</template>

<script setup>
const { signIn } = useAuth();

const email = ref("");
const password = ref("");

const handleSignIn = () => {
  signIn('credentials', { email: email.value, password: password.value });
}
</script>
