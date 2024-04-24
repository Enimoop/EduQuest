<template>
  <NuxtLayout layout="default">
    <div>
    
    <CoursParID :cours="cours" />
  </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';
import CoursParID from '../components/CoursParID.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const cours = ref([]);


</script>