const axios = require('axios');
const CryptoJS = require('crypto-js');
const fs = require('fs');
const path = require('path');

// Charger les clés privées et publiques
const consumerKey = 'VOTRE_CONSUMER_KEY'; // Obtenue sur le portail Mastercard
const keyPath = path.resolve(__dirname, '../keys/privatekey.perm');
const key = fs.readFileSync(keyPath, 'utf8');

// Fonction pour signer les requêtes API Mastercard Send
function signRequest(url, method, body) {
  const time = Math.floor(Date.now() / 1000);
  const nonce = CryptoJS.lib.WordArray.random(16).toString();
  const message = `${method.toUpperCase()}&${encodeURIComponent(url)}&oauth_consumer_key=${consumerKey}&oauth_nonce=${nonce}&oauth_signature_method=RSA-SHA256&oauth_timestamp=${time}&oauth_version=1.0`;
  const signature = CryptoJS.HmacSHA256(message, key).toString(CryptoJS.enc.Base64);

  return `OAuth oauth_consumer_key="${consumerKey}", oauth_nonce="${nonce}", oauth_signature="${signature}", oauth_signature_method="RSA-SHA256", oauth_timestamp="${time}", oauth_version="1.0"`;
}
