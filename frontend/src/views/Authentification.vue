<template>
    <div class="auth-container flex justify-center items-center min-h-[100vh]  text-gray-800">
      <div class="auth-card p-4 rounded-lg w-full max-w-[400px] text-center  ">
        <h2 class="mb-2 text-2xl font-semibold">{{ isLogin ? 'CONNEXION' : 'INSCRIPTION' }}</h2>
  
        <form @submit.prevent="isLogin ? login() : register()">
          <div class="form-group">
            <label class="label-form text-gray-600">Email:</label>
            <input type="email" v-model="email" class="bg-transparent" placeholder="Entrer votre email" required />
          </div>
  
          <div class="form-group">
            <label class="label-form text-gray-600">Mot de passe:</label>
            <input type="password" v-model="password" class="bg-transparent" placeholder="Entrer votre mot de passe" required />
          </div>
  
          <!-- Champ supplémentaire pour l'inscription -->
          <div v-if="!isLogin" class="form-group">
            <label class="label-form ">Confirmer le mot de passe:</label>
            <input type="password" v-model="confirmPassword" class="bg-transparent" placeholder="Confirmer votre mot de passe" required />
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
  /* Conteneur principal */
  .auth-container {
    background: linear-gradient(135deg, #1e1e2f 0%, #302b63 50%, #24243e 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 1rem;
    color: #dcdcdc;
  }
  
  /* Carte du formulaire */
  .auth-card {
    padding: 2.5rem;
    width: 100%;
    max-width: 400px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(12px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  /* Titres */
  .auth-card h2 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: #ec79f7;
    /* text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); */
  }
  
  /* Champs d'entrée */
  input {
    width: 100%;
    padding: 0.9rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.05);
    color: #e8e8e8;
    margin-bottom: 1.2rem;
    font-size: 1rem;
    transition: all 0.3s ease;
  }
  
  input:focus {
    border-color: #a464d4;
    outline: none;
    background-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 6px rgba(236, 121, 247, 0.7);
  }
  
  /* Bouton d'action */
  .auth-button {
    background: linear-gradient(135deg, #9b59b6, #e056fd);
    color: white;
    font-weight: 600;
    font-size: 1rem;
    padding: 0.9rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: background 0.3s ease, transform 0.2s ease;
  }
  
  .auth-button:hover {
    background: linear-gradient(135deg, #8e44ad, #d441ff);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(239, 68, 255, 0.5);
  }
  
  /* Messages d'erreur */
  .error {
    color: #ff6b6b;
    font-size: 0.9rem;
    margin-top: 0.8rem;
    font-weight: bold;
  }
  
  /* Lien pour basculer entre Connexion et Inscription */
  .toggle-auth {
    margin-top: 2rem;
    font-size: 0.95rem;
    color: #b8b8b8;
  }
  
  .toggle-auth a {
    color: #ec79f7;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .toggle-auth a:hover {
    color: #d441ff;
    text-decoration: underline;
  }
  
  /* Améliorations visuelles */
  .auth-card label {
    display: block;
    text-align: left;
    margin-bottom: 0.5rem;
    font-weight: 500;
    font-size: 0.95rem;
    color: #c6c6c6;
  }
  
  .auth-card input::placeholder {
    color: rgba(200, 200, 200, 0.6);
  }
  
  .auth-card input:hover {
    background-color: rgba(255, 255, 255, 0.07);
  }
  </style>
  