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
   ```
2. Installez les dépendances pour le backend :
   ```bash
   cd backend
   npm install
   ```
2. Installez les dépendances pour le frontend : 
   ```bash
   cd ../frontend
   npm install
   ```

## **Configuration**

1. Créez un fichier .env dans le dossier racine pour le frontend et dans le dossier backend avec les variables suivantes :

   Dossier racine : .env
   ```bash
   VITE_API_URL=<urlAPI>
   VITE_STRIPE_PUBLIC_KEY=pk_clé_stripe
   ```

1. Créez un fichier .env dans les dossiers frontend et backend avec les variables suivantes :
   Dossier backend : .env
   ```bash
   PORT=5000
   MONGO_URI=<liendelabase>
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=sk__clé_stripe
   ```

## **Lancement de l'application**

1. Démarrez le serveur backend 
   Backend
   ```bash
   cd backend
   node server
   ```

2. Démarrez le serveur frontend 
   Frontend
   ```bash
   cd frontend
   npm run dev
   ```

## **Fonctionnement**

1. Authentification :
   Les utilisateurs se connectent avec leur email et mot de passe.
   Les tokens JWT sécurisent les requêtes.

2. Messagerie :
   Les messages sont transmis en temps réel grâce à Socket.IO.
   Les messages sont sauvegardés dans MongoDB.
   
3. Réservation :
   Les étudiants choisissent une date/heure parmi les créneaux disponibles des professeurs.
   Le paiement est géré via Stripe.

## **Structure du projet**
   ```bash
/academ
├── /backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env
├── /frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.vue
│   └── .env
└── README.md
```

## **Contributeurs**
Valentin Renaudin- Développeur principal
Contributions, questions ou suggestions ? Contactez-moi sur [Lien](https://valentin-renaudin.com/ "Mon site").
