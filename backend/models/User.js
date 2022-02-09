const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // nous aide a controler un seul Email

const userSchema = mongoose.Schema ({
  email: {type: String, required: true, unique: true}, // rappel ici unique est important pour qu'un seul mail soit possibler pour toute la base de donnée
  password: {type: String, required: true}
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);