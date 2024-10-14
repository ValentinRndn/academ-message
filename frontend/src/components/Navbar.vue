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
          <!-- Boutons d'authentification pour petits écrans -->
          <div class="flex md:hidden items-center space-x-4">
            <button @click="goToLogin" class="text-gray-500 border border-gray-500 p-2 hover:text-gray-900">Se connecter | Se connecter</button>
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
        isMobileMenuOpen: false
      };
    },
    methods: {
      goToLogin() {
        this.$router.push({ name: 'auth' }); // Rediriger vers la page de connexion
      },
      goToSignup() {
        this.$router.push({ name: 'signup' }); // Rediriger vers la page d'inscription
      }
    }
  }
  </script>
  
  <style scoped>
  /* Ajout d'un style spécifique pour une meilleure lisibilité */
  </style>
  