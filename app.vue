<template>
  <div>
    
    <ListeEleves :eleves="eleves" />

    <br>

    <DetailsEleve :eleve="eleveSelectionne" @afficher-details-par-id="afficherDetails" />
  

    <ListeProfesseurs :professeurs="professeurs" />

    <ListeMatieres :matieres="matieres" />

    
   
  </div>
</template>

<script setup>
import { ref } from 'vue';
import 'bootstrap/dist/css/bootstrap.css'
import ListeEleves from './components/ListeEleve.vue';
import ListeProfesseurs from './components/ListeProfesseur.vue';
import DetailsEleve from './components/EleveParID.vue';
import ListeMatieres from './components/ListeMatiere.vue';


const eleves = ref([]);
const professeurs = ref([]);
const matieres = ref([]);
const eleveSelectionne = ref(null);

const afficherDetails = (eleve) => {
  eleveSelectionne.value = eleve;
};
</script>
