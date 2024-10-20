<template>
    <div class="profile-update p-8 bg-gray-100 min-h-screen">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Modifier le profil</h1>
  
      <form @submit.prevent="updateProfile">
        <!-- Champ pour le nom -->
        <div class="form-group mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700">Nom</label>
          <input
            type="text"
            id="name"
            v-model="formData.name"
            class="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>
  
        <!-- Champ pour l'email -->
        <div class="form-group mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            class="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>
  
        <!-- Champ pour le mot de passe (optionnel) -->
        <div class="form-group mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
          <input
            type="password"
            id="password"
            v-model="formData.password"
            placeholder="Laissez vide pour ne pas changer"
            class="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>
  
        <!-- Champ pour télécharger une photo de profil -->
        <div class="form-group mb-4">
          <label for="profilePicture" class="block text-sm font-medium text-gray-700">Photo de profil</label>
          <input
            type="file"
            id="profilePicture"
            @change="onFileChange"
            class="mt-1"
          />
        </div>
  
        <!-- Prévisualisation de la photo de profil -->
        <div v-if="profilePictureUrl" class="mb-4">
          <img :src="profilePictureUrl" alt="Prévisualisation" class="w-24 h-24 rounded-full" />
        </div>
  
        <!-- Bouton de mise à jour -->
        <button
          type="submit"
          class="bg-green-300 text-black px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Mettre à jour le profil
        </button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const formData = ref({
    name: '',
    email: '',
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
  /* Styles supplémentaires pour améliorer l'UI */
  </style>
  