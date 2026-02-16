/**
 * Serveur Node.js pour ALH Productions
 * Site vitrine - Vidéaste professionnel
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Servir les fichiers statiques depuis le dossier 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Route principale - Page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route - Page Mariages
app.get('/mariages', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'mariages.html'));
});

// Route - Page Entreprises
app.get('/entreprises', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'entreprises.html'));
});

// Route - Page Sport
app.get('/sport', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sport.html'));
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════════════════╗
    ║                                                   ║
    ║           ALH PRODUCTIONS - Serveur               ║
    ║                                                   ║
    ║   🎬 Site en ligne sur: http://localhost:${PORT}    ║
    ║                                                   ║
    ╚═══════════════════════════════════════════════════╝
    `);
});
