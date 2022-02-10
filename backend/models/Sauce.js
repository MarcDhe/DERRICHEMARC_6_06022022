const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
  userId: {type: String, required: true},
  name : {type: String, required: true},
  manufacturer: {type: String, required: true},
  description: {type: String, required: true},
  mainPepper: {type: String, required: true},
  imageUrl: {type: String, required: true},
  heat: {type: Number, required: true},    
  likes: {type: Number, required: false},  // pour eviter les messages derreur dans la console
  dislikes: {type: Number, required: false},
  userLiked: {type: [String]}, // Pas sure du type
  userDisliked: {type: [String]}
});

module.exports = mongoose.model('Sauce', sauceSchema);

