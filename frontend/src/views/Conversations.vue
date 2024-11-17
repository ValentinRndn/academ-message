<template>
  <Navbar></Navbar>
  <div class="messenger-layout h-full flex  text-white m-4 gap-4 md:flex-col ">


    <!-- Liste des conversations (gauche) -->
    <div class="conversations-list w-1/4 bg-darkgray p-4 rounded-lg h-[89.5vh]">
      <div class="top-conversations-list-container flex items-begin justify-between h-fit">
        <h1 class="text-3xl font-bold mb-4 textGradient">Conversations</h1>
        <router-link to="professors">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" alt="Trouver un professeur" class="cursor-pointer hover:text-purplee" viewBox="0 0 21 21">
            <g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 4.5H5.5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V11"/>
              <path d="M17.5 3.467a1.46 1.46 0 0 1-.017 2.05L10.5 12.5l-3 1l1-3l6.987-7.046a1.41 1.41 0 0 1 1.885-.104zm-2 2.033l.953 1"/>
            </g>
          </svg>
        </router-link>
      </div>
      <div
        v-for="conversation in sortedConversations"
        :key="conversation._id"
        class="conversation-item p-3 mb-2 rounded-lg cursor-pointer hover:bg-lightgray"
        :class="{'bg-lightgray': selectedConversationId === conversation._id}"
        @click="selectConversation(conversation._id)"
      >
        <div class="flex items-center gap-3">
          <img
            :src="getOtherParticipant(conversation.participants)?.profilePicture ? `http://localhost:5000/uploads/${getOtherParticipant(conversation.participants).profilePicture}` : '/path/to/default-profile-pic.jpg'"
            alt="Profile"
            class="w-8 h-8 rounded-full"
          />
          <h3 class="font-semibold">
            {{ getOtherParticipant(conversation.participants).name }}
          </h3>
        </div>
        <p class="text-sm text-gray-300">{{ conversation.messages[conversation.messages.length - 1]?.text }}</p>
      </div>
    </div>

    <!-- Zone de la conversation sélectionnée (droite) -->
    <div class="conversation-detail w-3/4 p-4 flex flex-col bg-darkgray rounded-lg h-[89.5vh]">
      <div v-if="selectedConversation" class="flex items-center gap-3 mb-4">
        <img
          :src="getOtherParticipant(selectedConversation.participants)?.profilePicture ? `http://localhost:5000/uploads/${getOtherParticipant(selectedConversation.participants).profilePicture}` : '/path/to/default-profile-pic.jpg'"
          alt="Profile"
          class="w-10 h-10 rounded-full"
        />
        <h2 class="text-xl font-bold">
          {{ getOtherParticipant(selectedConversation.participants).name }}
        </h2>
        <button
          v-if="userRole !== 'professor'"
          @click="openBookingModal"
          class="gradient text-white ml-4 px-2 py-1 rounded"
        >
          Réserver
        </button>
      </div>

      <div v-if="selectedConversation" class="flex flex-col h-[89.5vh] ">
        <div class="messages-container mb-4 overflow-y-auto">
          <div
            v-for="message in selectedConversation.messages"
            :key="message._id"
            :class="{'message-left': message.sender._id !== userId, 'message-right': message.sender._id === userId}"
            class="message-item mb-2 flex items-start"
          >
            <img
              v-if="message.sender._id !== userId"
              :src="message.sender.profilePicture ? `http://localhost:5000/uploads/${message.sender.profilePicture}` : '/path/to/default-profile-pic.jpg'"
              alt="Profile"
              class="w-8 h-8 rounded-full mr-2"
            />
            <p
              :class="{'bg-lightgray text-white p-2 rounded-md': message.sender._id !== userId, 'gradient text-white p-2 rounded-lg ml-auto': message.sender._id === userId}"
              class="message-text"
            >
              {{ message.text }}
            </p>
          </div>
        </div>

        <div class="message-input flex items-center sticky bottom-2">
          <input
            v-model="newMessage"
            type="text"
            placeholder="Aa"
            class="w-full p-1 bg-lightgray"
          />
          <svg xmlns="http://www.w3.org/2000/svg" @click="sendMessage" class="ml-4 cursor-pointer hover:text-purplee" width="35" height="35" viewBox="0 0 24 24">
            <path fill="currentColor" d="M21.243 12.437a.5.5 0 0 0 0-.874l-2.282-1.268A75.5 75.5 0 0 0 4.813 4.231l-.665-.208A.5.5 0 0 0 3.5 4.5v5.75a.5.5 0 0 0 .474.5l1.01.053a44.4 44.4 0 0 1 7.314.998l.238.053c.053.011.076.033.089.05a.16.16 0 0 1 .029.096c0 .04-.013.074-.029.096c-.013.017-.036.039-.089.05l-.238.053a44.5 44.5 0 0 1-7.315.999l-1.01.053a.5.5 0 0 0-.473.499v5.75a.5.5 0 0 0 .65.477l.664-.208a75.5 75.5 0 0 0 14.147-6.064z"/>
          </svg>
        </div>
      </div>

      <div v-else class="text-gray-500">
        <p>Sélectionnez une conversation pour commencer à discuter.</p>
      </div>
    </div>
    <!-- Modale de réservation avec Stripe -->
    <div v-if="isBookingModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white text-black p-6 rounded-lg w-96">
        <h2 class="text-xl font-bold mb-4">Réserver une session</h2>
        <label class="block mb-2">Date:</label>
        <input type="date" v-model="bookingDate" class="w-full p-2 mb-4 border rounded-md" />
        
        <label class="block mb-2">Heure:</label>
        <select v-model="bookingTime" class="w-full p-2 mb-4 border rounded-md">
          <option v-for="time in availableTimes" :key="time" :value="time">{{ time }}</option>
        </select>

        <!-- Input pour le montant -->
        <label class="block mb-2">Montant (€):</label>
        <input 
  type="number" 
  v-model.number="totalAmount" 
  class="w-full p-2 mb-4 border rounded-md" 
  min="1" 
  placeholder="Entrer le montant"
/>





        <!-- Stripe Elements pour la saisie des informations bancaires -->
        <label class="block mb-2">Coordonnées bancaires:</label>
        <div id="card-element" class="w-full p-2 mb-4 border rounded-md bg-lightgray"></div>
        
        <div class="flex justify-end space-x-4">
          <button @click="closeBookingModal" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Annuler</button>
          <button @click="confirmBooking" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Confirmer</button>
        </div>
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

const userRole = ref('');
const conversations = ref([]);
const newMessage = ref(''); // Ajoutez cette ligne pour définir newMessage
const selectedConversationId = ref(null);
const isBookingModalOpen = ref(false);
const bookingDate = ref('');
const bookingTime = ref('');
const totalAmount = ref(0); // Initialisez avec une valeur par défaut

const professorStripeAccountId = 'acct_1QKhSjELvCyE3pew';
let userId = null;
const availableTimes = ref([...Array(24).keys()].flatMap(h => [`${String(h).padStart(2, '0')}:00`, `${String(h).padStart(2, '0')}:30`]));

const sortedConversations = computed(() => conversations.value.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
const selectedConversation = computed(() => conversations.value.find(convo => convo._id === selectedConversationId.value));
const isConfirmationModalOpen = ref(false);
const selectedProfessor = ref(null); 

const loadConversations = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  const decodedToken = decodeJwt(token); 
  userId = decodedToken.user.id;
  userRole.value = decodedToken.user.role;

  try {
    const response = await axios.get(`http://localhost:5000/api/conversations/${userId}`);
    conversations.value = response.data;

    // Sélectionner la conversation la plus récente par défaut
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
        // Définir le professeur sélectionné en fonction de la conversation
        selectedProfessor.value = getOtherParticipant(conversation.participants);
    }

    socket.emit('join-conversation', conversationId);
};
const getOtherParticipant = (participants) => {
  return participants.find(participant => participant._id !== userId);
};

const sendMessage = async () => {
  if (newMessage.value.trim() !== '' && selectedConversation.value) {
    const message = {
      sender: userId,
      text: newMessage.value,
    };
    try {
      await axios.post(`http://localhost:5000/api/conversations/${selectedConversationId.value}/message`, {
        senderId: userId,
        text: newMessage.value,
      });
      selectedConversation.value.messages.push({
        sender: { _id: userId, name: 'Moi' },
        text: newMessage.value,
      });
      newMessage.value = '';
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message', error);
    }
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
    // Valider la valeur de totalAmount
    console.log('Valeur actuelle de totalAmount :', totalAmount.value);
if (!totalAmount.value || isNaN(totalAmount.value) || totalAmount.value <= 0) {
  alert('Veuillez entrer un montant valide.');
  return;
}


    const payload = {
      bookingDate: bookingDate.value,
      bookingTime: bookingTime.value,
      amount: Math.round(totalAmount.value * 100), // Convertir en centimes
      currency: 'eur',
      professorStripeAccountId,
    };

    console.log('Payload envoyé au backend :', payload);

    const response = await axios.post('http://localhost:5000/api/booking/schedule-payment', payload);

    console.log('Réponse du backend :', response.data);

    // Succès
    alert(response.data.message);
  } catch (error) {
    console.error('Erreur lors de la réservation :', error.response?.data || error.message);
    alert('Erreur lors de la réservation. Consultez la console pour plus de détails.');
  }
};




const closeBookingModal = () => {
    isBookingModalOpen.value = false;
};


onMounted(loadConversations);
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
</style>
