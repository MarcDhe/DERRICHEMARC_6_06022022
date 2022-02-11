const express = require('express');
const router = express.Router();   // A RAJOUTER POUR FAIRE FONCITONNE LES ROUTER

const userCtrl = require('../controllers/User');
const password = require('../middleware/password');

// REQUETE POST CAR ON ENVERRA LE MDP ET L'ADRESSE MAIL
router.post('/signup', password, userCtrl.signUp);
router.post('/login', userCtrl.login);
router.get('/', userCtrl.getAllUser); // a remove avant envoi evaluation
router.delete('/:id', userCtrl.deleteUser); // a remove avant envoi evaluation

module.exports = router;