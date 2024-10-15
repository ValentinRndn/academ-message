<template>
    <div class="p-8 bg-gray-100 min-h-screen">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Détail du Professeur</h1>
  
      <!-- Affichage des détails du professeur -->
      <div v-if="professor" class="professor-detail bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-gray-800">{{ professor.name }}</h2>
        <p class="text-gray-600 mt-2"><strong>Matière : </strong>{{ professor.subject }}</p>
        <p class="text-gray-600 mt-2"><strong>Biographie : </strong>{{ professor.bio }}</p>
        <p class="text-gray-600 mt-2"><strong>Années d'expérience : </strong>{{ professor.experience }} ans</p>
      </div>
  
      <!-- Bouton de retour -->
      <div class="mt-6">
        <button @click="goBack" class="bg-red-500 text-white p-2 rounded-md hover:bg-blue-600">
          Retour à la liste des professeurs
        </button>
      </div>
  

    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  
  // Simuler les détails des professeurs
  const professors = [
    { id: 1, name: 'Jean Dupont', subject: 'Mathématiques', bio: 'Jean est professeur depuis 15 ans...', experience: 15 },
    { id: 2, name: 'Marie Curie', subject: 'Physique', bio: 'Marie est une scientifique de renom...', experience: 10 },
    { id: 3, name: 'Albert Einstein', subject: 'Physique', bio: 'Albert a révolutionné le domaine de la physique...', experience: 20 },
    { id: 4, name: 'Sophie Germain', subject: 'Mathématiques', bio: 'Sophie est une pionnière dans le domaine des mathématiques...', experience: 12 },
    { id: 5, name: 'René Descartes', subject: 'Philosophie', bio: 'René est un philosophe et mathématicien...', experience: 30 },
  ];
  
  // Récupérer l'ID du professeur depuis l'URL
  const route = useRoute();
  const router = useRouter();
  const professorId = route.params.id;
  
  // Stocker les détails du professeur
  const professor = ref(null);
  
  // Chercher le professeur correspondant à l'ID
  onMounted(() => {
    const foundProfessor = professors.find(p => p.id === parseInt(professorId));
    if (foundProfessor) {
      professor.value = foundProfessor;
    }
  });
  
  // Méthode pour retourner à la liste des professeurs
  const goBack = () => {
    router.push({ name: 'professors' });
  };
  </script>
  
  <style scoped>
  /* Styles simples pour les détails du professeur */
  .professor-detail {
    max-width: 600px;
    margin: 0 auto;
  }
  </style>
  