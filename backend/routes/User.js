const express = require('express');
const router = express.Router();   // A RAJOUTER POUR FAIRE FONCITONNE LES ROUTER

const userCtrl = require('../controllers/User');

// REQUETE POST CAR ON ENVERRA LE MDP ET L'ADRESSE MAIL
router.post('/signup', userCtrl.signUp);
router.post('/login', userCtrl.login);
router.get('/', userCtrl.getAllUser);
router.delete('/:id', userCtrl.deleteUser);

module.exports = router;