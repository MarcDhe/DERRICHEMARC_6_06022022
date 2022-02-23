require('dotenv').config() // SECURITE 

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');


exports.signUp = (req, res, next) => {
   bcrypt.hash(req.body.password, 10) 
    .then(hash => {                   // DOC BCRYPT https://www.npmjs.com/package/bcrypt
      const user = new User({
        email: req.body.email,
        password: hash // ASH ETANT LE RESULTAT DU HASHAGE 
      });
      user.save()
        .then(() => res.status(201).json({ message : 'Utilisateur crée !'}))
        .catch(error => res.status(400).json({ error})); 
    })
  
  .catch(error => res.status(500).json({ error})); // 500 ERR SERVER
};

exports.login = (req, res, next) => {
  User.findOne({email: req.body.email})
    .then(user => {
      // 1-  Comparaison de l'email fournit
      if(!user){  // compression de  user !=== req.body.email
        return res.status(401).json({ message: 'Utilisateur non trouvé !'});  // rappel toujours envoyer un retour et attention dans les cas ou l'action est bien faite mais aucun élément n'est trouver n'est pas la meme erreur qu'un .catch
      }
      // 2- comparaison des passwaord avec bcrypt.compare rappel bcrypt peu savoir si 2 ash different viennent d'une meme string de base
      bcrypt.compare(req.body.password, user.password) // renvoi un boléan
        .then(valid =>{
          if(!valid){
            return res.status(401).json({ error : 'Mot de passe incorrect !'});
          }
          res.status(200).json({ // important debut du renvoi id + token
            userId: user._id,
            token: jwt.sign( // CREATION DU TOKEN
              {userId: user._id}, // user du token
              `${process.env.MY_SECRET_TOKEN}`, // token fourni 
              {expiresIn: '24h'} // période d'expiration
            )
          });
        })
        .catch(error => res.status(500).json({ error })); // 500 ERR SERVER   // un peu different ici car meme si il ne trouve pas le user il fait quand meme le tour
    })
    .catch(error => res.status(500).json({ error })); // 500 ERR SERVER 
};

