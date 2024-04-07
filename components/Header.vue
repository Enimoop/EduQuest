<template>
    <header>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <router-link to="/" class="navbar-brand">Mon Application</router-link>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <router-link to="/" class="nav-link">Accueil</router-link>
              </li>
              <!-- Ajoutez d'autres liens de navigation ici -->
            </ul>
          </div>
        </div>
      </nav>
    </header>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  import { RouterLink } from 'vue-router';
  </script>
  
  <style>
  /* Ajoutez vos styles personnalisés ici */
  </style>
  