const multer = require('multer'); // module de gestion des fichiers

const MIME_TYPES = { // on créé un dictionnaire/objet en en foction des .mimetype possible
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({ // diskStorage enregistrement sur disque // besoin de 2 chose destination et le filename
   destination: (req, file, callback ) => {
     callback(null, 'pictures') // destination où l'on envoi les image  // null pour dire qu'il n'y a pas d'erreur
   },
   filename: (req, file, callback) => {
     const name = file.originalname.split(' ').join('_'); // .originalname recupere le titre original de la photo .split(' ') va retirer les espaces et .join('_') va les remplacer par des _   // SPLIT CREE UN TABLEAU DES ELEMENT QUI SONT SEPARER PAR DES (' ')
     const extension = MIME_TYPES[file.mimetype]; // on recupere l'extension de l'images grace a .mimetype
     callback(null, name + Date.now() + '.' + extension); // on nomme la nouvelle image avec nom date et extension
    }
});

module.exports = multer({ storage }).single('image'); // .single('image') pour dire qu'il ne sagira que d'image

