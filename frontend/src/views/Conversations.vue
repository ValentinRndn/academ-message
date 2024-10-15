<template>
    <Navbar></Navbar>
    <div class="messenger-layout h-screen flex">
      <!-- Liste des conversations (gauche) -->
      <div class="conversations-list w-1/4 bg-gray-100 p-4 border-r border-gray-300">
        <h1 class="text-xl font-bold mb-4">Conversations</h1>
  
        <div
          v-for="conversation in conversations"
          :key="conversation._id"
          class="conversation-item p-3 mb-2 rounded-lg cursor-pointer hover:bg-gray-200"
          :class="{'bg-slate-200': selectedConversationId === conversation._id}"
          @click="selectConversation(conversation._id)"
        >
          <!-- Exclure l'utilisateur connecté pour afficher l'autre participant -->
          <h3 class="font-semibold">
            {{ getOtherParticipant(conversation.participants).name }}
          </h3>
          <p class="text-sm text-gray-600">{{ conversation.messages[conversation.messages.length - 1]?.text }}</p>
        </div>
      </div>
  
      <!-- Zone de la conversation sélectionnée (droite) -->
      <div class="conversation-detail w-3/4 p-4 flex flex-col">
        <h2 class="text-xl font-bold mb-4" v-if="selectedConversation">
          {{ getOtherParticipant(selectedConversation.participants).name }}
          <button
              v-if="userRole !== 'professor'"
              @click="openReservationModal"
              class="bg-green-500 text-white ml-4 px-2 py-1 rounded hover:bg-green-600"
            >
              Réserver
            </button>
        </h2>
  
        <div v-if="selectedConversation" class="flex flex-col h-full">
          <!-- Liste des messages -->
          <div class="messages-container mb-4 flex-grow overflow-y-auto">
            <div
              v-for="message in selectedConversation.messages"
              :key="message._id"
              class="message-item mb-2"
            >
              <p class="text-sm">
                <strong>{{ message.sender.name }} :</strong> {{ message.text }}
              </p>
            </div>
          </div>
  
          <!-- Champ pour envoyer un nouveau message, fixé en bas -->
          <div class="message-input flex items-center w-full border-t border-gray-300 p-2">
            <input
              v-model="newMessage"
              type="text"
              placeholder="Écrivez un message..."
              class="w-full p-2 border border-gray-300 rounded-l-lg focus:outline-none"
            />
            <button
              @click="sendMessage"
              class="bg-blue-500 text-black border border-black p-2 rounded-r-lg hover:bg-blue-600"
            >
              Envoyer
            </button>
          </div>
        </div>
  
        <!-- Message si aucune conversation n'est sélectionnée -->
        <div v-else class="text-gray-500">
          <p>Sélectionnez une conversation pour commencer à discuter.</p>
        </div>
      </div>

      <!-- Modal de réservation -->
      <div v-if="isReservationModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-6 rounded-lg w-1/2">
          <h2 class="text-2xl font-bold mb-4">Réserver un cours</h2>
          <form @submit.prevent="submitReservation">
            <div class="mb-4">
              <label class="block text-gray-700">Date</label>
              <input type="date" v-model="reservation.date" class="border p-2 w-full rounded" required />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700">Créneau horaire</label>
              <input type="time" v-model="reservation.time" class="border p-2 w-full rounded" required />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700">Coordonnées bancaires</label>
              <input type="text" v-model="reservation.paymentInfo" placeholder="Numéro de carte" class="border p-2 w-full rounded" required />
            </div>
            <div class="flex justify-end">
              <button @click="closeReservationModal" class="mr-2 bg-gray-500 text-white px-4 py-2 rounded">Annuler</button>
              <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">Confirmer la réservation</button>
            </div>
          </form>
        </div>
      </div>

    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { io } from 'socket.io-client';
  import axios from 'axios';
  import Navbar from '../components/Navbar.vue';
  import { decodeJwt } from '../services/decodeJwt'; // Assurez-vous que ce chemin est correct
  
  // Connexion au serveur Socket.IO
  const socket = io('http://localhost:5000');
  
  // Charger l'utilisateur connecté depuis le localStorage (après authentification)
  let userId;
  
  // État pour les conversations et la conversation sélectionnée
  const conversations = ref([]);
  const selectedConversationId = ref(null);
  const selectedConversation = computed(() =>
    conversations.value.find(convo => convo._id === selectedConversationId.value)
  );
  
  // État pour un nouveau message
  const newMessage = ref('');

    // État pour la réservation
    const isReservationModalOpen = ref(false);
  const reservation = ref({
    date: '',
    time: '',
    paymentInfo: ''
  });
  
  // Charger les conversations depuis MongoDB via l'API
  const loadConversations = async () => {
    const token = localStorage.getItem('token'); // Récupérer le token JWT depuis le localStorage
  
    if (!token) {
      console.error('Aucun token JWT trouvé.');
      return;
    }
  
    // Utiliser ta méthode pour décoder le token et extraire l'userId
    const decodedToken = decodeJwt(token); // Utiliser decodeJwt, pas decodeJWT
    userId = decodedToken.user.id; // Utiliser let userId défini en dehors
  
    // Log pour vérifier que l'userId est correctement extrait
    console.log('User ID extrait depuis le token JWT:', userId);
  
    if (!userId) {
      console.error('Aucun userId trouvé dans le token.');
      return;
    }
  
    try {
      const response = await axios.get(`http://localhost:5000/api/conversations/${userId}`);
      conversations.value = response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des conversations', error);
    }
  };
  
  // Sélectionner une conversation
  const selectConversation = (conversationId) => {
    selectedConversationId.value = conversationId;
    socket.emit('join-conversation', conversationId); // Rejoindre la salle de la conversation via Socket.IO
  };
  
  // Fonction pour obtenir l'autre participant (le professeur) en excluant l'utilisateur connecté
  const getOtherParticipant = (participants) => {
    return participants.find(participant => participant._id !== userId); // Exclure l'utilisateur connecté
  };
  
  // Envoyer un message
  const sendMessage = async () => {
    if (newMessage.value.trim() !== '' && selectedConversation.value) {
      const message = {
        sender: userId,
        text: newMessage.value,
      };
  
      try {
        // Envoyer le message au backend
        await axios.post(`http://localhost:5000/api/conversations/${selectedConversationId.value}/message`, {
          senderId: userId,
          text: newMessage.value,
        });
  
        // Ajouter localement le message à la conversation sélectionnée
        selectedConversation.value.messages.push({
          sender: { _id: userId, name: 'Moi' }, // Afficher 'Moi' pour l'utilisateur connecté
          text: newMessage.value,
        });
  
        // Réinitialiser le champ de saisie
        newMessage.value = '';
      } catch (error) {
        console.error('Erreur lors de l\'envoi du message', error);
      }
    }
  };

  // Fonction pour ouvrir le modal de réservation
  const openReservationModal = () => {
    isReservationModalOpen.value = true;
  };
  
  // Fonction pour fermer le modal de réservation
  const closeReservationModal = () => {
    isReservationModalOpen.value = false;
  };
  
  // Fonction pour soumettre la réservation
  const submitReservation = () => {
    alert(`Réservation confirmée pour le ${reservation.value.date} à ${reservation.value.time}`);
    closeReservationModal();
  };
  
  // Charger les conversations à l'initialisation
  onMounted(() => {
    loadConversations();
  });
  </script>
  
  <style scoped>
  /* Styles pour le layout de la page messenger */
  .messenger-layout {
    display: flex;
  }
  
  .conversations-list {
    border-right: 1px solid #e5e7eb;
  }
  
  .conversation-item {
    transition: background-color 0.2s;
  }
  
  .conversation-item:hover {
    background-color: #e2e8f0;
  }
  
  .conversation-detail {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .messages-container {
    flex-grow: 1;
    overflow-y: auto;
    max-height: calc(100vh - 150px); /* Ajuste la hauteur pour tenir compte de l'input */
  }
  
  .message-input {
    position: sticky;
    bottom: 0;
    background-color: white;
  }
  </style>