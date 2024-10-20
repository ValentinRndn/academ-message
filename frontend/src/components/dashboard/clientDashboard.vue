<template>
  <div class="client-dashboard p-8 min-h-screen">
    <!-- En-tête -->
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-white">Tableau de Bord Client</h1>
      <p class="text-gray-400">Liste de toutes vos conversations avec les professeurs.</p>
    </header>

    <!-- Liste des conversations -->
    <h2 class="text-2xl font-bold text-white mb-4">Dernières conversations</h2>

    <div v-if="conversations.length > 0" class="conversation-list bg-darkgray p-4 rounded-lg">
      <div class="lasts-conversations flex gap-8">
        <div 
          class="flex flex-col justify-center items-center text-white gap-1 cursor-pointer" 
          v-for="conversation in conversations" 
          :key="conversation._id" 
          @click="goToConversation(conversation._id)"
        >
          <div class="conv">
            <img 
              :src="getProfilePicture(conversation.participants)" 
              alt="Profile Picture" 
              class="rounded-full text-white flex items-center justify-center text-center w-[8vw] shadow-md"
            >
          </div>
          <p class="text-xl font-semibold">{{ getOtherParticipantName(conversation.participants) }}</p>
        </div>
      </div>
    </div>

    <div v-else class="text-gray-500">
      <p>Vous n'avez aucune conversation pour le moment.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { decodeJwt } from '../../services/decodeJwt';
import { useRouter } from 'vue-router';

export default {
  name: "clientDashboard",
  data() {
    return {
      conversations: [], 
      userId: null,
    };
  },
  methods: {
    async getLastConversations() {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Aucun token JWT trouvé.');
        return;
      }

      try {
        const decodedToken = decodeJwt(token);
        if (!decodedToken || !decodedToken.user || !decodedToken.user.id) {
          console.error('Erreur lors du décodage du token ou userId manquant.');
          return;
        }

        this.userId = decodedToken.user.id;
        console.log(`User ID: ${this.userId}`);

        const response = await axios.get(`http://localhost:5000/api/conversations/${this.userId}`);
        this.conversations = response.data
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 3); 
      } catch (error) {
        console.error('Erreur lors de la récupération des conversations:', error);
      }
    },
    getOtherParticipant(participants) {
      return participants.find(participant => participant._id !== this.userId);
    },
    getOtherParticipantName(participants) {
      const otherParticipant = this.getOtherParticipant(participants);
      return otherParticipant ? otherParticipant.name : 'Inconnu';
    },
    getProfilePicture(participants) {
      const otherParticipant = this.getOtherParticipant(participants);
      return otherParticipant && otherParticipant.profilePicture 
        ? `http://localhost:5000/uploads/${otherParticipant.profilePicture}` 
        : '../../assets/profil/default.webp';
    },
    goToConversation(conversationId) {
      this.$router.push({ name: 'conversationDetail', params: { id: conversationId } })
        .catch(error => {
          console.error(`Erreur lors de la redirection : ${error}`);
        });
    },
    formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
  },
  mounted() {
    this.getLastConversations();
  },
};
</script>

<style scoped>
.lasts-conversations {
  display: flex;
  gap: 1rem;
}

.conv img {
  cursor: pointer;
}

.conversation-list {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 1rem;
  border-radius: 8px;
}

img {
  border-radius: 50%;
}

.text-xl {
  cursor: pointer;
}
</style>
