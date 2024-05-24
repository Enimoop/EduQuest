<template>
    <div class="container mt-5">
      <!-- Section de bienvenue -->
      <div class="text-center mb-5">
        <h1 class="display-4">Bienvenue sur EduQuest</h1>
        <p class="lead">Votre plateforme d'apprentissage en ligne !</p>
      </div>
  
      <!-- Image d'illustration -->
      <div class="text-center mb-5">
        <img src="public/image/Logo_EduQuest.jpg" alt="Bienvenue sur EduQuest" class="img-fluid" />
      </div>
  
      <!-- Section des dernières notes de l'élève -->
      <div v-if="type === 'Eleve'" class="row mb-5">
        <div class="col-lg-12">
            <div class="card-body">
              <NotesParMatiere />
            </div>
        </div>
      </div>
  
      <!-- Section des niveaux dans les matières -->
      <div v-if="type === 'Eleve'" class="row mb-5">
        <div class="col-lg-12">
            <div class="card-body">
              <LvlParMatiere />
            </div>
        </div>
      </div>
  
      <!-- Section de la liste des guildes pour les professeurs -->
      <div v-if="type === 'Prof'" class="row mb-5">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">Liste des guildes</h5>
            </div>
            <div class="card-body">
              <ListeGuildeProf />
            </div>
          </div>
        </div>
      </div>
  
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import NotesParMatiere from '~/components/NotesParMatiere.vue';
  import LvlParMatiere from '~/components/LvlParMatiere.vue';
  import ListeGuildeProf from '~/components/ListeGuildeProf.vue';
  
  // Simuler les props ou des données dynamiques pour type
  // Dans une vraie application, ces valeurs devraient être fournies dynamiquement.
  const type = ref('Eleve');  // ou 'Professeur' selon le type d'utilisateur
  </script>
  