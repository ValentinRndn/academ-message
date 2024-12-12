<template>
  <nav class="navbar text-white mb-4 shadow-lg">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center">
          <router-link to="/" class="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            <img src="../assets/logo_academ.png" alt="Logo" class="w-[40px]">
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="flex md:hidden space-x-8 font-medium text-lg">
          <router-link 
            v-if="userRole === 'admin'" 
            to="/adminPage" 
            class="hover:text-purple-400 transition"
            :class="{ 'underline decoration-2 decoration-purple-500': $route.path === '/adminPage' }"
          >
            Admin
          </router-link>
          <router-link 
            to="/" 
            class="hover:text-purple-400 transition"
            :class="{ 'underline decoration-2 decoration-purple-500': $route.path === '/' }"
          >
            Conversations
          </router-link>
          <router-link 
            v-if="userRole !== 'professor'" 
            to="/professors" 
            class="hover:text-purple-400 transition"
            :class="{ 'underline decoration-2 decoration-purple-500': $route.path === '/professors' }"
          >
            Professeurs
          </router-link>
        </div>

        <!-- Auth/Profil Section -->
        <div class=" md:hidden items-center space-x-4">
          <template v-if="isAuthenticated">
            <div class="relative profil-container flex items-center">
              <img
                :src="userProfilePicture"
                alt="Profile"
                class="w-10 h-10 rounded-full border border-gray-600 cursor-pointer"
                @click="toggleProfileMenu"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6 ml-2 text-gray-300 cursor-pointer transform transition-transform duration-200"
                :class="{ 'rotate-180': isProfileMenuOpen }"
                @click="toggleProfileMenu"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="m12 15.4l-6-6L7.4 8l4.6 4.6L16.6 8L18 9.4z" />
              </svg>

              <!-- Dropdown Menu -->
              <div
                v-if="isProfileMenuOpen"
                class="dropdown-menu bg-darkblue absolute right-0 mt-12 w-48 border rounded-lg shadow-lg z-20"
              >
                <ul class="py-2 text-sm text-gray-200">
                  <li>
                    <router-link 
                      to="/profileParameter" 
                      class="block px-4 py-2 hover:bg-gray-800 rounded-lg transition"
                    >
                      Mon Profil
                    </router-link>
                  </li>
                  <li v-if="userRole === 'admin'">
                    <router-link 
                      to="/adminPage" 
                      class="block px-4 py-2 hover:bg-gray-800 rounded-lg transition"
                    >
                      Admin
                    </router-link>
                  </li>
                  <li>
                    <a 
                      @click="logout" 
                      class="block px-4 py-2 hover:bg-gray-800 rounded-lg transition cursor-pointer"
                    >
                      Se déconnecter
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </template>
          <template v-else>
            <button 
              @click="goToLogin" 
              class="text-purple-500 border border-purple-500 px-4 py-2 rounded-lg hover:bg-purple-500 hover:text-white transition"
            >
              Se connecter | S'inscrire
            </button>
          </template>
        </div>

        <!-- Mobile Menu Button -->
        <div class="hidden md:flex items-center">
          <button 
            @click="isMobileMenuOpen = !isMobileMenuOpen" 
            class="text-gray-500 hover:text-gray-300 focus:outline-none transition"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isMobileMenuOpen" class="mobileNavbar  border-t border-gray-700">
      <div class="py-2 space-y-1">
        <router-link 
          to="/" 
          class="block px-4 py-2 text-gray-300 hover:bg-darkblue rounded-lg transition"
          :class="{ 'bg-darkblue': $route.path === '/' }"
        >
          Conversations
        </router-link>
        <router-link 
          v-if="userRole !== 'professor'" 
          to="/professors" 
          class="block px-4 py-2 text-gray-300 hover:bg-darkblue rounded-lg transition"
          :class="{ 'bg-darkblue': $route.path === '/professors' }"
        >
          Professeurs
        </router-link>
        <router-link 
          v-if="userRole === 'admin'" 
          to="/adminPage" 
          class="block px-4 py-2 text-gray-300 hover:bg-darkblue rounded-lg transition"
          :class="{ 'bg-darkblue': $route.path === '/adminPage' }"
        >
          Admin
        </router-link>
        <router-link 
          v-if="isAuthenticated" 
          to="/profileParameter" 
          class="block px-4 py-2 text-gray-300 hover:bg-darkblue rounded-lg transition"
        >
          Mon Profil
        </router-link>
      </div>
      <div v-if="isAuthenticated" class="py-3 border-t border-gray-700">
        <button 
          @click="logout" 
          class="block w-full text-left px-4 py-2 text-gray-300 hover:bg-darkblue transition"
        >
          Se déconnecter
        </button>
      </div>
      <div v-else class="py-3 border-t border-gray-700">
        <button 
          @click="goToLogin" 
          class="block w-full text-left px-4 py-2 text-gray-300 hover:bg-darkblue transition"
        >
          Se connecter
        </button>
        <button 
          @click="goToSignup" 
          class="block w-full text-left px-4 py-2 bg-purple-500 text-white hover:bg-purple-600 transition rounded-lg"
        >
          S'inscrire
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  data() {
    return {
      isMobileMenuOpen: false,
      isProfileMenuOpen: false,
      isAuthenticated: false,
      userProfilePicture: '',
      userRole: '',
    };
  },
  mounted() {
    this.checkAuthStatus();
    this.setUserRole();
  },
  methods: {
    checkAuthStatus() {
      const token = localStorage.getItem('token');
      if (token) {
        this.isAuthenticated = true;
        axios
          .get(`${apiUrl}/api/users/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            this.userProfilePicture = `${apiUrl}/uploads/${response.data.profilePicture}`;
          })
          .catch(() => {
            this.userProfilePicture = 'default-profile-pic-url.jpg';
          });
      }
    },
    setUserRole() {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = this.decodeJwt(token);
        this.userRole = decodedToken?.user?.role || '';
      }
    },
    decodeJwt(token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
      } catch {
        return null;
      }
    },
    toggleProfileMenu() {
      this.isProfileMenuOpen = !this.isProfileMenuOpen;
    },
    goToLogin() {
      this.$router.push({ name: 'auth' });
    },
    goToSignup() {
      this.$router.push({ name: 'signup' });
    },
    logout() {
      localStorage.removeItem('token');
      this.isAuthenticated = false;
      this.isProfileMenuOpen = false;
      this.$router.push({ name: 'auth' });
    },
  },
};
</script>

<style scoped>
.profil-container {
  position: relative;
}

.navbar, .mobileNavbar {
  background: linear-gradient(135deg, #1e1e2f 0%, #302b63 50%, #24243e 100%);
}

.dropdown-menu {
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>
