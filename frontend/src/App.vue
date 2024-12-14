<template>
  <div class="app min-h-screen font-quicksand overflow-y-hidden md:overflow-y-auto">


    <router-view />
    <Footer />
  </div>
</template>

<style>
.app {
  background: linear-gradient(135deg, #1e1e2f 0%, #302b63 50%, #24243e 100%);

}
</style>

<script setup> 
  // import Navbar from './components/Navbar.vue';
  import Footer from './components/Footer.vue';
  // import Socials from './components/Socials.vue';
</script>