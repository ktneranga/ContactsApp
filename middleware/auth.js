//as soon as the endpoint hit the middleware fire off
const jwt = require('jsonwebtoken'); // to verify the token
const config = require('config'); // to get the secret

module.exports = function(req, res, next){
    //get the token from the header
    const token = req.header('x-auth-token');

    //check if not token
    if(!token){
        return res.status(401).json({msg : 'No token, authorization denied'});
    }

    //if there is the token
    try{
        const decoded = jwt.verify(token, config.get('jwtSecret')); //once it decoded payload will assign to the decoded / pullout the payload from the token
        // const payload = {
        //     user : {
        //        id : user.id //take the id of newly registered user
        //     }
        //  }
        req.user = decoded.user;
        next();
    }catch(err){
        res.status(401).json({msg : 'Token is not valid'});
    }

}