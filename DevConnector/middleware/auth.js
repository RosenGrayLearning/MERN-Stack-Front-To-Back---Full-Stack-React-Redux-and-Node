const jwt = require('jsonwebtoken'),
      config = require('config');

module.exports = (req,res,next) => {
    //Get token from the header
    const token = req.header('x-auth-token');
    //Check if no token
    if(!token){
        return res.status(401).json({msg:'No token, authorization denied'}); //Not Authorized
    }
    //Verify Token
    try {
        const decoded = jwt.verify(token,config.get('jwtSecret'));
        req.user = decoded.user;
        next();
    }catch(err){
        res.status(401).json({msg:'Token Is Not Valid'});
    }
}