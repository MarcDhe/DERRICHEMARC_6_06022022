// https://www.youtube.com/watch?v=zwcvXd3kGbw
require('dotenv').config() // SECURITE : quel est son utilité car si pas présent pas de soucis non plus
const helmet = require("helmet"); // SECURITE
const rateLimit = require('express-rate-limit'); // SECURITE

const express = require("express");
const app = express();

const limiter = rateLimit({  // SECURITE
  windowsMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite each IP to 100 requests per windowMs 
  message : "Trop de requete envoyer"
});

const bodyParser = require('body-parser'); // pour l'ajout d'autre dichier que app ( routes/.. et controllers/..)
const stuffRoutes = require('./routes/Sauce'); // IMPORTATION DU FICHIER STUFF DE ROUTES 
const userRoutes = require('./routes/User'); // IMPORTATION DU FICHIER  USER DE ROUTES

const path = require('path'); // IMPORTANT POUR LES IMAGES ET LUTILISATION DE PATH.JOIN plus loin

const mongoose = require ('mongoose');

//AJOUT DE LA BASE DE DONNEE MONGOOSE
mongoose.connect(`${process.env.MY_MONGODB_LINK}`,  //SECURITE DOTENV CF .ENV
    {useNewUrlParser: true,
     useUnifiedTopology: true})
      .then(() => console.log('Connexion à MongoDB réussie !'))
      .catch(() => console.log('Connexion à MongoDB échouée !'));

// INTERCEPTE TOUT LES TYPES DE REQUETES
app.use(express.json());

// CORS 'autorisation' 'd'acces/de connexion'
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json()); // va de paire avec le bodyParser d'en haut

app.use('/api', limiter) // SECURITE : Apply the rate limiting to All standard APi call ( car placer avant les autres app.use)

app.use('/api/sauces', stuffRoutes); // defini la route de 'base' qu'aura les routes de  ./routes/stuff
app.use('/api/auth', userRoutes); // defini la route de 'base' qu'aura les routes de  ./routes/user

app.use('/pictures', express.static(path.join(__dirname, 'pictures'))); //reponds au requete envoyer a /images et sert un serveur static express.static() et path.join() pour connaitre le chemin avec en (__direname, 'images)

app.use(helmet()); // SECURITE : ATTENTION SI MIS AVANT AP.USE('/PICTURES ....) ---> MET LES IMAGES HS 



module.exports = app;
