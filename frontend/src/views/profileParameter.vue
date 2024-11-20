<template>

  <Navbar />
  <div class="p-8  min-h-screen text-white">
    <h1 class="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-8">
      Modifier le profil
    </h1>

    <form @submit.prevent="updateProfile" class="update-container p-6 rounded-lg shadow-lg max-w-xl mx-auto">
      <!-- Champ pour le nom -->
      <div class="form-group mb-6">
        <label for="name" class="block text-sm font-medium text-gray-300">Nom</label>
        <input
          type="text"
          id="name"
          v-model="formData.name"
          class="mt-2 p-3 w-full border border-gray-600 rounded-lg bg-transparent text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
      </div>

      <!-- Champ pour l'email -->
      <div class="form-group mb-6">
        <label for="email" class="block text-sm font-medium text-gray-300">Email</label>
        <input
          type="email"
          id="email"
          v-model="formData.email"
          class="mt-2 p-3 w-full border border-gray-600 rounded-lg bg-transparent text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
      </div>

      <!-- Champ pour l'ID Stripe -->
      <div class="form-group mb-6">
        <label for="idStripe" class="block text-sm font-medium text-gray-300">ID du compte Stripe</label>
        <input
          type="text"
          id="idStripe"
          v-model="formData.idstripe"
          class="mt-2 p-3 w-full border border-gray-600 rounded-lg bg-transparent text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
      </div>

      <!-- Champ pour le mot de passe (optionnel) -->
      <div class="form-group mb-6">
        <label for="password" class="block text-sm font-medium text-gray-300">Mot de passe</label>
        <input
          type="password"
          id="password"
          v-model="formData.password"
          placeholder="Laissez vide pour ne pas changer"
          class="mt-2 p-3 w-full border border-gray-600 rounded-lg bg-transparent text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
      </div>

      <!-- Champ pour télécharger une photo de profil -->
      <div class="form-group mb-6">
        <label for="profilePicture" class="block text-sm font-medium text-gray-300">Photo de profil</label>
        <input
          type="file"
          id="profilePicture"
          @change="onFileChange"
          class="mt-2 text-gray-300"
        />
      </div>

      <!-- Prévisualisation de la photo de profil -->
      <div v-if="profilePictureUrl" class="mb-6">
        <img
          :src="profilePictureUrl"
          alt="Prévisualisation"
          class="w-24 h-24 rounded-full mx-auto border-2 border-purple-500"
        />
      </div>

      <!-- Bouton de mise à jour -->
      <button
        type="submit"
        class="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg shadow-md hover:shadow-lg transition"
      >
        Mettre à jour le profil
      </button>
    </form>
  </div>
</template>

  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import Navbar from '../components/Navbar.vue';

  const formData = ref({
    name: '',
    email: '',
    idstripe: '',
    password: '',
  });
  
  const profilePicture = ref(null); // Stocker le fichier image
  const profilePictureUrl = ref(null); // URL pour la prévisualisation de l'image
  
  // Fonction pour gérer le téléchargement de l'image
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      profilePicture.value = file;
      const reader = new FileReader();
      reader.onload = (event) => {
        profilePictureUrl.value = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Charger les données actuelles de l'utilisateur
  onMounted(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      formData.value.name = response.data.name;
      FormData.value.idstripe = response.data.idstripe;
      formData.value.email = response.data.email;
      profilePictureUrl.value = response.data.profilePicture
        ? `http://localhost:5000/uploads/${response.data.profilePicture}`
        : 'default-profile.png'; // Par défaut, une image placeholder si aucune n'existe
    } catch (error) {
      console.error('Erreur lors de la récupération du profil utilisateur', error);
    }
  });
  
  // Fonction pour soumettre les modifications du profil
  const updateProfile = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.value.name);
    formDataToSend.append('email', formData.value.email);
    formDataToSend.append('idstripe', formData.value.idstripe);
    if (formData.value.password) {
      formDataToSend.append('password', formData.value.password);
    }
    if (profilePicture.value) {
      formDataToSend.append('profilePicture', profilePicture.value);
    }
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/users/updateProfile',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil', error);
      alert('Erreur lors de la mise à jour du profil');
    }
  };
  </script>
  
  <style scoped>
.update-container {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.2);

}
  </style>
  