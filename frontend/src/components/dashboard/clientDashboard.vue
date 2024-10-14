<template>
    <div class="client-dashboard p-8 bg-gray-100 min-h-screen">
      <!-- En-tête -->
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Tableau de Bord Client</h1>
        <p class="text-gray-600">Liste de toutes vos conversations avec les professeurs.</p>
      </header>
  
      <!-- Liste des conversations -->
      <div v-if="conversations.length > 0" class="conversation-list bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-gray-700 mb-4">Conversations</h2>
  
        <table class="min-w-full bg-white">
          <thead>
            <tr>
              <th class="py-2 px-4 bg-gray-200">Professeur</th>
              <th class="py-2 px-4 bg-gray-200">Dernier message</th>
              <th class="py-2 px-4 bg-gray-200">Date</th>
              <th class="py-2 px-4 bg-gray-200">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="conversation in conversations" :key="conversation.id">
              <td class="border px-4 py-2">{{ conversation.professorName }}</td>
              <td class="border px-4 py-2">{{ conversation.lastMessage }}</td>
              <td class="border px-4 py-2">{{ formatDate(conversation.updatedAt) }}</td>
              <td class="border px-4 py-2">
                <button
                  @click="goToConversation(conversation.id)"
                  class="text-blue-500 hover:underline"
                >
                  Voir conversation
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <div v-else class="text-gray-500">
        <p>Vous n'avez aucune conversation pour le moment.</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "clientDashboard",
    data() {
      return {
        // Fausses données de conversations pour le test
        conversations: [
          {
            id: 1,
            professorName: "Professeur Jean Dupont",
            lastMessage: "Je vous attends demain pour votre cours à 10h.",
            updatedAt: "2023-10-01T10:30:00Z"
          },
          {
            id: 2,
            professorName: "Professeur Marie Durant",
            lastMessage: "Merci pour la session d'aujourd'hui, très bon travail !",
            updatedAt: "2023-09-30T15:45:00Z"
          },
          {
            id: 3,
            professorName: "Professeur Alain Petit",
            lastMessage: "Pouvons-nous déplacer le cours à jeudi ?",
            updatedAt: "2023-09-28T18:00:00Z"
          },
          {
            id: 4,
            professorName: "Professeur Sophie Martin",
            lastMessage: "N'oubliez pas de faire les exercices pour la prochaine fois.",
            updatedAt: "2023-09-27T09:00:00Z"
          }
        ],
      };
    },
    methods: {
      // Simuler la redirection vers les détails de la conversation
      goToConversation(conversationId) {
        alert(`Redirection vers les détails de la conversation ${conversationId}`);
      },
      // Formater la date pour l'afficher de manière lisible
      formatDate(dateString) {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
      },
    },
  };
  </script>
  
  <style scoped>
  .client-dashboard {
    background-color: #f7fafc;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 12px;
    text-align: left;
    border: 1px solid #ddd;
  }
  
  th {
    background-color: #f3f4f6;
  }
  
  button {
    transition: color 0.2s ease-in-out;
  }
  
  button:hover {
    color: #1d4ed8;
  }
  </style>
  