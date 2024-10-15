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
  
      <!-- Boutons -->
      <div class="mt-6 flex gap-4">
        <button @click="goBack" class="bg-red-500 text-white p-2 rounded-md hover:bg-blue-600">
          Retour à la liste des professeurs
        </button>
  
        <!-- Si l'utilisateur n'est pas un professeur, afficher le bouton de création de conversation -->
        <button
          v-if="professor && userRole !== 'professor'"
          @click="createConversation(professor._id)"
          class="bg-green-500 text-black p-2 rounded-md hover:bg-green-600"
        >
          Démarrer une conversation avec {{ professor.name }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { decodeJwt } from '../services/decodeJwt'; // Assurez-vous d'importer la fonction decodeJwt

// Récupérer l'utilisateur connecté via le token JWT
const token = localStorage.getItem('token');
let userId = null;
let userRole = null; // Ajouter une variable pour stocker le rôle de l'utilisateur

if (token) {
  const decodedToken = decodeJwt(token); // Décoder le token pour obtenir l'ID et le rôle de l'utilisateur
  userId = decodedToken?.user?.id;
  userRole = decodedToken?.user?.role; // Récupérer le rôle de l'utilisateur
  console.log('User ID récupéré depuis le token:', userId);
  console.log('User Role récupéré depuis le token:', userRole);
} else {
  console.error('Aucun token JWT trouvé.');
}

// Récupérer l'ID du professeur depuis l'URL
const route = useRoute();
const router = useRouter();
const professorId = route.params.id; // ID du professeur à partir de l'URL

// Stocker les détails du professeur
const professor = ref(null);

// Appeler l'API pour obtenir les détails du professeur
onMounted(async () => {
  try {
    const response = await axios.get(`http://localhost:5000/api/users/${professorId}`);
    professor.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du professeur:', error);
  }

  console.log("Professeur ID:" ,professorId);
});

// Méthode pour retourner à la liste des professeurs
const goBack = () => {
  router.push({ name: 'professors' });
};

// Créer une conversation entre l'utilisateur connecté et le professeur
const createConversation = async (professorId) => {
  if (!userId || !professorId) {
    alert('Utilisateur ou professeur non trouvé.');
    return;
  }

  // Ajout de logs pour confirmer les ID envoyés
  console.log('User ID:', userId); // ID de l'utilisateur connecté
  console.log('Professor ID:', professorId); // ID du professeur

  try {
    const response = await axios.post('http://localhost:5000/api/conversations', {
      participants: [userId, professorId], // Les deux ID doivent être différents
    });

    // Rediriger vers la page de la conversation créée
    router.push({ name: 'conversationDetail', params: { id: response.data._id } });
  } catch (error) {
    console.error('Erreur lors de la création de la conversation:', error);
    alert('Erreur lors de la création de la conversation');
  }
};

</script>
  
  <style scoped>
  /* Styles simples pour les détails du professeur */
  .professor-detail {
    max-width: 600px;
    margin: 0 auto;
  }
  </style>
