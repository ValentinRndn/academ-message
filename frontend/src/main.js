import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'; // Vérifie que ce fichier existe
import Authentification from './views/Authentification.vue'; // Vérifie que ce fichier existe


const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/home',
            component: Home,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/',
            component: Authentification
        },
    ]
})

// Middleware global pour vérifier l'authentification avant d'accéder aux routes protégées
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      const token = localStorage.getItem('token');
  
      if (!token) {
        next({ name: 'auth' });
      } else {
        next();
      }
    } else {
      next();
    }
  });


createApp(App).use(router).mount('#app')
