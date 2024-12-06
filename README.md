# **Académ - Plateforme de Messagerie et Réservation**

Académ est une application web permettant des interactions en temps réel entre étudiants et professeurs. Elle propose une messagerie instantanée, un système de réservation, et des rôles spécifiques (admin, professeur, étudiant).

---

## **Table des matières**

1. [Fonctionnalités](#fonctionnalités)  
2. [Technologies utilisées](#technologies-utilisées)  
3. [Installation](#installation)  
4. [Configuration](#configuration)  
5. [Lancement de l'application](#lancement-de-lapplication)  
6. [Fonctionnement](#fonctionnement)  
7. [Structure du projet](#structure-du-projet)  
8. [Contributeurs](#contributeurs)  

---

## **Fonctionnalités**

- **Messagerie instantanée :** Chat en temps réel entre utilisateurs.  
- **Réservation de rendez-vous :** Les étudiants peuvent réserver des créneaux avec des professeurs.  
- **Gestion des rôles :** Interface différente pour les administrateurs, professeurs, et étudiants.  
- **Authentification JWT :** Connexion sécurisée via tokens.  
- **API REST :** Communication entre le frontend et backend.  
- **Responsive design :** Adapté aux ordinateurs et mobiles.  

---

## **Technologies utilisées**

### **Frontend :**

- **Vue.js 3** avec Composition API  
- **Socket.IO Client** pour la communication en temps réel  
- **Tailwind CSS** pour le design  
- **Axios** pour les appels API  

### **Backend :**

- **Node.js** et **Express.js**  
- **Socket.IO** pour le temps réel  
- **MongoDB** avec **Mongoose** pour la base de données  
- **Stripe** pour les paiements  

### **Autres :**

- **MongoDB Atlas** pour le stockage cloud de la base de données  
- **dotenv** pour la gestion des variables d'environnement  

---

## **Installation**

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/votre-repo/academ.git
   cd academ
