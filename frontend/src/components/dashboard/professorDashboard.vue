<template>
    <div class="professor-dashboard p-8 bg-gray-100 min-h-screen">
      <!-- En-tête -->
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Tableau de Bord Professeur</h1>
        <p class="text-gray-600">Liste de toutes vos conversations avec les clients.</p>
      </header>
  
      <!-- Liste des conversations -->
      <div v-if="conversations.length > 0" class="conversation-list bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-gray-700 mb-4">Conversations</h2>
  
        <table class="min-w-full bg-white">
          <thead>
            <tr>
              <th class="py-2 px-4 bg-gray-200">Client</th>
              <th class="py-2 px-4 bg-gray-200">Dernier message</th>
              <th class="py-2 px-4 bg-gray-200">Date</th>
              <th class="py-2 px-4 bg-gray-200">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="conversation in conversations" :key="conversation.id">
              <td class="border px-4 py-2">{{ conversation.clientName }}</td>
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
  import axios from "axios";
  
  export default {
    name: "professorDashboard",
    data() {
      return {
        conversations: [], // Stocker la liste des conversations
      };
    },
    mounted() {
      this.getConversations(); // Récupérer les conversations au montage du composant
    },
    methods: {
      // Méthode pour récupérer les conversations depuis l'API
      async getConversations() {
        try {
          const response = await axios.get("http://localhost:5000/api/professors/conversations");
          this.conversations = response.data.conversations;
        } catch (err) {
          console.error("Erreur lors de la récupération des conversations :", err);
        }
      },
      // Rediriger vers la page de détails de la conversation
      goToConversation(conversationId) {
        this.$router.push({ name: "conversationDetail", params: { id: conversationId } });
      },
      // Formater la date
      formatDate(dateString) {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
      },
    },
  };
  </script>
  
  <style scoped>
  .professor-dashboard {
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
  