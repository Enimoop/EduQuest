<template>
    <div class="container">
      <div class="card mt-5">
        <div class="card-header bg-primary text-white">
          <h5 class="card-title mb-0">Profil Utilisateur</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <h6 class="card-subtitle mb-2 text-muted">Identifiant :</h6>
              <p class="card-text">{{ user.id }}</p>
            </div>
            <div class="col-md-4">
              <h6 class="card-subtitle mb-2 text-muted">Email :</h6>
              <p class="card-text">{{ user.mail }}</p>
            </div>
            <div class="col-md-4">
              <h6 class="card-subtitle mb-2 text-muted">Type :</h6>
              <p class="card-text">{{ user.type }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
    import axios from 'axios';

    const user = ref([]);

    onMounted(() => {
      const email = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).mail : '';
      axios.get(`http://localhost:3001/profils/${email}`)
        .then(response => {
          user.value = response.data;
          console.log(user.value);
        })
        .catch(error => {
          console.error('Error fetching user:', error);
        });
    });
  </script>