const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try{
    const token = req.headers.authorization.split(' ')[1]; // on connait le format grace a la requete fait au serveur on connai ce qu'il renvoit // ici ' ' mais dans d'autre peu etre par ex: ':' '='
    console.log('la clé est :', token); //TEST 
    const decodedToken = jwt.verify(token, 'NO_OFFICIAL_TOKEN');
    const userId = decodedToken.userId;
    req.auth = { userId }; // rappel si une clé a la meme valeur que sa variable {userId: userId} == {userId}
    if(req.body.userId && req.body.userId !== userId){
      throw 'User Id non Valable !';
    }
    else{
      next(); // on passe au prochain middleware dans notre route
    }
  }
  catch(error){
    res.status(401).json({ error : error | 'requête non authentifiée !'})
  };
}