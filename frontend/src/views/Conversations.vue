<template>
    <Navbar></Navbar>
    <div class="messenger-layout h-screen flex">
      <!-- Liste des conversations (gauche) -->
      <div class="conversations-list w-1/4 bg-gray-100 p-4 border-r border-gray-300">
        <h1 class="text-xl font-bold mb-4">Conversations</h1>
  
        <div
          v-for="conversation in conversations"
          :key="conversation.id"
          class="conversation-item p-3 mb-2 rounded-lg cursor-pointer hover:bg-gray-200"
          :class="{'bg-slate-200': selectedConversationId === conversation.id}"
          @click="selectConversation(conversation.id)"
        >
          <h3 class="font-semibold">{{ conversation.name }}</h3>
          <p class="text-sm text-gray-600">{{ conversation.lastMessage }}</p>
        </div>
      </div>
  
      <!-- Zone de la conversation sélectionnée (droite) -->
      <div class="conversation-detail w-3/4 p-4">
        <h2 class="text-xl font-bold mb-4" v-if="selectedConversation">{{ selectedConversation.name }}</h2>
  
        <div v-if="selectedConversation">
          <!-- Liste des messages -->
          <div class="messages-container mb-4">
            <div v-for="message in selectedConversation.messages" :key="message.id" class="message-item mb-2">
              <p class="text-sm"><strong>{{ message.sender }} :</strong> {{ message.text }}</p>
            </div>
          </div>
  
          <!-- Champ pour envoyer un nouveau message -->
          <div class="message-input flex">
            <input
              v-model="newMessage"
              type="text"
              placeholder="Écrivez un message..."
              class="w-full p-2 border border-gray-300 rounded-l-lg focus:outline-none"
            />
            <button @click="sendMessage" class="bg-blue-500 text-black border border-black p-2 rounded-r-lg hover:bg-blue-600">
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
  import { ref, computed } from 'vue';
  import Navbar from '../components/Navbar.vue';
  
  // Fausse liste de conversations (à remplacer par une API plus tard)
  const conversations = ref([
    {
      id: 1,
      name: 'Jean Dupont',
      lastMessage: 'Merci pour la dernière session !',
      messages: [
        { id: 1, sender: 'Jean', text: 'Merci pour la dernière session !' },
        { id: 2, sender: 'Moi', text: 'Avec plaisir !' },
      ],
    },
    {
      id: 2,
      name: 'Marie Curie',
      lastMessage: 'Je suis disponible demain pour un cours.',
      messages: [
        { id: 1, sender: 'Marie', text: 'Je suis disponible demain pour un cours.' },
        { id: 2, sender: 'Moi', text: 'Super, je note !' },
      ],
    },
    {
      id: 3,
      name: 'Albert Einstein',
      lastMessage: 'Comment se passe la préparation ?',
      messages: [
        { id: 1, sender: 'Albert', text: 'Comment se passe la préparation ?' },
        { id: 2, sender: 'Moi', text: 'Ça avance bien, merci !' },
      ],
    },
  ]);
  
  // État pour la conversation sélectionnée et le nouveau message
  const selectedConversationId = ref(null);
  const selectedConversation = computed(() =>
    conversations.value.find(convo => convo.id === selectedConversationId.value)
  );
  
  const newMessage = ref('');
  
  // Sélectionner une conversation
  const selectConversation = (conversationId) => {
    selectedConversationId.value = conversationId;
  };
  
  // Envoyer un message
  const sendMessage = () => {
    if (newMessage.value.trim() !== '' && selectedConversation.value) {
      selectedConversation.value.messages.push({
        id: Date.now(), // ID unique basé sur la date actuelle
        sender: 'Moi',
        text: newMessage.value,
      });
      newMessage.value = ''; // Réinitialiser le champ de saisie après l'envoi du message
    }
  };
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
  }
  
  .messages-container {
    flex-grow: 1;
    overflow-y: auto;
    max-height: 400px;
  }
  
  .message-input {
    margin-top: auto;
  }
  </style>
  