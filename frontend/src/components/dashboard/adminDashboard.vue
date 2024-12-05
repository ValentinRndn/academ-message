<template>
  <div class="admin-dashboard p-8 min-h-screen text-white">
    <!-- En-tête -->
    <header class="mb-8">
      <h1 class="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Tableau de Bord Administrateur
      </h1>
      <p class="text-gray-400">Vision d'ensemble et gestion des professeurs.</p>
    </header>

    <!-- Conteneur principal en deux colonnes -->
    <div class="dashboard-content grid grid-cols-2 gap-8 md:grid-cols-1">
      <!-- Statistiques générales -->
      <div class="stats bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
          Statistiques
        </h2>
        <div class="stat-item mb-4">
          <h3 class="text-xl font-semibold text-gray-300">Nombre de rendez-vous</h3>
          <p class="text-4xl font-bold text-purple-500">{{ totalAppointments }}</p>
        </div>
        <div class="stat-item mb-4">
          <h3 class="text-xl font-semibold text-gray-300">Nombre d'utilisateurs</h3>
          <p class="text-4xl font-bold text-purple-500">{{ totalUsers }}</p>
        </div>
        <div class="stat-item">
          <h3 class="text-xl font-semibold text-gray-300">Nombre de conversations</h3>
          <p class="text-4xl font-bold text-purple-500">{{ totalConversations }}</p>
        </div>
      </div>

      <!-- Formulaire de création de professeur -->
      <div class="create-professor p-6 rounded-lg shadow-lg w-full">
        <h2 class="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
          Créer un nouveau professeur
        </h2>
        <form @submit.prevent="createProfessor">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-300">Nom</label>
            <input
              v-model="name"
              type="text"
              id="name"
              class="mt-2 p-3 w-full border border-gray-600 rounded-lg bg-transparent text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Nom du professeur"
              required
            />
          </div>
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-300">Email</label>
            <input
              v-model="email"
              type="email"
              id="email"
              class="mt-2 p-3 w-full border border-gray-600 rounded-lg bg-transparent text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Email du professeur"
              required
            />
          </div>
          <div class="mb-4">
            <label for="password" class="block text-sm font-medium text-gray-300">Mot de passe</label>
            <input
              v-model="password"
              type="password"
              id="password"
              class="mt-2 p-3 w-full border border-gray-600 rounded-lg bg-transparent text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Mot de passe du professeur"
              required
            />
          </div>
          <div class="mb-4">
            <label for="subject" class="block text-sm font-medium text-gray-300">Matière enseignée</label>
            <input
              v-model="subject"
              type="text"
              id="subject"
              class="mt-2 p-3 w-full border border-gray-600 rounded-lg bg-transparent text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Matière enseignée"
              required
            />
          </div>
          <div class="mb-4">
            <label for="bio" class="block text-sm font-medium text-gray-300">Biographie</label>
            <textarea
              v-model="bio"
              id="bio"
              class="mt-2 p-3 w-full border border-gray-600 rounded-lg bg-transparent text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Biographie du professeur"
              rows="4"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            class="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg shadow-md hover:shadow-lg transition"
          >
            Créer le professeur
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
export default {
  name: "AdminDashboard",
  data() {
    return {
      name: "",
      email: "",
      password: "",
      subject: "",
      bio: "",
      totalAppointments: 0,
      totalUsers: 0,
      totalConversations: 0,
    };
  },
  methods: {
    async fetchStats() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Vous devez être connecté pour consulter les statistiques.");
          return;
        }

        // Appeler les API pour obtenir les statistiques
        const [appointmentsResponse, usersResponse, conversationsResponse] = await Promise.all([
          axios.get(`${apiUrl}/api/statistics/appointments`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${apiUrl}/api/statistics/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${apiUrl}/api/statistics/conversations`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        this.totalAppointments = appointmentsResponse.data.total;
        this.totalUsers = usersResponse.data.total;
        this.totalConversations = conversationsResponse.data.total;
      } catch (err) {
        console.error("Erreur lors de la récupération des statistiques:", err.response?.data || err.message);
        alert("Erreur lors de la récupération des statistiques.");
      }
    },
    async createProfessor() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Vous devez être connecté pour effectuer cette action.");
          return;
        }

        // Envoi de la requête pour créer un professeur
        const response = await axios.post(
          `${apiUrl}/api/users/createProfessor`,
          {
            name: this.name,
            email: this.email,
            password: this.password,
            subject: this.subject,
            bio: this.bio,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Réinitialisation du formulaire
        this.name = "";
        this.email = "";
        this.password = "";
        this.subject = "";
        this.bio = "";

        alert("Professeur créé avec succès !");
        this.fetchStats(); // Mettre à jour les statistiques après la création
      } catch (err) {
        console.error("Erreur lors de la création du professeur:", err.response?.data || err.message);
        alert("Erreur lors de la création du professeur. Veuillez réessayer.");
      }
    },
  },
  mounted() {
    this.fetchStats();
  },
};
</script>

<style scoped>


.stats {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}
.create-professor {
  max-width: 100%;
  margin: 0 auto;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.2);

}
button {
  transition: all 0.3s ease;
}
button:hover {
  transform: translateY(-2px);
}
</style>
