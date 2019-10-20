const express = require('express'),
      router = express.Router(),
      auth = require('../../middleware/auth'),
      helpers = require('../../helpers/helpers'),
      Profile = require('../../models/Profile'),
      {check,validationResult} = require('express-validator'),
      User = require('../../models/User');
      
    
/**
 * @param {Object} req 
 * @param {Object} res 
 * @param {Funtion} next 
 */

 const getProfileController = async (req,res,next) => {

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
 const postProfileController = async (req,res,next) => {
     const errors = validationResult(req);
     if(!errors.isEmpty()){
         return res.status(400).json({errors:errors.array()});
     }
    const {company,website,location,bio,status,
           githubusername,skills,youtube,facebook,
            twitter,instagram,linkedin} = req.body;
    //Build Profile Object
    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    //Build social object
    profileFields.social = {};
    if(youtube) profileFields.social.youtube = youtube;
    if(twitter) profileFields.social.twitter = twitter;
    if(facebook) profileFields.social.facebook = facebook;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(instagram) profileFields.social.instagram = instagram;

    try {
        let profile = await Profile.findOne({user:req.user.id});
        if(profile){
            //Update
            profile = await Profile.findOneAndUpdate(
                {user:req.user.id},
                {$set:profileFields},
                {new:true}
            );
         return res.json(profile);
        }
        //Create
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);
    }catch(err){
        helpers.sendServerError500(err,res);
    }
 }
 const getAllProfileController = async (req,res,next) => {
     try {
         const profiles = await Profile.find().populate('user',['name','avatar']);
         res.json(profiles);
     } catch (err) {
        helpers.sendServerError500(err,res);
     }
 }
 const getAProfileByUserIdController = async (req,res,next) => {
    try {
        const profile = await Profile.findOne({user:req.params.user_id});//.populate('user',['name','avatar']);
        if(!profile) return res.status(400).json({msg:'Profile Not Found'});
        res.json(profile);
    } catch (err) {
        if(err.kind=='ObjectId'){
            return res.status(400).json({msg:'Profile Not Found'});
        }
       helpers.sendServerError500(err,res);
    }
}
 const deleteProfileUserAndPostsController = async (req,res,next) => {
    try {
        //@todo - remove users posts
        //Remove Profile
        await Profile.findOneAndRemove({user:req.user.id});
        //Remove User
        await User.findOneAndRemove({_id:req.user.id});
        res.json({msg:'User deleted'});
    } catch (err) {
       helpers.sendServerError500(err,res);
    }
}
const putProfileExperienceController =  async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {title,company,location,from,to,current,description} = req.body,
           newExp = {
               title,
               company,
               location,
               from,
               to,
               current,
               description
           };
    try {
        const profile = await Profile.findOne({user:req.user.id});
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
    } catch (err) {
        helpers.sendServerError500(err,res);
    }

}
const deleteProfileExperienceController =  async (req,res,next) => {
    try {
        const profile = await Profile.findOne({user:req.user.id});
        //Get remove index
        const removeIndex = profile.experience.map(item=>item.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex,1);
        await profile.save();
        res.json(profile);
    } catch (err) {
        helpers.sendServerError500(err,res);
    }
}
const putProfileEducationController =  async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {school,degree,fieldofstudy,from,to,current,description} = req.body,
           newEdu = {
              school,
              degree,
              fieldofstudy,
               from,
               to,
               current,
               description
           };
    try {
        const profile = await Profile.findOne({user:req.user.id});
        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile);
    } catch (err) {
        helpers.sendServerError500(err,res);
    }

}
const deleteProfileEducationController =  async (req,res,next) => {
    try {
        const profile = await Profile.findOne({user:req.user.id});
        //Get remove index
        const removeIndex = profile.education.map(item=>item.id).indexOf(req.params.edu_id);
        profile.education.splice(removeIndex,1);
        await profile.save();
        res.json(profile);
    } catch (err) {
        helpers.sendServerError500(err,res);
    }
}



 //Validators
 const postProfileValidator = [
    check('status','Status is required').not().isEmpty(),
    check('skills','Skills are required').not().isEmpty()
 ];

 const putProfileExperienceValidator = [
     check('title','Title is required').not().isEmpty(),
     check('company','Company is required').not().isEmpty(),
     check('from','From Date is required').not().isEmpty()
 ];
 const putProfileEducationValidator = [
    check('school','School is required').not().isEmpty(),
    check('degree','Degree is required').not().isEmpty(),
    check('fieldofstudy','Field of study is required').not().isEmpty(),
    check('from','From Date is required').not().isEmpty()
];

/**
 * @route       GET api/profile/me
 * @description Get current users profile
 * @access      Private
 */
router.get('/me',auth,getProfileController);

/**
 * @route       POST api/profile
 * @description Create or update the user profile
 * @access      Private
 */
router.post('/',[auth,postProfileValidator],postProfileController);

/**
 * @route       GET api/profile
 * @description Get all profileas
 * @access      Public
 */
router.get('/',getAllProfileController);


/**
 * @route       GET api/profile/user/:user_id
 * @description Get Profile By user id
 * @access      Public
 */
router.get('/user/:user_id',getAProfileByUserIdController);

/**
 * @route       DELETE api/profile/
 * @description Get Profile , user & posts
 * @access      Private
 */
router.delete('/',auth,deleteProfileUserAndPostsController);

/**
 * @route       PUT api/profile/experience
 * @description Add profile experience
 * @access      Private
 */
router.put('/experience',[auth,putProfileExperienceValidator],putProfileExperienceController);

/**
 * @route       DELETE api/profile/experience/:exp_id
 * @description Delete experiance from profile
 * @access      Private
 */
router.delete('/experience/:exp_id',auth,deleteProfileExperienceController);

/**
 * @route       PUT api/profile/education
 * @description Add profile education
 * @access      Private
 */
router.put('/education',[auth,putProfileEducationValidator],putProfileEducationController);

/**
 * @route       DELETE api/profile/education/:edu_id
 * @description Delete education from profile
 * @access      Private
 */
router.delete('/education/:edu_id',auth,deleteProfileEducationController);


module.exports = router;