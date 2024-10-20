// services/professorService.js
import axios from 'axios';

// Fonction pour récupérer les professeurs
export const fetchProfessors = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/users/professors'); 
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des professeurs :', error);
    throw error;
  }
};
