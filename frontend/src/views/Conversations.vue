<template>
  <Navbar />
  <div class="messenger-layout h-full flex text-white overflow-y-hidden mt-4 mx-4 gap-4 md:flex-col">
    <!-- Liste des conversations (gauche) -->
    <div class="conversations-list w-1/4  p-4 rounded-lg h-[89.5vh]  shadow-lg md:w-full md:h-fit md:max-h-[50vh] overflow-y-auto">
      <div class="top-conversations-list-container flex items-center justify-between h-fit mb-4">
        <h1 class="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Conversations
        </h1>
        <router-link v-if="userRole != 'professor'" to="professors" >
          
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
        class="conversation-item p-3 mb-3 rounded-lg cursor-pointer back hover:bg-darkblue transition"
        :class="{ 'bg-gray-700': selectedConversationId === conversation._id }"
        @click="selectConversation(conversation._id)"
      >


        <div class="flex items-center gap-3">
          <img
            :src="getOtherParticipant(conversation?.participants)?.profilePicture ? `${apiUrl}/uploads/${getOtherParticipant(conversation.participants).profilePicture}` : '../../assets/profil/default.webp'"
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
    <div ref="messagesContainer" class="conversation-detail w-3/4 rounded-lg relative h-[89.5vh] shadow-lg flex flex-col md:w-full">
      <div v-if="selectedConversation" class="top-conversation-detail flex sticky top-0 items-center gap-3 p-4 border-b border-gray-700">
        <img
          :src="getOtherParticipant(selectedConversation?.participants)?.profilePicture ? `${apiUrl}/uploads/${getOtherParticipant(selectedConversation?.participants).profilePicture}` : '../../assets/profil/default.webp'"
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
        <div  class="messages-container flex-1 p-4 space-y-4">
          <div
            v-for="message in selectedConversation?.messages"
            :key="message._id"
            :class="{ 'justify-start': message.sender?._id !== userId, 'justify-end': message.sender?._id === userId }"
            class="flex items-center space-x-3"
          >
            <img
              v-if="message.sender?._id !== userId"
              :src="message.sender?.profilePicture ? `${apiUrl}/uploads/${message.sender?.profilePicture}` : '../../assets/profil/default.webp'"
              alt="Profile"
              class="w-8 h-8 rounded-full border border-gray-600"
            />
            <p
              :class="{
                'back text-white p-3 rounded-lg': message.sender?._id !== userId,
                'bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-lg': message.sender?._id === userId
              }"
              class="max-w-md break-words"
            >
              {{ message?.text }}
            </p>

          </div>
        </div>
        <div v-if="isTyping && selectedConversationId" class="typing-indicator text-gray-400 italic ml-5 flex items-end">
        L'autre utilisateur est en train d'écrire
        <svg xmlns="http://www.w3.org/2000/svg" class="text-gray-400 p  t-1" width="20" height="20" viewBox="0 0 24 24"><circle cx="18" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin=".67" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin=".33" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="6" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin="0" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle></svg>
      </div>
        <div class="message-input flex items-center gap-4 p-4 ">
          <input
            v-model="newMessage"
            type="text"
            placeholder="Aa"
            class="flex-1 back text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-500 mb-0"
            @input="notifyTyping"
            @blur="stopTyping"
            @keydown.enter="sendMessage"
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


    
        <!-- Modale de réservation avec Stripe -->
        <div v-if="isBookingModalOpen" class="fixed inset-0  backdrop-blur-sm  flex justify-center items-center z-50">
      <div class="modal-container border border-bordergray shadow-xl text-white p-6 rounded-lg w-96">
        <h2 class="text-xl font-bold mb-4">Réserver une session</h2>
        <p class="mb-4 text-gray-300">Le paiement s'effectuera automatiquement une heure après le début du cours.</p>
        <label class="block mb-2">Date:</label>
        <input type="date" v-model="bookingDate" class="w-full p-2 mb-4 border rounded-md" />
        
        <label class="block mb-2">Heure:</label>
        <div class="custom-select">
          <!-- Zone pour afficher l'option sélectionnée -->
          <div class="selected-option  cursor-pointer" @click="toggleDropdown">
            {{ bookingTime || "Sélectionnez une heure" }}
          </div>

          <!-- Liste des options -->
          <ul
            v-if="isDropdownOpen"
            class="options-list -mt-[1.2rem] bg-darkgray shadow-lg max-h-48 overflow-y-auto "
          >
            <li
              class="option p-2 hover:bg-gray cursor-pointer"
              v-for="time in availableTimes"
              :key="time"
              @click="selectTime(time)"
            >
              {{ time }}
            </li>
          </ul>
        </div>

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
        <label class="block mb-2 text-white">Coordonnées bancaires:</label>
      <div id="card-element" class="text-white mb-4"></div>

        
        <div class="flex justify-end space-x-4">
          <button @click="closeBookingModal" class="px-4 py-2 bg-gray-700 rounded hover:bg-gray-900">Annuler</button>
          <button @click="confirmBooking" class="ml-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition">Confirmer</button>
        </div>
      </div>
    </div>
  </div>

  
</template>


<script setup>
import { loadStripe } from '@stripe/stripe-js';
import { ref, computed, onMounted, watch, onUpdated  } from 'vue';
import { io } from 'socket.io-client';
import axios from 'axios';
import Navbar from '../components/Navbar.vue';
import { decodeJwt } from '../services/decodeJwt'; 

const apiUrl = import.meta.env.VITE_API_URL;
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;


const socket = io(apiUrl);
const stripePromise = loadStripe(stripePublicKey);
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
let isSendingMessage = false;
const professorStripeAccountId = ref('');

// Définir les styles pour l'input de Stripe
const style = {
  base: {
    color: '#ffffff',  // Couleur du texte blanche
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSize: '16px',
    '::placeholder': {
      color: '#d1d1d1',  // Couleur du placeholder (si vous le souhaitez)
    },
  },
  invalid: {
    color: 'red',
    iconColor: 'red',
  },
};


const isDropdownOpen = ref(false);
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const selectTime = (time) => {
  bookingTime.value = time;
  isDropdownOpen.value = false; 
};

let userId = null;
const availableTimes = ref([...Array(24).keys()].flatMap(h => [`${String(h).padStart(2, '0')}:00`, `${String(h).padStart(2, '0')}:30`]));

const sortedConversations = computed(() => conversations.value.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
const selectedConversation = computed(() => conversations.value.find(convo => convo._id === selectedConversationId.value));
const selectedProfessor = ref(null); 
const messagesContainer = ref(null);


const scrollToBottom = () => {
  const container = messagesContainer.value;
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
};

const loadConversations = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  const decodedToken = decodeJwt(token); 
  userId = decodedToken.user.id;
  userRole.value = decodedToken.user.role;

  try {
    const response = await axios.get(`${apiUrl}/api/conversations/${userId}`);

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
    }
  }

  socket.emit('join-conversation', conversationId);
};


const getOtherParticipant = (participants) => {
  return participants.find(participant => participant._id !== userId);
};


const sendMessage = async () => {
  if (newMessage.value.trim() === '' || !selectedConversation.value || isSendingMessage) {
    return;
  }


  isSendingMessage = true;
  const messageText = newMessage.value.trim();
  newMessage.value = '';

  try {
    // Envoyer le message à l'API
    const response = await axios.post(
      `${apiUrl}/api/conversations/${selectedConversationId.value}/message`,
      { senderId: userId, text: messageText }
    );

    const newMessage = response.data;

    // Afficher localement le message envoyé
    if (!selectedConversation.value.messages.some(msg => msg._id === newMessage._id)) {
      selectedConversation.value.messages.push(newMessage);
    }

    // Émettre l'événement Socket.IO pour informer les autres clients
    socket.emit('new-message', {
      conversationId: selectedConversationId.value,
      message: newMessage,
    });

    scrollToBottom();

  } catch (error) {
    console.error('Erreur lors de l\'envoi du message', error);
  } finally {
    isSendingMessage = false;
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
        // Correction ici : utilisez la bonne syntaxe pour créer l'élément card
        const cardElement = elements.create('card', {
          style: style
        });
        cardElement.mount('#card-element');
      }
    }, 100); // Délai pour s'assurer que le DOM est mis à jour
  } catch (error) {
    console.error('Erreur lors de l\'ouverture de la modale de paiement :', error);
  }
};


const confirmBooking = async () => {
  try {

    if (!totalAmount.value || isNaN(totalAmount.value) || totalAmount.value <= 0) {
      alert('Veuillez entrer un montant valide.');
      return;
    }

    const payload = {
      bookingDate: bookingDate.value,
      bookingTime: bookingTime.value,
      amount: Math.round(totalAmount.value * 100),
      currency: 'eur',
      professorStripeAccountId: professorStripeAccountId.value, 
    };


    const response = await axios.post(`${apiUrl}/api/booking/schedule-payment`, payload);

    alert(response.data.message);
    closeBookingModal();
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
  scrollToBottom();

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

// Défilement lorsque les messages ou la conversation changent
watch([selectedConversationId, conversations], () => {
  scrollToBottom();
});

onUpdated(() => {
  scrollToBottom();
});

</script>

<style scoped>
.custom-select {
  position: relative;
}

.options-list {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 10;
}



.modal-container {
  background: linear-gradient(135deg, #1e1e2f 0%, #302b63 50%, #24243e 100%);
}
.messenger-layout {
  display: flex;
}
.conversation-item {
  transition: background-color 0.2s;
}
.conversation-detail  {
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
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

.conversations-list, .conversation-detail {
  background: linear-gradient(135deg, #1e1e2f 0%, #302b63 50%, #24243e 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);

}

.conversation-detail {
  display: flex;
  flex-direction: column;
}


.message-input {
  position: sticky;
  bottom: 0;
  background: linear-gradient(135deg, #1e1e2f 0%, #302b63 50%, #24243e 100%);
  padding: 1rem;
  z-index: 10; 
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.top-conversation-detail, .custom-select {
  background: linear-gradient(135deg, #1e1e2f 0%, #302b63 50%, #24243e 100%);
}

</style>
