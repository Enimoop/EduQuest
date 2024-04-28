<template>
  <div class="container">
    <h1>Connexion</h1>
    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input
          v-model="email"
          type="email"
          name="email"
          id="email"
          class="form-control"
          placeholder="name@company.com"
          required
        />
      </div>
      <div>
        <input
          v-model="password"
          type="password"
          name="password"
          id="password"
          placeholder="••••••••"
          class="form-control"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>

<script setup>
const { signIn } = useAuth();

const email = ref("");
const password = ref("");
</script>
