<template>
  <Navbar></Navbar>

  <div class="professors-container p-8  m-4 rounded-lg min-h-screen border-3 border-darkgray">
    <h1 class="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-8">Trouvez votre professeur</h1>

    <!-- Barre de recherche -->
    <div class="mb-8 ">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher par nom ou matière"
        class="p-3 w-full border border-lightgray bg-transparent rounded-md focus:outline-none focus:ring-2 focus:darkgray text-white"
      />
    </div>

    <!-- Liste des professeurs -->
    <div v-if="filteredProfessors.length > 0" class="flex justify-center w-full h-full flex-wrap gap-6">
      <div
        v-for="professor in filteredProfessors"
        :key="professor._id"
        class="professor-card gradient relative flex flex-col gap-3 p-4 w-[400px] h-[200px] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
      >
        <div class="flex items-center gap-3">
          <img
            :src="professor.profilePicture ? `http://localhost:5000/uploads/${professor.profilePicture}` : '../assets/profil/default.webp'"
            alt="ProfileProfessor"
            class="w-10 h-10 rounded-full border border-gray-300"
          />
          <h2 class="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">{{ professor.name }}</h2>
        </div>

        <div class="biography-container flex items-begin gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="#a464d4" d="M18 22.116q-1.671 0-2.835-1.165Q14 19.787 14 18.116t1.165-2.836T18 14.116t2.836 1.164T22 18.116q0 1.67-1.164 2.835Q19.67 22.116 18 22.116M7.5 8.73h9v-1h-9zM11.521 20H5.616q-.672 0-1.144-.472T4 18.385V5.615q0-.67.472-1.143Q4.944 4 5.616 4h12.769q.67 0 1.143.472q.472.472.472 1.144v5.95q-.494-.158-.991-.247q-.498-.088-1.009-.088q-.506 0-.984.08q-.477.08-.939.226V11.5H7.5v1h6.587q-.758.521-1.332 1.223t-.945 1.546H7.5v1h3.96q-.108.423-.169.853q-.06.43-.06.878q0 .46.054 1.009t.236.991M18 18.116q.625 0 1.063-.438t.437-1.062t-.437-1.063T18 15.116t-1.062.437t-.438 1.063t.438 1.062t1.062.438m0 3q.75 0 1.4-.35t1.075-.975q-.575-.35-1.2-.513T18 19.116t-1.275.162t-1.2.513q.425.624 1.075.974t1.4.35"/>
          </svg>
          <p class="text-white">{{ professor.bio }}</p>
        </div>

        <div class="biography-container flex items-begin gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="#a464d4" d="M8 12h8v-2H8zm0-4h8V6H8zm11.95 12.475L15.9 15.2q-.425-.575-1.05-.887T13.5 14H4V4q0-.825.588-1.412T6 2h12q.825 0 1.413.588T20 4v16q0 .125-.012.238t-.038.237M6 22q-.825 0-1.412-.587T4 20v-4h9.5q.25 0 .463.113t.362.312l4.2 5.5q-.125.05-.262.063T18 22z"/>
          </svg>
          <p class="text-white">{{ professor.subject }}</p>
        </div>

        <button @click="goToProfessorDetail(professor._id)" class=" bg- p-1 w-fit absolute right-2 bottom-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition">Voir le détail</button>
      </div>
    </div>

    <!-- Message si aucun professeur n'est trouvé -->
    <div v-else class="text-white">
      <p>Aucun professeur trouvé.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from '../components/Navbar.vue';
import { fetchProfessors } from '../services/professorServices';

const professors = ref([]);
const searchQuery = ref('');
const error = ref(null);
const router = useRouter(); 

// Appel de l'API lorsque le composant est monté
const loadProfessors = async () => {
  try {
    const data = await fetchProfessors();
    professors.value = data;
  } catch (err) {
    error.value = 'Erreur lors de la récupération des professeurs';
  }
};

onMounted(loadProfessors);

const filteredProfessors = computed(() => {
  return professors.value.filter(professor => {
    const query = searchQuery.value.toLowerCase();
    return (
      professor.name.toLowerCase().includes(query) ||
      professor.subject.toLowerCase().includes(query)
    );
  });
});

const goToProfessorDetail = (professorId) => {
  router.push({ name: 'professorDetail', params: { id: professorId } });
};
</script>

<style scoped>
/* Conteneur principal */
.professors-container {
  background: linear-gradient(135deg, #1e1e2f 0%, #302b63 50%, #24243e 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);

}

/* Input de recherche */
input {
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.05);
  color: #dcdcdc;
  padding: 0.8rem;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

input:focus {
  border-color: #a464d4;
  outline: none;
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 6px rgba(236, 121, 247, 0.7);
}

input::placeholder {
  color: rgba(200, 200, 200, 0.6);
}

/* Carte des professeurs */
.professor-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.professor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
}


.professor-card img {
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}


.biography-container p {
  font-size: 0.95rem;
  color: rgba(220, 220, 220, 0.9);
}

/* Bouton 'Voir le détail' */
.details {
  background: linear-gradient(135deg, #9b59b6, #ec79f7);
  font-weight: 600;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  transition: background 0.3s ease, transform 0.2s ease;
}

.details:hover {
  background: linear-gradient(135deg, #8e44ad, #d441ff);
  transform: translateY(-3px);
}

/* Message d'erreur */

</style>
