<template>
    <div>
    
    <CoursParID :cours="cours" />
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';
import CoursParID from '../components/CoursParID.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const cours = ref([]);

// Utilisez onBeforeUnmount pour définir le comportement lorsque le composant est démonté
onBeforeUnmount(() => {
  
  router.push('/cours');
});
</script>