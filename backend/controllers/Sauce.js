// SOURCE NUMERO STATUS: https://developer.mozilla.org/fr/docs/Web/HTTP/Status

const Sauce = require('../models/Sauce');
const fs = require('fs'); // package fs ( FileSysteme)  systeme de fichier


exports.getAllSauces = (req, res, next) => {
  Sauce.find()   // appel a la base de donnee renvoie une promise
    .then(sauces => res.status(200).json(sauces)) // on se rappel l'utilisation du 's' en plus sauce pour un objet sauceS pour tout les objet pour copurs API REST
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id : req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error })); // on rappel error est l'abrébiation de error : error
};

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce); // le but etant de séparer de la req.body, l'image et le reste
  delete sauceObject._id; // car crée automatiqeument par mongoose
  const sauce = new Sauce({ 
    ...sauceObject, // et non plus req.body
    likes: 0,   // bonne utilisation ?
    dislikes: 0,
    usersDisliked: [],
    usersLiked: [],
    imageUrl: `${req.protocol}://${req.get('host')}/pictures/${req.file.filename}` // attention ici important  
  });
  sauce.save() // attention ici sauce est une constance rien a voir avec le SauceSchema
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};


exports.updateSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
    .then((sauce) => { //  les if vérifie si la sauce existe, et si l'utilisateur est le créateur 
      if(!sauce){  
        res.status(404).json({ error: 'Objet non trouvé !'});
      }
      if(sauce.userId !== req.auth.userId){
        res.status(403).json({ error: 'requete non autorisé !'});
      }else{
        const sauceObject =  req.file ?  // ATTENTION : '?' operateur ternaire si existe un type d'objet sinon un autre, permet de vérifié si un image nous est envoyé pendant la modif {conteny} : {contenu }
          { // IMPORTANT CREATION SAUCEOBJECT, TEST SI IL Y A UNE IMAGE : ALORS MEME METHODE QUE POUR LE POST SINON ON REST SUR REQ.BODY
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/pictures/${req.file.filename}` // attention ici important  
          } : {...req.body};
        Sauce.updateOne( // prend en parametre l'id du produit, le nouveau body et le id de la modif
          {_id: req.params.id},
          { ...sauceObject,  // on reinitialise les likes et dislikes si mise à jour
            _id: req.params.id } // utilité de rappeler le req.params.id ici ?
          ) 
          .then(() => res.status(200).json({ message : 'Sauce modifiée !'}))
          .catch(error => res.status(400).json({ error }));
      }
    })
  .catch(error => res.status(500).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
    .then((sauce) => { //  les if vérifie si la sauce existe, et si l'utilisateur est le créateur 
      if(!sauce){  
        res.status(404).json({ error: 'Objet non trouvé !'});
      }
      if(sauce.userId !== req.auth.userId){
        res.status(403).json({ error: 'Requete non autorisé !'});
      }else{
        const filename = sauce.imageUrl.split('/pictures/')[1];  // on veut extraire le nom du fichier on le split autour de /images/ car ont sait qu'il vient et [1] pourl'element qui vient juste apres image
        fs.unlink(`pictures/${filename}`, () => {
          Sauce.deleteOne({_id : req.params.id})
          .then(()=> res.status(200).json({ message : 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
        });
      }
    })
    .catch(error => res.status(500).json({ error }));
};



exports.like = (req, res, next) => {
  Sauce.findOne({_id : req.params.id})
    .then(sauce => {
          //$inc: https://docs.mongodb.com/manual/reference/operator/update/inc/
          //$push: https://docs.mongodb.com/manual/reference/operator/update/push/
          //$pull: https://docs.mongodb.com/manual/reference/operator/update/pull/
          //.include: https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
      if(req.body.like === 1 && !sauce.usersLiked.includes(req.body.userId) && !sauce.usersDisliked.includes(req.body.userId)){
        Sauce.updateOne({_id : req.params.id}, {$inc : {likes : 1}, $push: {usersLiked : req.body.userId}})
          .then(() => res.status(200).json({ message : 'Like ajouté !'}))
          .catch(error => res.status(400).json({ error }));    
      }; 
      if(req.body.like === 0 && sauce.usersLiked.includes(req.body.userId)){
        Sauce.updateOne({_id : req.params.id}, {$inc : {likes : -1}, $pull: {usersLiked : req.body.userId}})
          .then(() => res.status(200).json({ message : 'Like retiré !'}))
          .catch(error => res.status(400).json({ error }));  
      };
      if(req.body.like === -1 && !sauce.usersDisliked.includes(req.body.userId) && !sauce.usersLiked.includes(req.body.userId)){
        Sauce.updateOne({_id : req.params.id}, {$inc : {dislikes : 1}, $push: {usersDisliked : req.body.userId}})
          .then(() => res.status(200).json({ message : 'Dislike ajouté !'}))
          .catch(error => res.status(400).json({ error }));   
      };
      if(req.body.like === 0 && sauce.usersDisliked.includes(req.body.userId)){
        Sauce.updateOne({_id : req.params.id}, {$inc : {dislikes : -1}, $pull: {usersDisliked : req.body.userId}})
          .then(() => res.status(200).json({ message : 'Dislike retiré !'}))
          .catch(error => res.status(400).json({ error }));  
      };
      if( // en cas d'envoi de requete via postman
          (req.body.like === 1 && (sauce.usersDisliked.includes(req.body.userId) || sauce.usersLiked.includes(req.body.userId))) 
          || (req.body.like === -1 && (sauce.usersDisliked.includes(req.body.userId) || sauce.usersLiked.includes(req.body.userId))) 
        ){
          res.status(406).json({ error : 'Avis déjà présent !'});
      };
    })
    .catch(error => res.status(400).json({ error }));
};

// Définit le statut « Like » pour l' userId fourni. 
// Si like = 1, l'utilisateur aime (= like) la sauce. 
// Si like = 0, l'utilisateur annule son like ou son dislike. 
// Si like = -1, l'utilisateur n'aime pas (= dislike) la sauce.
// L'ID de l'utilisateur doit être ajouté ou retiré du tableau approprié. Cela permet de garder une trace de 
// leurs préférences et les empêche de liker ou de ne pas disliker la même sauce plusieurs fois : un utilisateur 
// ne peut avoir qu'une seule valeur pour chaque sauce. Le nombre total de « Like » et de « Dislike » est mis à 
// jour à chaque nouvelle notation.