// services/professorService.js
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

// Fonction pour récupérer les professeurs
export const fetchProfessors = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/users/professors`); 
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des professeurs :', error);
    throw error;
  }
};
