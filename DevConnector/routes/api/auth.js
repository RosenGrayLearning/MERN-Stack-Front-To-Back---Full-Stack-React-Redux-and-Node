const express = require('express'),
      router = express.Router(),
      auth = require('./../../middleware/auth'),
      User = require('../../models/User'),
      bcrypt = require('bcryptjs'),
      jwt = require('jsonwebtoken'),
      config = require('config'),
      {check,validationResult} = require('express-validator');

/**
 * @param {Object} req 
 * @param {Object} res 
 * @param {Funtion} next 
 */

 const getAuthController = async (req,res,next) => {
     try{
         const user = await User.findById(req.user.id).select('-password');
         res.json(user);
     }catch(err){
         console.error(err.message);
         res.status(500).send('Server Error');
     }
 }
 const postAuthLoginController = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array()
        });
    } 
    const {email,password} = req.body;  

    try{
      //See if user exists
      let user = await User.findOne({email});

      if(!user){
          return res.status(400).json({
              errors:[{msg:'Invalid Credentials'}]
          });
      }
    //Compare entered password with the existing encrypted user password
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400).json({
            errors:[{msg:'Invalid Credentials'}]
        });
    }
    // User is matched --> Return the jsonwebtoken
    const payload = {
        user : {
            id: user.id
        }
    },
    secret = config.get('jwtSecret');
    jwt.sign(payload,
             secret,
             {expiresIn:3600000},
             (err,token)=>{
                 if(err) throw err;
                 res.json({token});
             });
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
}



//Validators
const postAuthLoginValidator = [
    check('email','Please Include A Valid Email').isEmail(),
    check('password','Password is required').exists()
];






/**
 * @route       GET api/auth
 * @description Auth Route
 * @access      Public
 */
router.get('/',auth,getAuthController);

/**
 * @route       POST api/auth
 * @description Auth User & get token
 * @access      Public
 */

router.post('/',postAuthLoginValidator,postAuthLoginController);



module.exports = router;