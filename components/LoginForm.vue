<template>
  <form class="py-4 px-2" @submit.prevent="handleSignIn">
  <div class="mb-3">
    <label for="email" class="form-label">Email address</label>
    <input v-model="email" type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="name@company.com" required>
  </div>
  <div class="mb-3">
    <label for="password" class="form-label">Password</label>
    <input v-model="password" type="password" class="form-control" id="password" placeholder="••••••••" required>
  </div>
  <div class="mb-3 form-check">
    <input type="checkbox" class="form-check-input" id="remember">
    <label class="form-check-label" for="remember">Remember me</label>
  </div>
  <button type="submit" class="btn btn-primary w-100">Sign in</button>
  <p class="mt-3 mb-0 text-center">Don't have an account yet? <a href="#" class="text-primary">Sign up</a></p>
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
