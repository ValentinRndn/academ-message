<template>
  <Navbar></Navbar>
  <div class="messenger-layout h-screen flex bg-darkgray text-white">
    <!-- Liste des conversations (gauche) -->
    <div class="conversations-list w-1/4 bg-darkgray p-4 border-r border-gray-800">
      <h1 class="text-xl font-bold mb-4">Conversations</h1>

      <div
        v-for="conversation in conversations"
        :key="conversation._id"
        class="conversation-item p-3 mb-2 rounded-lg cursor-pointer hover:bg-lightgray"
        :class="{'bg-lightgray': selectedConversationId === conversation._id}"
        @click="selectConversation(conversation._id)"
      >
        <!-- Exclure l'utilisateur connecté pour afficher l'autre participant -->
        <h3 class="font-semibold">
          {{ getOtherParticipant(conversation.participants).name }}
        </h3>
        <p class="text-sm text-gray-">{{ conversation.messages[conversation.messages.length - 1]?.text }}</p>
      </div>
    </div>

    <!-- Zone de la conversation sélectionnée (droite) -->
    <div class="conversation-detail w-3/4 p-4 flex flex-col">
      <h2 class="text-xl font-bold mb-4" v-if="selectedConversation">
        {{ getOtherParticipant(selectedConversation.participants).name }}
        <button
          v-if="userRole !== 'professor'"
          @click="openBookingModal"
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
            :class="{'message-left': message.sender._id !== userId, 'message-right': message.sender._id === userId}"
            class="message-item mb-2 flex items-start"
          >
            <!-- Affichage de la photo de profil à gauche pour les messages du destinataire -->
            <img
              v-if="message.sender._id !== userId"
              :src="message.sender.profilePicture || 'default-profile-pic-url.jpg'"
              alt="Profile"
              class="w-8 h-8 rounded-full mr-2"
            />
            <p
              :class="{'bg-lightgray text-white p-2 rounded-md': message.sender._id !== userId, 'gradient text-white p-2 rounded-md ml-auto': message.sender._id === userId}"
              class="message-text"
            >
              {{ message.text }}
            </p>
          </div>
        </div>

        <!-- Champ pour envoyer un nouveau message, fixé en bas -->
        <div class="message-input flex items-center w-full border-t border-gray-300 p-2 sticky bottom-0">
          <input
            v-model="newMessage"
            type="text"
            placeholder="Écrivez un message..."
            class="w-full p-2 bg-lightgray"
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
let userId = null;
const userRole = ref(''); // Ajoutez userRole ici

// État pour les conversations et la conversation sélectionnée
const conversations = ref([]);
const selectedConversationId = ref(null);
const selectedConversation = computed(() =>
  conversations.value.find(convo => convo._id === selectedConversationId.value)
);

// État pour un nouveau message
const newMessage = ref('');

// Charger les conversations depuis MongoDB via l'API
const loadConversations = async () => {
  const token = localStorage.getItem('token'); // Récupérer le token JWT depuis le localStorage

  if (!token) {
    console.error('Aucun token JWT trouvé.');
    return;
  }

  // Utiliser ta méthode pour décoder le token et extraire l'userId
  const decodedToken = decodeJwt(token); 
  userId = decodedToken.user.id; // Utiliser let userId défini en dehors
  userRole.value = decodedToken.user.role; // Extraire le rôle de l'utilisateur depuis le token

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
const openBookingModal = () => {
  isBookingModalOpen.value = true;
};

// Fonction pour fermer le modal de réservation
const closeBookingModal = () => {
  isBookingModalOpen.value = false;
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

.message-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.message-left {
  justify-content: flex-start;
}

.message-right {
  justify-content: flex-end;
}

.message-text {
  max-width: 70%;
  word-wrap: break-word;
}

img {
  margin-right: 0.5rem;
}
</style>
