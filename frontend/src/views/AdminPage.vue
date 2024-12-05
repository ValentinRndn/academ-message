<template>
  <div class="home-container">
    <Navbar></Navbar>
    <!-- Afficher le dashboard approprié en fonction du rôle de l'utilisateur -->
    <adminDashboard v-if="userRole === 'admin'"></adminDashboard>
    <p v-if="!userRole">Aucun rôle défini ou utilisateur non authentifié.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '../components/Navbar.vue';
import adminDashboard from '../components/dashboard/adminDashboard.vue';
import { getUserRoleFromToken } from '../services/decodeJwt.js'; 

// Déclaration de la variable réactive pour stocker le rôle
const userRole = ref('');

// Appeler la fonction pour récupérer le rôle lors du montage du composant
onMounted(() => {
  const role = getUserRoleFromToken(); 
  if (role) {
    userRole.value = role;
  } else {
    console.warn('Rôle non trouvé ou utilisateur non authentifié.');
  }
});
</script>

<style scoped>
</style>
