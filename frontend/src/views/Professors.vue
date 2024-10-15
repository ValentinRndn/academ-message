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
      <div v-if="filteredProfessors.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="professor in filteredProfessors"
          :key="professor.id"
          class="professor-card bg-white p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-shadow duration-200"
          @click="goToProfessorDetail(professor.id)"
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
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
import Navbar from '../components/Navbar.vue';
  
  // Fausse liste de professeurs (tu pourras remplacer ça par une requête API)
  const professors = ref([
    { id: 1, name: 'Jean Dupont', subject: 'Mathématiques' },
    { id: 2, name: 'Marie Curie', subject: 'Physique' },
    { id: 3, name: 'Albert Einstein', subject: 'Physique' },
    { id: 4, name: 'Sophie Germain', subject: 'Mathématiques' },
    { id: 5, name: 'René Descartes', subject: 'Philosophie' },
  ]);
  
  // État pour la barre de recherche
  const searchQuery = ref('');
  
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
  
  // Utiliser Vue Router pour rediriger vers la page de détail d'un professeur
  const router = useRouter();
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
  