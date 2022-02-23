const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/User');
const password = require('../middleware/password');

// REQUETE POST CONTIENT LE MDP ET L'ADRESSE MAIL
router.post('/signup', password, userCtrl.signUp);
router.post('/login', userCtrl.login);


module.exports = router;