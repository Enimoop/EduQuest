<template>
<NuxtLayout layout="default">
<FormConnexion/>
</NuxtLayout>
</template>

<script setup>

import { ref, computed } from 'vue';
  import FormConnexion from '../components/FormConnexion.vue';
  import 'bootstrap/dist/css/bootstrap.css';
  import { useRouter } from 'vue-router';
</script>