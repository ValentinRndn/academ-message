<template>
  <Navbar />
  <div class="messenger-layout h-full flex text-white m-4 gap-4 md:flex-col">
    <!-- Liste des conversations (gauche) -->
    <div class="conversations-list w-1/4  p-4 rounded-lg h-[89.5vh] shadow-lg">
      <div class="top-conversations-list-container flex items-center justify-between h-fit mb-4">
        <h1 class="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Conversations
        </h1>
        <router-link to="professors">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" class="cursor-pointer text-gray-300 hover:text-purple-500 transition" viewBox="0 0 21 21">
            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 4.5H5.5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V11" />
              <path d="M17.5 3.467a1.46 1.46 0 0 1-.017 2.05L10.5 12.5l-3 1l1-3l6.987-7.046a1.41 1.41 0 0 1 1.885-.104zm-2 2.033l.953 1" />
            </g>
          </svg>
        </router-link>
      </div>
      <div
        v-for="conversation in sortedConversations"
        :key="conversation?._id"
        class="conversation-item p-3 mb-3 rounded-lg cursor-pointer back hover:bg-gray-700 transition"
        :class="{ 'bg-gray-700': selectedConversationId === conversation._id }"
        @click="selectConversation(conversation._id)"
      >
        <div class="flex items-center gap-3">
          <img
            :src="getOtherParticipant(conversation?.participants)?.profilePicture ? `http://localhost:5000/uploads/${getOtherParticipant(conversation.participants).profilePicture}` : '../../assets/profil/default.webp'"
            alt="Profile"
            class="w-10 h-10 rounded-full border border-gray-600"
          />
          <h3 class="font-semibold text-white">
            {{ getOtherParticipant(conversation?.participants).name }}
          </h3>
        </div>
        <p class="text-sm text-gray-400 truncate">{{ conversation?.messages?.[conversation?.messages?.length - 1]?.text }}</p>
      </div>
    </div>

    <!-- Zone de la conversation sélectionnée (droite) -->
    <div class="conversation-detail w-3/4 rounded-lg h-[89.5vh] shadow-lg flex flex-col">
      <div v-if="selectedConversation" class="flex items-center gap-3 p-4 border-b border-gray-700">
        <img
          :src="getOtherParticipant(selectedConversation?.participants)?.profilePicture ? `http://localhost:5000/uploads/${getOtherParticipant(selectedConversation?.participants).profilePicture}` : '../../assets/profil/default.webp'"
          alt="Profile"
          class="w-12 h-12 rounded-full border border-gray-600"
        />
        <h2 class="text-lg font-bold text-white">
          {{ getOtherParticipant(selectedConversation?.participants).name }}
        </h2>
        <button
          v-if="selectedConversation && selectedConversation.messages.length >= 15 && userRole !== 'professor'"
          @click="openBookingModal"
          class="ml-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition"
        >
          Réserver
        </button>
      </div>

      <div v-if="selectedConversation" class="flex-1 flex flex-col h-full">
        <div class="messages-container flex-1 overflow-y-auto p-4 space-y-4">
          <div
            v-for="message in selectedConversation?.messages"
            :key="message._id"
            :class="{ 'justify-start': message.sender?._id !== userId, 'justify-end': message.sender?._id === userId }"
            class="flex items-center space-x-3"
          >
            <img
              v-if="message.sender?._id !== userId"
              :src="message.sender?.profilePicture ? `http://localhost:5000/uploads/${message.sender?.profilePicture}` : '../../assets/profil/default.webp'"
              alt="Profile"
              class="w-8 h-8 rounded-full border border-gray-600"
            />
            <p
              :class="{
                'back text-white p-3 rounded-lg': message.sender?._id !== userId,
                'bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-lg': message.sender?._id === userId
              }"
              class="max-w-md"
            >
              {{ message?.text }}
            </p>
          </div>
        </div>

        <div class="message-input flex items-center gap-4 p-4">
          <input
            v-model="newMessage"
            type="text"
            placeholder="Aa"
            class="flex-1 back text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-500"
            @input="notifyTyping"
            @blur="stopTyping"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            @click="sendMessage"
            class="cursor-pointer text-gray-400 hover:text-purple-500 transition"
            width="35"
            height="35"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M21.243 12.437a.5.5 0 0 0 0-.874l-2.282-1.268A75.5 75.5 0 0 0 4.813 4.231l-.665-.208A.5.5 0 0 0 3.5 4.5v5.75a.5.5 0 0 0 .474.5l1.01.053a44.4 44.4 0 0 1 7.314.998l.238.053c.053.011.076.033.089.05a.16.16 0 0 1 .029.096c0 .04-.013.074-.029.096c-.013.017-.036.039-.089.05l-.238.053a44.5 44.5 0 0 1-7.315.999l-1.01.053a.5.5 0 0 0-.473.499v5.75a.5.5 0 0 0 .65.477l.664-.208a75.5 75.5 0 0 0 14.147-6.064z"
            />
          </svg>
        </div>
      </div>

      <div v-else class="flex-1 flex items-center justify-center text-gray-400">
        <p>Sélectionnez une conversation pour commencer à discuter.</p>
      </div>
    </div>
  </div>
</template>


<script setup>
import { loadStripe } from '@stripe/stripe-js';
import { ref, computed, onMounted } from 'vue';
import { io } from 'socket.io-client';
import axios from 'axios';
import Navbar from '../components/Navbar.vue';
import { decodeJwt } from '../services/decodeJwt'; 

const socket = io('http://localhost:5000');
const stripePromise = loadStripe('pk_test_51LmhGsHQanXHoJn0wBK5v2yQyHFdQ4KlSXSXZobDhxFPCrhVwWtCwWXvNIxjOQdi65riR24NEgQyY6Ck1UZkPqq800jtbOgNU8');
let clientSecret = null;
let elements;
const isTyping = ref(false);
const userRole = ref('');
const conversations = ref([]);
const newMessage = ref(''); 
const selectedConversationId = ref(null);
const isBookingModalOpen = ref(false);
const bookingDate = ref('');
const bookingTime = ref('');
const totalAmount = ref(0); 

const professorStripeAccountId = ref('');

let userId = null;
const availableTimes = ref([...Array(24).keys()].flatMap(h => [`${String(h).padStart(2, '0')}:00`, `${String(h).padStart(2, '0')}:30`]));

const sortedConversations = computed(() => conversations.value.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
const selectedConversation = computed(() => conversations.value.find(convo => convo._id === selectedConversationId.value));
const selectedProfessor = ref(null); 

const loadConversations = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  const decodedToken = decodeJwt(token); 
  userId = decodedToken.user.id;
  userRole.value = decodedToken.user.role;

  try {
    const response = await axios.get(`http://localhost:5000/api/conversations/${userId}`);
    console.log('Conversations récupérées :', response.data);

    conversations.value = response.data.map(conversation => {
      if (conversation.messages) {
        // Filtrer les doublons
        const uniqueMessages = conversation.messages.reduce((unique, msg) => {
          if (!unique.some(existingMsg =>
            existingMsg.text === msg.text &&
            existingMsg.sender?._id === msg.sender?._id &&
            existingMsg.createdAt === msg.createdAt)) {
            unique.push(msg);
          }
          return unique;
        }, []);
        conversation.messages = uniqueMessages;
      }
      return conversation;
    });

    if (sortedConversations.value.length > 0) {
      selectConversation(sortedConversations.value[0]._id);
    }
  } catch (error) {
    console.error('Erreur lors du chargement des conversations', error);
  }
};







const selectConversation = (conversationId) => {
  selectedConversationId.value = conversationId;
  const conversation = conversations.value.find((convo) => convo._id === conversationId);

  if (conversation) {
    // Récupérer l'autre participant
    const otherParticipant = getOtherParticipant(conversation.participants);

    if (otherParticipant) {
      // Définir le professeur sélectionné et récupérer l'id Stripe
      selectedProfessor.value = otherParticipant;
      professorStripeAccountId.value = otherParticipant.stripeAccountId; 
      console.log('ID Stripe du professeur sélectionné :', professorStripeAccountId.value);
    }
  }

  socket.emit('join-conversation', conversationId);
};


const getOtherParticipant = (participants) => {
  return participants.find(participant => participant._id !== userId);
};


const sendMessage = async () => {
  if (newMessage.value.trim() === '' || !selectedConversation.value) {
    return;
  }

  const messageText = newMessage.value.trim();
  newMessage.value = ''; // Réinitialiser le champ d'entrée

  try {
    const response = await axios.post(
      `http://localhost:5000/api/conversations/${selectedConversationId.value}/message`,
      { senderId: userId, text: messageText }
    );

    const newMessage = response.data;

    if (!selectedConversation.value.messages.some(msg => msg._id === newMessage._id)) {
      selectedConversation.value.messages.push(newMessage);
    }

    socket.emit('new-message', {
      conversationId: selectedConversationId.value,
      message: newMessage,
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi du message', error);
    alert('Erreur lors de l\'envoi du message. Veuillez réessayer.');
  }
};







const openBookingModal = async () => {
  try {
    const stripe = await stripePromise;

    // Afficher la modale
    isBookingModalOpen.value = true;

    // Attendre que la modale soit rendue avant de monter les éléments
    setTimeout(() => {
      if (!elements) {
        elements = stripe.elements();
      }

      // Vérifiez si le champ est déjà monté pour éviter les doublons
      if (!document.getElementById('card-element').children.length) {
        const cardElement = elements.create('card');
        cardElement.mount('#card-element');
      }
    }, 100); // Délai pour s'assurer que le DOM est mis à jour
  } catch (error) {
    console.error('Erreur lors de l\'ouverture de la modale de paiement :', error);
  }
};


const confirmBooking = async () => {
  try {
    console.log('Valeur actuelle de totalAmount :', totalAmount.value);

    if (!totalAmount.value || isNaN(totalAmount.value) || totalAmount.value <= 0) {
      alert('Veuillez entrer un montant valide.');
      return;
    }

    const payload = {
      bookingDate: bookingDate.value,
      bookingTime: bookingTime.value,
      amount: Math.round(totalAmount.value * 100),
      currency: 'eur',
      professorStripeAccountId: professorStripeAccountId.value, // Utilisez `.value`
    };


    const response = await axios.post('http://localhost:5000/api/booking/schedule-payment', payload);

    alert(response.data.message);
  } catch (error) {
    console.error('Erreur lors de la réservation :', error.response?.data || error.message);
    alert('Erreur lors de la réservation. Consultez la console pour plus de détails.');
  }
};

const closeBookingModal = () => {
    isBookingModalOpen.value = false;
};


const notifyTyping = () => {
  if (selectedConversationId.value) {
    socket.emit('typing', {
      conversationId: selectedConversationId.value,
      userId,
    });
  }
};

const stopTyping = () => {
  if (selectedConversationId.value) {
    socket.emit('stop-typing', {
      conversationId: selectedConversationId.value,
      userId,
    });
  }
};



onMounted(() => {
  loadConversations();

  socket.on('user-typing', (typingUserId) => {
    if (typingUserId !== userId) {
      isTyping.value = true;
    }
  });

  socket.on('user-stopped-typing', (typingUserId) => {
    if (typingUserId !== userId) {
      isTyping.value = false;
    }
  });

  socket.on('message-received', ({ conversationId, message }) => {
  const conversation = conversations.value.find(convo => convo._id === conversationId);
  if (conversation) {
    if (!conversation.messages.some(msg => msg._id === message._id)) {
      conversation.messages.push(message);
    }
  }
});







});

</script>

<style scoped>
.messenger-layout {
  display: flex;
}
.conversation-item {
  transition: background-color 0.2s;
}
.messages-container {
  flex-grow: 1;
  overflow-y: auto;
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
.modal {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 400px;
}

.conversations-list, .conversation-detail {
  background: linear-gradient(135deg, #1e1e2f 0%, #302b63 50%, #24243e 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);

}


</style>
