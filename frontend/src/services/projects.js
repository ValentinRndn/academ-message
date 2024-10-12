// server.js
const db = require('./db');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;

// Route GET pour récupérer tous les projets
app.get('/projects', (req, res) => {
    // Exécuter une requête SQL pour récupérer les projets depuis la base de données
    db.query('SELECT * FROM projects', (error, results) => {
      if (error) {
        console.error('Erreur lors de la récupération des projets depuis la base de données :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des projets' });
        return;
      }
      // Envoyer les résultats en tant que réponse JSON
      res.json(results);
    });
  });
  
  // Écouter les requêtes HTTP sur le port spécifié
  app.listen(PORT, () => {
    console.log(`Serveur Express écoute sur le port ${PORT}`);
  });app.get('/projects', (req, res) => {
  // Ici, vous récupéreriez les données des projets depuis votre base de données
  const projects = [
    { title: 'Projet 1', description: 'Description du projet 1'},
    { title: 'Projet 2', description: 'Description du projet 2'},
  ];
  res.json(projects);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
