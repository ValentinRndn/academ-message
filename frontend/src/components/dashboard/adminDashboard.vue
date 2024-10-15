<template>
    <div class="admin-dashboard p-8 bg-gray-100 min-h-screen">
      <!-- En-tête -->
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Tableau de Bord Administrateur</h1>
        <p class="text-gray-600">Vision d'ensemble et gestion des professeurs.</p>
      </header>
  
      <!-- Statistiques générales -->
      <div class="stats grid grid-cols-3 sm:grid-cols-1  gap-6 mb-12">
        <div class="stat-card bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold text-gray-700">Nombre de Professeurs</h2>
          <p class="stat-value text-4xl font-bold text-blue-500">25</p>
        </div>
        <div class="stat-card bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold text-gray-700">Nombre d'Élèves</h2>
          <p class="stat-value text-4xl font-bold text-blue-500">120</p>
        </div>
        <div class="stat-card bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold text-gray-700">Nombre de Cours</h2>
          <p class="stat-value text-4xl font-bold text-blue-500">45</p>
        </div>
      </div>
  
      <!-- Formulaire de création de professeur -->
      <div class="create-professor bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-gray-700 mb-4">Créer un nouveau professeur</h2>
        <form @submit.prevent="createProfessor">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700">Nom</label>
            <input
              v-model="name"
              type="text"
              id="name"
              class="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nom du professeur"
              required
            />
          </div>
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="email"
              type="email"
              id="email"
              class="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Email du professeur"
              required
            />
          </div>
          <div class="mb-4">
            <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              v-model="password"
              type="password"
              id="password"
              class="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Mot de passe du professeur"
              required
            />
          </div>
          <button
            type="submit"
            class="bg-blue-500 text-black border border-gray-300 p-2 w-full rounded-md hover:bg-blue-600 transition duration-200"
          >
            Créer le professeur
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "adminDashboard",
    data() {
      return {
        name: "",
        email: "",
        password: "",
      };
    },
    methods: {
      async createProfessor() {
        try {
          // Envoi de la requête pour créer un professeur
          const response = await axios.post("http://localhost:5000/api/professors", {
            name: this.name,
            email: this.email,
            password: this.password,
          });
  
          // Réinitialisation du formulaire
          this.name = "";
          this.email = "";
          this.password = "";
  
          alert("Professeur créé avec succès !");
        } catch (err) {
          console.error("Erreur lors de la création du professeur:", err);
          alert("Erreur lors de la création du professeur. Veuillez réessayer.");
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .admin-dashboard {
    background-color: #f7fafc;
  }
  .stat-card {
    transition: transform 0.2s ease-in-out;
  }
  .stat-card:hover {
    transform: translateY(-5px);
  }
  </style>
  