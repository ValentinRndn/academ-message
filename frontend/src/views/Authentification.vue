<template>
    <div class="login-container">
      <h2>Connexion</h2>
      <form @submit.prevent="login">
        <div>
          <label>Email:</label>
          <input type="email" v-model="email" required />
        </div>
        <div>
          <label>Mot de passe:</label>
          <input type="password" v-model="password" required />
        </div>
        <button type="submit">Se connecter</button>
      </form>
  
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        email: '',
        password: '',
        error: ''
      };
    },
    methods: {
      async login() {
        try {
          // Envoyer une requête POST à l'API Express pour se connecter
          const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: this.email,
            password: this.password
          });
  
          // Si la connexion réussit, stocker le token JWT dans le localStorage
          console.log('Token JWT:', response.data.token); // Le token est bien reçu
  
          localStorage.setItem('token', response.data.token); // Stocker le token
  
          // Rediriger vers la page protégée (Home par exemple)
          this.$router.push({ name: 'home' });
        } catch (err) {
          // Si la connexion échoue, afficher un message d'erreur
          this.error = 'Invalid credentials. Please try again.';
        }
      }
    }
  };
  </script>
  
  
  <style scoped>
  /* Style simple pour le formulaire */
  .login-container {
    max-width: 400px;
    margin: 0 auto;
  }
  .error {
    color: red;
  }
  </style>
  