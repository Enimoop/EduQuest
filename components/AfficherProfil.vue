<template>
  <div class="container">
    <div class="card mt-3">
      <div class="card-header bg-primary text-white">
        <h5 class="card-title mb-0">Profil Utilisateur</h5>
      </div>
      <div class="card-body">
        <div class="row gx-2">
          <div class="col-md-6 mb-2">
            <div class="d-flex justify-content-between align-items-center">
              <h6 class="card-subtitle mb-1 text-muted">Identifiant :</h6>
              <p class="card-text">{{ user.id }}</p>
            </div>
            <hr class="mt-1 mb-1">
            <small class="text-muted">Cet identifiant est unique pour chaque utilisateur.</small>
          </div>
          <div class="col-md-6 mb-2">
            <div class="d-flex justify-content-between align-items-center">
              <h6 class="card-subtitle mb-1 text-muted">Email :</h6>
              <p class="card-text">{{ user.email }}</p>
            </div>
            <hr class="mt-1 mb-1">
            <small class="text-muted">L'adresse email associée à ce compte utilisateur.</small>
          </div>
          <div class="col-md-6 mb-2">
            <div class="d-flex justify-content-between align-items-center">
              <h6 class="card-subtitle mb-1 text-muted">Nom :</h6>
              <p class="card-text">{{ user.name }}</p>
            </div>
            <hr class="mt-1 mb-1">
            <small class="text-muted">Le nom complet de l'utilisateur.</small>
          </div>
          <div class="col-md-6 mb-2">
            <div class="d-flex justify-content-between align-items-center">
              <h6 class="card-subtitle mb-1 text-muted">Type :</h6>
              <p class="card-text">{{ user.type }}</p>
            </div>
            <hr class="mt-1 mb-1">
            <small class="text-muted">Le type d'utilisateur (ex: administrateur, utilisateur standard, etc.).</small>
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