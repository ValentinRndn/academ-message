<template>
    <div class="auth-container flex justify-center items-center min-h-[100vh]  text-gray-800">
      <div class="auth-card p-4 rounded-lg w-full max-w-[400px] text-center backdrop-blur-xl bg-gray-200 bg-opacity-30">
        <h2 class="mb-2 text-2xl font-semibold">{{ isLogin ? 'CONNEXION' : 'INSCRIPTION' }}</h2>
  
        <form @submit.prevent="isLogin ? login() : register()">
          <div class="form-group">
            <label class="label-form text-gray-600">Email:</label>
            <input type="email" v-model="email" placeholder="Entrer votre email" required />
          </div>
  
          <div class="form-group">
            <label class="label-form text-gray-600">Mot de passe:</label>
            <input type="password" v-model="password" class="" placeholder="Entrer votre mot de passe" required />
          </div>
  
          <!-- Champ supplémentaire pour l'inscription -->
          <div v-if="!isLogin" class="form-group">
            <label class="label-form ">Confirmer le mot de passe:</label>
            <input type="password" v-model="confirmPassword" placeholder="Confirmer votre mot de passe" required />
          </div>
  
          <button type="submit" class="auth-button bg-purplee hover:bg-bluee text-white font-semibold p-2 w-full border-none rounded-lg cursor-pointer">
            {{ isLogin ? 'Se connecter' : "S'inscrire" }}
          </button>
        </form>
  
        <p v-if="error" class="error text-red mt-1">{{ error }}</p>
  
        <!-- Lien pour basculer entre Connexion et Inscription -->
        <p class="toggle-auth mt-8">
          {{ isLogin ? "Pas de compte ?" : "Déjà un compte ?" }}
          <a class="text-fuchsia-400 hover:underline" href="#" @click.prevent="isLogin = !isLogin">{{ isLogin ? "S'inscrire" : "Se connecter" }}</a>
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
          console.log('Response from login:', response.data); // Voir si le rôle est bien dans la réponse

  
          localStorage.setItem('token', response.data.token);
              // Stocker le rôle de l'utilisateur
          this.$router.push({ name: 'conversations' });
        } catch (err) {
          this.error = 'Mot de passe ou Email incorrecte. Veuillez réessayer.';
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
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }


  input {
    width: 100%;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 0.5rem;
    background-color: transparent;
  }

  .auth-container {
    background: rgb(205,208,224);
    background: linear-gradient(304deg, rgba(205,208,224,1) 0%, rgba(187,185,228,1) 29%, rgba(217,167,228,1) 72%, rgba(229,188,255,1) 100%);
  }

  </style>
  