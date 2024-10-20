<template>
  <nav class="navbar bg-darkgray mb-4">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center">
          <router-link to="/" class="text-2xl font-bold textGradient">Academ-Message</router-link>
        </div>

        <!-- Navigation Links pour petits écrans -->
        <div class="flex md:hidden space-x-8 font-semibold text-lg">
          <router-link 
            v-if="userRole === 'admin'" 
            to="/adminPage" 
            class="text-white hover:text-purplee" 
            :class="{ 'active-link': $route.path === '/adminPage' }"
          >
            Accueil
          </router-link>
          <router-link 
            to="/" 
            class="text-white hover:text-purplee" 
            :class="{ 'active-link': $route.path === '/' }"
          >
            Conversations
          </router-link>
          <router-link 
            to="/professors" 
            class="text-white hover:text-purplee" 
            :class="{ 'active-link': $route.path === '/professors' }"
          >
            Professeurs
          </router-link>
        </div>

        <!-- Boutons d'authentification ou photo de profil -->
        <div class="flex md:hidden items-center space-x-4">
          <template v-if="isAuthenticated">
            <div class="relative profil-container flex items-center justify-center">
              <img
                :src="userProfilePicture"
                alt="Profile"
                class="w-10 h-10 rounded-full border border-gray-300 cursor-pointer"
                @click="toggleProfileMenu"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                :class="['cursor-pointer text-white transition transform duration-200', isProfileMenuOpen ? 'rotate-180' : 'rotate-0']"
                @click="toggleProfileMenu"
              >
                <path fill="currentColor" d="m12 15.4l-6-6L7.4 8l4.6 4.6L16.6 8L18 9.4z" />
              </svg>

              <!-- Menu déroulant -->
              <div v-if="isProfileMenuOpen" class="absolute right-0 mt-32 w-48 backdrop-blur-xl bg-darkgray border border-white shadow-lg rounded-md z-20">
                <ul class="py-1 text-white">
                  <li>
                    <router-link to="profileParameter" class="block px-4 py-2 hover:bg-lightgray cursor-pointer">Paramètre profil</router-link>
                  </li>
                  <li>
                    <a @click="logout" class="block px-4 py-2 hover:bg-lightgray cursor-pointer">Se déconnecter</a>
                  </li>
                </ul>
              </div>
            </div>
          </template>
          <template v-else>
            <button @click="goToLogin" class="text-purplee rounded-lg border border-purplee p-2 hover:text-white">
              Se connecter | S'inscrire
            </button>
          </template>
        </div>

        <!-- Mobile Menu Button pour grands écrans -->
        <div class="hidden md:flex items-center">
          <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="text-gray-500 hover:text-gray-900 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Menu Mobile pour grands écrans -->
    <div v-if="isMobileMenuOpen" class="hidden md:flex bg-white border-t border-gray-200">
      <div class="pt-2 pb-3 space-y-1">
        <router-link to="/" class="block px-4 py-2 text-gray-500 hover:text-gray-900" :class="{ 'active-link': $route.path === '/' }">Accueil</router-link>
        <router-link to="/" class="block px-4 py-2 text-gray-500 hover:text-gray-900" :class="{ 'active-link': $route.path === '/' }">Conversations</router-link>
        <router-link to="/professors" class="block px-4 py-2 text-gray-500 hover:text-gray-900" :class="{ 'active-link': $route.path === '/professors' }">Professeurs</router-link>
      </div>
      <div class="py-3 border-t border-gray-200">
        <button @click="goToLogin" class="block w-full text-left px-4 py-2 text-gray-500 hover:text-gray-900">Se connecter</button>
        <button @click="goToSignup" class="block w-full text-left px-4 py-2 bg-blue-500 text-white hover:bg-blue-600">S'inscrire</button>
      </div>
    </div>
  </nav>
</template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
      isMobileMenuOpen: false,
      isProfileMenuOpen: false, // État pour gérer l'ouverture/fermeture du menu profil
      isAuthenticated: false, // État pour vérifier si l'utilisateur est connecté
      userProfilePicture: '' // URL de la photo de profil
    };
  },
  mounted() {
    this.checkAuthStatus();
  },
  methods: {
    // Méthode pour vérifier si l'utilisateur est authentifié
    checkAuthStatus() {
      const token = localStorage.getItem('token');
      if (token) {
        this.isAuthenticated = true;

        // Faire une requête pour obtenir le profil utilisateur
        axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        .then((response) => {
          this.userProfilePicture = `http://localhost:5000/uploads/${response.data.profilePicture}`;
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des informations du profil:', error);
          this.userProfilePicture = 'default-profile-pic-url.jpg'; // Image par défaut si erreur
        });
      }
    },
    toggleProfileMenu() {
      this.isProfileMenuOpen = !this.isProfileMenuOpen;
    },
    goToLogin() {
      this.$router.push({ name: 'auth' });
    },
    goToSignup() {
      this.$router.push({ name: 'signup' });
    },
    logout() {
      // Supprimer le token et déconnecter l'utilisateur
      localStorage.removeItem('token');
      this.isAuthenticated = false;
      this.isProfileMenuOpen = false;
      this.$router.push({ name: 'auth' }); // Redirige vers la page de connexion après déconnexion
    }
  }
};
</script>

<style scoped>
.profil-container {
  position: relative;
}

.active-link {
  text-decoration: underline;
  text-underline-offset: 4px; 
  text-decoration-thickness: 2px; 
  color: rgba(217,167,228,1);
}
</style>
