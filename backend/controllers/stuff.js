// const { update } = require('../models/Sauce'); ---> pourqoi ? ( se créer seul )
const Sauce = require('../models/Sauce');

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
    imageUrl: `${req.protocol}://${req.get('host')}/pictures/${req.file.filename}` // attention ici important  
  });
  sauce.save() // attention ici sauce est une constance rien a voir avec le SauceSchema
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.updateSauce = (req, res, next) => {
  Sauce.updateOne({id: req.params.id}, {...req.body, _id :req.params.id}) // prend en parametre l'id du produit, le nouveau body et le id de la modif
    .then(() => res.status(200).json({ message : 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.deleteOne({_id : req.params.id})
    .then(()=> res.status(200).json({ message : 'Sauce supprimée !'}))
    .catch(error => res.status(400).json({ error }));
};