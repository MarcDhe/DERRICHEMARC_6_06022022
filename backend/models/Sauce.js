const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
 name : {type: String, required: true},
 manufacturer: {type: String, required: true},
 description: {type: String, required: true},
 mainPepper: {type: String, required: true},
 imageUrl: {type: String, required: true},
 heat: {type: Number, required: true},    
//  likes: {type: Number, required: false},  // en attebte de voir bon fonctionnement
//  dislikes: {type: Number, required: false},
//  userLiked: {type: ["String <userId>"], required: false},
//  userDisliked: {type: ["String <userId>"], required: false}
});

module.exports = mongoose.model('Sauce', sauceSchema);