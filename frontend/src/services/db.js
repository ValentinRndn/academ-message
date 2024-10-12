// Importez le module mysql
const mysql = require('mysql2');

// Créez une connexion à la base de données
const connection = mysql.createConnection({
  host: 'localhost', // Adresse du serveur MySQL
  user: 'superadmin', // Nom d'utilisateur MySQL
  password: '123', // Mot de passe MySQL
  database: 'portfolio' // Nom de la base de données MySQL
});

// Connectez-vous à la base de données
connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
    return;
  }
  console.log('Connecté à la base de données MySQL');
});

// Exportez la connexion pour l'utiliser dans d'autres fichiers
module.exports = connection;
