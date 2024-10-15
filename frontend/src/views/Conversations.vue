<template>
    <div>
      <h1>Conversations</h1>
      <ul v-if="conversations.length > 0">
        <li v-for="conversation in conversations" :key="conversation._id">
          {{ conversation.title }}
        </li>
      </ul>
      <p v-else>Aucune conversation trouvée.</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  // Récupérer l'ID de l'utilisateur connecté depuis le localStorage
  const userId = localStorage.getItem('userId'); // Assurez-vous que l'ID est bien stocké dans le localStorage
  
  const conversations = ref([]);
  const error = ref(null);
  
  // Fonction pour charger les conversations de l'utilisateur
  const loadConversations = async () => {
    if (!userId) {
      console.error('Erreur: l\'ID de l\'utilisateur est null ou non défini');
      error.value = 'Erreur: impossible de charger les conversations sans ID utilisateur';
      return;
    }
  
    try {
      console.log('Chargement des conversations pour l\'utilisateur avec ID:', userId);
      const response = await axios.get(`http://localhost:5000/api/conversations/${userId}`);
      conversations.value = response.data;
    } catch (err) {
      console.error('Erreur lors du chargement des conversations', err);
      error.value = 'Erreur lors du chargement des conversations';
    }
  };
  
  // Appel de la fonction de chargement des conversations lorsque le composant est monté
  onMounted(loadConversations);
  </script>
  