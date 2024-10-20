<template>
  <div class="home-container">
    <Navbar></Navbar>
    <!-- Afficher le dashboard approprié en fonction du rôle de l'utilisateur -->
    <adminDashboard v-if="userRole === 'admin'"></adminDashboard>
    <clientDashboard v-if="userRole === 'client'"></clientDashboard>
    <professorDashboard v-if="userRole === 'professor'"></professorDashboard>
    <p v-if="!userRole">Aucun rôle défini ou utilisateur non authentifié.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '../components/Navbar.vue';
import adminDashboard from '../components/dashboard/adminDashboard.vue';
import clientDashboard from '../components/dashboard/clientDashboard.vue';
import professorDashboard from '../components/dashboard/professorDashboard.vue';
import { getUserRoleFromToken } from '../services/decodeJwt.js'; // Importer la fonction getUserRoleFromToken

// Déclaration de la variable réactive pour stocker le rôle
const userRole = ref('');

// Appeler la fonction pour récupérer le rôle lors du montage du composant
onMounted(() => {
  const role = getUserRoleFromToken(); // Appeler la méthode pour obtenir le rôle
  if (role) {
    userRole.value = role;
  } else {
    console.warn('Rôle non trouvé ou utilisateur non authentifié.');
  }
});
</script>

<style scoped>
</style>
