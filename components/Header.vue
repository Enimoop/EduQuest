<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark border-bottom my-navbar">
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand">EduQuest</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link to="/" class="nav-link">Accueil</router-link>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="matieresDropdown" role="button"
                data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
                Matières
              </a>
              <ul class="dropdown-menu" aria-labelledby="matieresDropdown">
                <li><router-link to="/matiere/1" class="dropdown-item">Français</router-link></li>
                <li><router-link to="/matiere/2" class="dropdown-item">Maths</router-link></li>
                <li><router-link to="/matiere/3" class="dropdown-item">Histoire</router-link></li>
                <li><router-link to="/matiere/4" class="dropdown-item">Géographie</router-link></li>
                <li><router-link to="/matiere/5" class="dropdown-item">Anglais</router-link></li>
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="matieresDropdown" role="button"
                data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
                Contenu
              </a>
              <ul class="dropdown-menu" aria-labelledby="matieresDropdown">
                <li><router-link to="/cours" class="dropdown-item">Cours</router-link></li>
                <li><router-link to="/exercices" class="dropdown-item">Exercices</router-link></li>
              </ul>
            </li>
          </ul>
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link to="/profil" class="nav-link">
                <!-- <img src="path/to/profile-image.jpg" alt="Profile image" class="rounded-circle me-2" width="32" height="32"> -->
                Mon Profil
              </router-link>
            </li>
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

