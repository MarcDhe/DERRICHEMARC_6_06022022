const express = require("express");
const app = express();

const bodyParser = require('body-parser'); // pour l'ajout d'autre dichier que app ( routes/.. et controllers/..)
const stuffRoutes = require('./routes/stuff'); // IMPORTATION DU FICHIER STUFF DE ROUTES 


const mongoose = require ('mongoose');

//AJOUT DE LA BASE DE DONNEE MONGOOSE
mongoose.connect('mongodb+srv://andoro:landser@cluster0.ivpku.mongodb.net/test',
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
app.use('/api/sauces', stuffRoutes); // on appel stuff routes avec pour début d'identifaint des routes /api/sauces

module.exports = app;
