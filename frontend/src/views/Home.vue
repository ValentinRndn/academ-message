<template>
  <div>
    <Navbar></Navbar>
    <!-- Afficher le dashboard approprié en fonction du rôle de l'utilisateur -->
    <!-- <adminDashboard v-if="userRole === 'admin'"></adminDashboard> -->
    <!-- <clientDashboard v-if="userRole === 'client'"></clientDashboard> -->
    <clientDashboard></clientDashboard>
    <p v-if="!userRole">Aucun rôle défini ou utilisateur non authentifié.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '../components/Navbar.vue';
import adminDashboard from '../components/dashboard/adminDashboard.vue';
import clientDashboard from '../components/dashboard/clientDashboard.vue';
import professorDashboard from '../components/dashboard/professorDashboard.vue';

// Fonction utilitaire pour décoder le token JWT manuellement
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1]; // Extraire la partie payload
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload); // Retourner la payload décodée en JSON
  } catch (e) {
    console.error('Erreur lors du décodage du JWT:', e);
    return null;
  }
};

// Déclaration de la variable réactive pour stocker le rôle
const userRole = ref('');

// Fonction pour décoder le JWT et récupérer le rôle de l'utilisateur
const getUserRoleFromToken = () => {
  const token = localStorage.getItem('token'); // Récupérer le token JWT du localStorage
  if (token) {
    const decodedToken = decodeJWT(token); // Décoder le token manuellement
    console.log('Decoded JWT:', decodedToken); // Voir le contenu du token décodé
    if (decodedToken && decodedToken.user && decodedToken.user.role) {
      userRole.value = decodedToken.user.role; // Récupérer le rôle de l'utilisateur dans la payload
    } else {
      console.warn('Le rôle n\'est pas défini dans le token JWT.');
    }
  } else {
    console.warn('Aucun token JWT trouvé.');
  }
};

// Appeler la fonction pour récupérer le rôle lors du montage du composant
onMounted(() => {
  getUserRoleFromToken();
});
</script>

<style scoped>
/* Ajout de styles pour les dashboards */
</style>
