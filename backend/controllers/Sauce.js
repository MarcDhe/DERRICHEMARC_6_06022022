// SOURCE NUMERO STATUS: https://developer.mozilla.org/fr/docs/Web/HTTP/Status

const Sauce = require('../models/Sauce');
const fs = require('fs'); 


exports.getAllSauces = (req, res, next) => {
  Sauce.find()   
    .then(sauces => res.status(200).json(sauces)) 
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id : req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error })); 
};

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce); 
  delete sauceObject._id; 
  const sauce = new Sauce({ 
    ...sauceObject, 
    likes: 0,  
    dislikes: 0,
    usersDisliked: [],
    usersLiked: [],
    imageUrl: `${req.protocol}://${req.get('host')}/pictures/${req.file.filename}` 
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};


exports.updateSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
    .then((sauce) => { 
      if(!sauce){  
        res.status(404).json({ error: 'Objet non trouvé !'});
      }
      if(sauce.userId !== req.auth.userId){
        res.status(403).json({ error: 'requete non autorisé !'});
      }else{
        const sauceObject =  req.file ?  
          { 
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/pictures/${req.file.filename}` 
          } : {...req.body};
          if(req.file){    /// pour la suppression du fichier
            const filename = sauce.imageUrl.split('/pictures/')[1];  // on veut extraire le nom du fichier on le split autour de /images/ car ont sait qu'il vient et [1] pourl'element qui vient juste apres image
            fs.unlink(`pictures/${filename}`,() => {
                console.log("Image supprimé");
            })
          }
        Sauce.updateOne(
          {_id: req.params.id},
          { ...sauceObject, 
            _id: req.params.id } 
          ) 
          .then(() => res.status(200).json({ message : 'Sauce modifiée !'}))
          .catch(error => res.status(400).json({ error }));
      }
    })
  .catch(error => res.status(500).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
    .then((sauce) => { 
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

