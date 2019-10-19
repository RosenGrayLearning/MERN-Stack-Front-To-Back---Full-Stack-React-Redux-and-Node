const express = require('express'),
      router = express.Router(),
      gravatar = require('gravatar'),
      bcrypt = require('bcryptjs'),
      jwt = require('jsonwebtoken'),
      config = require('config'),
      {check,validationResult} = require('express-validator'),
      User = require('./../../models/User');

/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Funtion} next 
 */

const postUsersController = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array()
        });
    } 
    const {name,email,password} = req.body;  

    try{
      //See if user exists
      let user = await User.findOne({email});

      if(user){
          return res.status(400).json({
              errors:[{msg:'User Already Exists'}]
          })
      }
     // Get users gravatar
     const avatar = gravatar.url(email,{
         s:'200',
         r:'pg',
         d:'mm'
     });
     //The user does not exists - lets create it 
     user = new User({
         name,
         email,
         password,
         avatar,
     });


    // Encrypt password using bcrypt
     const salt = await bcrypt.genSalt(10);
     user.password = await bcrypt.hash(password,salt);
    // Saving The User To Db
    await user.save();
    // Return the jsonwebtoken
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

const postUsersValidator = [
    check('name','Name is required').not().isEmpty(),
    check('email','Please Include A Valid Email').isEmail(),
    check('password','Please Enter A Password with 6 or more characters').isLength({min:6})
];

/**
 * @route       POST api/users
 * @description Register User
 * @access      Public
 */


router.post('/',postUsersValidator,postUsersController);


module.exports = router;