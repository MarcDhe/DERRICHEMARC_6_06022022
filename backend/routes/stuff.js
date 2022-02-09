const express = require('express');
const router = express.Router();   // A RAJOUTER POUR FAIRE FONCITONNE LES ROUTER


const stuffCtrl = require('../controllers/stuff'); // IMPORTATION CONTROLLERS


router.get('/', stuffCtrl.getAllSauces);
router.get('/:id', stuffCtrl.getOneSauce);
router.post('/', stuffCtrl.createSauce);
router.put('/:id', stuffCtrl.updateSauce);
router.delete('/:id', stuffCtrl.deleteSauce);

module.exports = router; // ATTENTION NE PAS L'OUBLIE CELUI LA  cf express.routr plus haut
