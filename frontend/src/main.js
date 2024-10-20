import { createApp } from 'vue'; // Import correct pour Vue 3
import './style.css';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router'; // Import correct pour Vue Router 4
import AdminPage from './views/AdminPage.vue';
import Authentification from './views/Authentification.vue';
import Professors from './views/Professors.vue';
import ProfessorDetail from './components/ProfessorDetail.vue';
import Conversations from './views/Conversations.vue';
import profileParameter from './views/ProfileParameter.vue';

const router = createRouter({
    history: createWebHistory(), // Utiliser createWebHistory pour Vue Router 4
    routes: [
      {
        path: '/adminPage',
        name: 'adminPage',
        component: AdminPage,
      },
        {
            path: '/auth',
            name: 'auth',
            component: Authentification
        },
        {
          path: '/professors',
          name: 'professors',
          component: Professors,
          meta: {
            // requiresAuth: true // Route protégée
          }
        },
        {
          path: '/professor/:id',
          name: 'professorDetail',
          component: ProfessorDetail,
        },
        {
          path: '/',
          name: 'conversations',
          component: Conversations,
        },
        {
          path: '/profileParameter',
          name: 'profileParameter',
          component: profileParameter,
        },
    ]
});

// Middleware global pour vérifier l'authentification avant d'accéder aux routes protégées
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      const token = localStorage.getItem('token');
    
      if (!token) {
        next({ name: 'auth' }); // Rediriger vers la page de connexion si pas de token
      } else {
        next(); // Continuer si l'utilisateur est authentifié
      }
    } else {
      next(); // Continuer si la route n'est pas protégée
    }
  });
  


createApp(App).use(router).mount('#app');
