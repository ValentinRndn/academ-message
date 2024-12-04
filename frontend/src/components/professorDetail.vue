<template>
  <navbar />
  <div class="back min-h-screen">
    <!-- Affichage des détails du professeur -->
    <div
      v-if="professor"
      class="professor-detail bg-gray-900 p-8 rounded-lg shadow-lg relative max-w-2xl mx-auto text-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        @click="goBack"
        class="mb-4 text-gray-400 cursor-pointer hover:text-gray-300 transition"
        width="32"
        height="32"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="m7.825 13l4.9 4.9q.3.3.288.7t-.313.7q-.3.275-.7.288t-.7-.288l-6.6-6.6q-.15-.15-.213-.325T4.426 12t.063-.375t.212-.325l6.6-6.6q.275-.275.688-.275t.712.275q.3.3.3.713t-.3.712L7.825 11H19q.425 0 .713.288T20 12t-.288.713T19 13z"
        />
      </svg>
      <h2 class="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
        {{ professor.name }}
      </h2>
      <p class="mb-2">
        <strong class="text-purple-500">Matière :</strong> {{ professor.subject }}
      </p>
      <p class="mb-2">
        <strong class="text-purple-500">Biographie :</strong> {{ professor.bio }}
      </p>


      <button
        v-if="professor && userRole !== 'professor'"
        @click="createConversation(professor._id)"
        class="absolute bottom-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition"
      >
        Contacter
      </button>
    </div>
  </div>
</template>

  
  <script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { decodeJwt } from '../services/decodeJwt';
import Navbar from './Navbar.vue';

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
    console.log('Données du professeur récupérées :', response.data); 
    professor.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du professeur:', error);
  }

  console.log('Professeur ID :', professorId);
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
  console.log('User ID:', userId); 
  console.log('Professor ID:', professorId); 

  try {
    const response = await axios.post('http://localhost:5000/api/conversations', {
      participants: [userId, professorId], // Les deux ID doivent être différents
    });

    // Rediriger vers la page de la conversation créée
    router.push({ name: 'conversations' });
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
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));


  }

  
  </style>
