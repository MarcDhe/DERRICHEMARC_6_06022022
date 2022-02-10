const express = require('express');
const router = express.Router();   // A RAJOUTER POUR FAIRE FONCITONNE LES ROUTER

const multer = require('../middleware/multer-config'); // ajout multer pour le simages
const auth = require('../middleware/auth');

const stuffCtrl = require('../controllers/stuff'); // IMPORTATION CONTROLLERS


router.get('/', auth, stuffCtrl.getAllSauces);
router.get('/:id', auth, stuffCtrl.getOneSauce);
router.post('/', auth, multer, stuffCtrl.createSauce);
router.put('/:id', auth, stuffCtrl.updateSauce);
router.delete('/:id', auth, multer, stuffCtrl.deleteSauce);

router.post('/:id/like', auth, stuffCtrl.like);

module.exports = router; // ATTENTION NE PAS L'OUBLIE CELUI LA  cf express.routr plus haut

