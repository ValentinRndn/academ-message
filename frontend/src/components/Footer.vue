<template>
    <div class="footer bg-darkgrey  text-white pt-8 z-50">
      <div class="container flex p-12 md:flex-col border-b border-bordergray md:items-center md:text-center justify-between  gap-8">
        
        <!-- Section Logo et description -->
        <div class="footer-logo flex flex-col items-center md:items-start">
            <router-link to="/">
          <img src="../assets/logo_academ.png" alt="Logo" class="w-32 ">
        </router-link>
        </div>
  
        <!-- Section Liens de Navigation -->
        <div class="footer-nav">
          <h3 class="text-lg font-semibold mb-4">Navigation</h3>
          <ul class="flex flex-col gap-2">
            <li><router-link to="/privacyPolicy" class="hover:text-lightgrey">Politique de confidentialité</router-link> </li>
            <li><router-link to="/termsOfUse" class="hover:text-lightgrey">Conditions d'utilisation</router-link></li>
            <li><router-link to="/" class="hover:text-lightgrey">Conversation</router-link></li>
          </ul>
        </div>
  
        <!-- Section Contact -->
        <div class="footer-contact">
          <h3 class="text-lg font-semibold mb-4">Contactez-nous</h3>
          <ul class="flex flex-col gap-2">
            <li>Email : <a href="mailto:contact@imators.com" class="hover:text-lightgrey">contact@imators.com</a></li>
          </ul>
        </div>
  
        <!-- Section Réseaux Sociaux -->
        <div class="footer-social">
          <h3 class="text-lg font-semibold mb-4">Suivez-nous</h3>
          <div class="flex gap-4 justify-center">
            <a href="https://www.instagram.com/this.is.imators" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" class="hover:text-lightgrey cursor-pointer" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"/></svg>
            </a>
          </div>
        </div>
      </div>
  
      <!-- Footer Bottom -->
      <div class="footer-bottom text-center text-sm text-lightgrey my-8">
        &copy; 2024 Imators. Tous droits réservés | <a href="https://valentin-renaudin.com" target="_blank">By Valentin Renaudin</a>
        <p>Imators is a registered LLC (Limited Liability Company). All our products, whether technologically physical or simply online, are subject to our rules, which you can access.</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Footer',
  };
  </script>