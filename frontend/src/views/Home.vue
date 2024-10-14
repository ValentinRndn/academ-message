<template>
    <div>
      <h1>Bienvenue sur la page protégée, {{ user.email }} !</h1>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        user: {}
      };
    },
    async created() {
      try {
        // Récupérer le token depuis le localStorage
        const token = localStorage.getItem('token');
  
        // Envoyer une requête avec le token pour récupérer les infos de l'utilisateur
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        // Stocker les informations utilisateur
        this.user = response.data;
      } catch (err) {
        console.error('Failed to fetch user data', err);
        // Si le token est invalide, rediriger vers la page de connexion
        this.$router.push({ name: 'auth' });
      }
    }
  };
  </script>
  