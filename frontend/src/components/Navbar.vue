<template>
  <nav class="navbar text-white mb-4 shadow-lg ">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center">
          <router-link to="/" class="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            <img src="../assets/logo_academ.png" alt="Logo" class="w-[40px]">
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="flex md:hidden space-x-8 font-medium text-lg">
          <router-link 
            v-if="userRole === 'admin'" 
            to="/adminPage" 
            class="hover:text-purple-400 transition"
            :class="{ 'underline decoration-2 decoration-purple-500': $route.path === '/adminPage' }"
          >
            Accueil
          </router-link>
          <router-link 
            to="/" 
            class="hover:text-purple-400 transition"
            :class="{ 'underline decoration-2 decoration-purple-500': $route.path === '/' }"
          >
            Conversations
          </router-link>
          <router-link 
            to="/professors" 
            class="hover:text-purple-400 transition"
            :class="{ 'underline decoration-2 decoration-purple-500': $route.path === '/professors' }"
          >
            Professeurs
          </router-link>
        </div>

        <!-- Auth/Profil Section -->
        <div class="flex md:hidden items-center space-x-4">
          <template v-if="isAuthenticated">
            <div class="relative profil-container flex items-center">
              <img
                :src="userProfilePicture"
                alt="Profile"
                class="w-10 h-10 rounded-full border border-gray-600 cursor-pointer"
                @click="toggleProfileMenu"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6 ml-2 text-gray-300 cursor-pointer transform transition-transform duration-200"
                :class="{ 'rotate-180': isProfileMenuOpen }"
                @click="toggleProfileMenu"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="m12 15.4l-6-6L7.4 8l4.6 4.6L16.6 8L18 9.4z" />
              </svg>

              <!-- Dropdown Menu -->
              <div
                v-if="isProfileMenuOpen"
                class="dropdown-menu bg-darkblue absolute right-0 mt-40 w-48  border  rounded-lg shadow-lg z-20"
              >
                <ul class="py-2 text-sm text-gray-200">
                  <li>
                    <router-link 
                      to="profileParameter" 
                      class="block px-4 py-2 hover:bg-gray-800 rounded-lg transition"
                    >
                      Paramètre profil
                    </router-link>
                  </li>
                  <li>
                    <a 
                      @click="logout" 
                      class="block px-4 py-2 hover:bg-gray-800 rounded-lg transition cursor-pointer"
                    >
                      Se déconnecter
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </template>
          <template v-else>
            <button 
              @click="goToLogin" 
              class="text-purple-500 border border-purple-500 px-4 py-2 rounded-lg hover:bg-purple-500 hover:text-white transition"
            >
              Se connecter | S'inscrire
            </button>
          </template>
        </div>

        <!-- Mobile Menu Button -->
        <div class="hidden md:flex items-center">
          <button 
            @click="isMobileMenuOpen = !isMobileMenuOpen" 
            class="text-gray-500 hover:text-gray-300 focus:outline-none transition"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isMobileMenuOpen" class="hidden md:flex bg-gray-800 border-t border-gray-700 ">
      <div class="py-2 space-y-1">
        <router-link 
          to="/" 
          class="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition"
          :class="{ 'bg-gray-700': $route.path === '/' }"
        >
          Accueil
        </router-link>
        <router-link 
          to="/" 
          class="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition"
          :class="{ 'bg-gray-700': $route.path === '/' }"
        >
          Conversations
        </router-link>
        <router-link 
          to="/professors" 
          class="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition"
          :class="{ 'bg-gray-700': $route.path === '/professors' }"
        >
          Professeurs
        </router-link>
      </div>
      <div class="py-3 border-t border-gray-700">
        <button 
          @click="goToLogin" 
          class="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 transition"
        >
          Se connecter
        </button>
        <button 
          @click="goToSignup" 
          class="block w-full text-left px-4 py-2 bg-purple-500 text-white hover:bg-purple-600 transition rounded-lg"
        >
          S'inscrire
        </button>
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

.navbar {
  background: linear-gradient(135deg, #1e1e2f 0%, #302b63 50%, #24243e 100%);

}

.dropdown-menu {
  border: 1px solid rgba(255, 255, 255, 0.2);

}
</style>
