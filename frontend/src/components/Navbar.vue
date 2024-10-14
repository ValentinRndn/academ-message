<template>
    <nav class="bg-white border-b border-gray-200">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <a href="#" class="text-2xl font-bold text-blue-500">Academ-Message</a>
          </div>
          <!-- Navigation Links pour petits écrans -->
          <div class="flex md:hidden space-x-8">
            <a href="#" class="text-gray-500 hover:text-gray-900">Accueil</a>
            <a href="#" class="text-gray-500 hover:text-gray-900">Cours</a>
            <a href="#" class="text-gray-500 hover:text-gray-900">Professeurs</a>
            <a href="#" class="text-gray-500 hover:text-gray-900">À propos</a>
          </div>
  
          <!-- Boutons d'authentification ou photo de profil -->
          <div class="flex md:hidden items-center space-x-4">
            <template v-if="isAuthenticated">
                <div class="profil-container flex items-center justify-center">
              <img
                src="../assets/profil/pp.avif"
                alt="Profile"
                class="w-10 h-10 rounded-full border border-gray-300"
                @click="goToProfile"
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m12 15.4l-6-6L7.4 8l4.6 4.6L16.6 8L18 9.4z"/></svg>
            </div>
            </template>
            <template v-else>
              <button @click="goToLogin" class="text-gray-500 border border-gray-500 p-2 hover:text-gray-900">
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
          <a href="#" class="block px-4 py-2 text-gray-500 hover:text-gray-900">Accueil</a>
          <a href="#" class="block px-4 py-2 text-gray-500 hover:text-gray-900">Cours</a>
          <a href="#" class="block px-4 py-2 text-gray-500 hover:text-gray-900">Professeurs</a>
          <a href="#" class="block px-4 py-2 text-gray-500 hover:text-gray-900">À propos</a>
        </div>
        <div class="py-3 border-t border-gray-200">
          <button @click="goToLogin" class="block w-full text-left px-4 py-2 text-gray-500 hover:text-gray-900">Se connecter</button>
          <button @click="goToSignup" class="block w-full text-left px-4 py-2 bg-blue-500 text-white hover:bg-blue-600">S'inscrire</button>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isMobileMenuOpen: false,
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
          // Supposons que la photo de profil est stockée ou que tu l'appelles via une API
          this.userProfilePicture = localStorage.getItem('userProfilePicture') || 'default-profile-pic-url.jpg';
        }
      },
      goToLogin() {
        this.$router.push({ name: 'auth' });
      },
      goToSignup() {
        this.$router.push({ name: 'signup' });
      },
      goToProfile() {
        // Redirige vers la page de profil utilisateur
        this.$router.push({ name: 'profile' });
      }
    }
  };
  </script>
  
  <style scoped>
  /* Styles additionnels pour la photo de profil et les boutons */
  </style>
  