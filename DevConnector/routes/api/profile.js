const express = require('express'),
      router = express.Router(),
      auth = require('../../middleware/auth'),
      helpers = require('../../helpers/helpers'),
      Profile = require('../../models/Profile'),
      User = require('../../models/User');
      
    
/**
 * @param {Object} req 
 * @param {Object} res 
 * @param {Funtion} next 
 */

 const getProfileController = async (req,res,next) => {
     console.log('this is userid',req.user.id);
     try{
        const profile = await Profile.findOne({user:req.user.id})
                                     .populate('user',['name','avatar']);
       if(!profile){
           return res.status(400).json({msg:'There is no profile for this user!'});
       }
       res.json(profile);
     }catch(err){
        helpers.sendServerError500(err,res);
     }
 }

/**
 * @route       GET api/profile/me
 * @description Get current users profile
 * @access      Private
 */
router.get('/me',auth,getProfileController);


module.exports = router;