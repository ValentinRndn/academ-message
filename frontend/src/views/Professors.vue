<template>
    <Navbar></Navbar>
  
    <div class="p-8 bg-gray-100 min-h-screen">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Trouvez votre professeur</h1>
  
      <!-- Barre de recherche -->
      <div class="mb-8">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher par nom ou matière"
          class="p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
  
      <!-- Liste des professeurs -->
      <div v-if="filteredProfessors.length > 0" class="flex justify-center w-full h-full flex-wrap gap-6">
        <div
          v-for="professor in filteredProfessors"
          :key="professor._id"
          class="professor-card bg-white p-4 w-[400px] h-[200px] rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-shadow duration-200"
          @click="goToProfessorDetail(professor._id)"
        >
          <h2 class="text-xl font-bold text-gray-800">{{ professor.name }}</h2>
          <p class="text-gray-600">Matière : {{ professor.subject }}</p>
        </div>
      </div>
  
      <!-- Message si aucun professeur n'est trouvé -->
      <div v-else class="text-gray-500">
        <p>Aucun professeur trouvé.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import Navbar from '../components/Navbar.vue';
  
  // État pour la liste des professeurs récupérés via l'API
  const professors = ref([]);
  
  // État pour la barre de recherche
  const searchQuery = ref('');
  
  // Gestion des erreurs d'API
  const error = ref(null);
  
  // Utiliser Vue Router pour rediriger vers la page de détail d'un professeur
  const router = useRouter();
  
  // Appel API pour récupérer les utilisateurs avec le rôle "professor"
  const fetchProfessors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/professors');
      professors.value = response.data; // Assurez-vous que l'API renvoie un tableau d'utilisateurs
    } catch (err) {
      console.error('Erreur lors de la récupération des professeurs :', err);
      error.value = 'Erreur lors de la récupération des professeurs';
    }
  };
  
  // Appel de l'API lorsque le composant est monté
  onMounted(fetchProfessors);
  
  // Méthode pour filtrer la liste des professeurs en fonction du nom ou de la matière
  const filteredProfessors = computed(() => {
    return professors.value.filter(professor => {
      const query = searchQuery.value.toLowerCase();
      return (
        professor.name.toLowerCase().includes(query) ||
        professor.subject.toLowerCase().includes(query)
      );
    });
  });
  
  // Méthode pour rediriger vers la page de détail du professeur
  const goToProfessorDetail = (professorId) => {
    router.push({ name: 'professorDetail', params: { id: professorId } });
  };
  </script>
  
  <style scoped>
  .professor-card {
    transition: transform 0.2s ease-in-out;
  }
  .professor-card:hover {
    transform: translateY(-5px);
  }
  </style>
  