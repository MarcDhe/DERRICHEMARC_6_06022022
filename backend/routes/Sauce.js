const express = require('express');
const router = express.Router();   

const multer = require('../middleware/multer-config'); // ajout multer pour les images
const auth = require('../middleware/auth');

const stuffCtrl = require('../controllers/Sauce'); // IMPORTATION CONTROLLERS


router.get('/', auth, stuffCtrl.getAllSauces);
router.get('/:id', auth, stuffCtrl.getOneSauce);
router.post('/', auth, multer, stuffCtrl.createSauce);
router.put('/:id', auth, multer, stuffCtrl.updateSauce);
router.delete('/:id', auth, multer, stuffCtrl.deleteSauce);

router.post('/:id/like', auth, stuffCtrl.like);

module.exports = router; 

