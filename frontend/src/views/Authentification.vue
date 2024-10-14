<template>
    <div class="auth-container flex justify-center items-center min-h-[100vh] bg-gray-200">
      <div class="auth-card bg-white p-4 rounded-lg w-full max-w-[400px] text-center">
        <h2 class="mb-2 text-xl font-semibold">{{ isLogin ? 'Connexion' : 'Inscription' }}</h2>
  
        <form @submit.prevent="isLogin ? login() : register()">
          <div class="form-group">
            <label class=label-form>Email:</label>
            <input type="email" v-model="email" placeholder="Entrer votre email" required />
          </div>
  
          <div class="form-group">
            <label class=label-form>Mot de passe:</label>
            <input type="password" v-model="password" placeholder="Entrer votre mot de passe" required />
          </div>
  
          <!-- Champ supplémentaire pour l'inscription -->
          <div v-if="!isLogin" class="form-group">
            <label class=label-form>Confirmer le mot de passe:</label>
            <input type="password" v-model="confirmPassword" placeholder="Confirmer votre mot de passe" required />
          </div>
  
          <button type="submit" class="auth-button bg-gray-400 hover:bg-gray-600 text-white p-2 w-full border-none rounded-lg cursor-pointer">
            {{ isLogin ? 'Se connecter' : "S'inscrire" }}
          </button>
        </form>
  
        <p v-if="error" class="error text-red mt-1">{{ error }}</p>
  
        <!-- Lien pour basculer entre Connexion et Inscription -->
        <p class="toggle-auth mt-8">
          {{ isLogin ? "Pas de compte ?" : "Déjà un compte ?" }}
          <a class="text-gray-400 hover:underline" href="#" @click.prevent="isLogin = !isLogin">{{ isLogin ? "S'inscrire" : "Se connecter" }}</a>
        </p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        email: '',
        password: '',
        confirmPassword: '',
        error: '',
        isLogin: true, // Permet de basculer entre Connexion et Inscription
      };
    },
    methods: {
      async login() {
        try {
          const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: this.email,
            password: this.password
          });
  
          localStorage.setItem('token', response.data.token);
          this.$router.push({ name: 'home' });
        } catch (err) {
          this.error = 'Invalid credentials. Please try again.';
        }
      },
      async register() {
        // Vérifier si les mots de passe correspondent
        if (this.password !== this.confirmPassword) {
          this.error = "Les mots de passe ne correspondent pas";
          return;
        }
  
        try {
          const response = await axios.post('http://localhost:5000/api/auth/register', {
            email: this.email,
            password: this.password
          });
  
          // Rediriger après l'inscription réussie
          this.isLogin = true; // Retourner à la page de connexion
          this.error = ''; // Réinitialiser les erreurs
        } catch (err) {
          this.error = "Erreur lors de l'inscription. Veuillez réessayer.";
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Design modernisé pour le formulaire d'authentification */

  
  .auth-card {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }


  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 0.5rem;
  }

  </style>
  