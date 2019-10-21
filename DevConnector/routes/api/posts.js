const express = require('express'),
      router = express.Router(),
      {check,validationResult} = require('express-validator'),
      auth = require('../../middleware/auth'),
      User = require('../../models/User'),
      Profile = require('../../models/Profile'),
      Post = require('../../models/Post');


/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Funtion} next 
 */

//Controllers
const createPostController = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    try {
        const user = await User.findById(req.user.id).select('-password'),
        newPost = {
            text : req.body.text,
            name : user.name,
            avatar : user.avatar,
            user : req.user.id
        };  
        const post = await new Post(newPost);
        await post.save();
        res.json(post);

        
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
const getAllPostsController = async (req,res,next) => {
    try {
        const posts = await Post.find().sort({date:-1});
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
    
const getPostByIdController = async (req,res,next) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg:'Post Not Found'});
        }
        res.json(post);
    } catch (error) {
        console.error(error);
        if(error.kind === 'ObjectId'){
            return res.status(404).json({msg:'Post Not Found'});
        }
        res.status(500).send('Server Error');
    }
};
const deletePostByIdController = async (req,res,next) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg:'Post Not Found'});
        }
        //Check If User Is The owner Of The Post
        if(post.user.toString() !== req.user.id){
            return res.status(401).json({msg:'User not Authorized'});
        }
        await post.remove();
        res.json({msg:'Post Removed'});
    } catch (error) {
        console.error(error);
        if(error.kind === 'ObjectId'){
            return res.status(404).json({msg:'Post Not Found'});
        }
        res.status(500).send('Server Error');
    }
};
    


//Validators
const createPostValidator = [
    check('text','Text Is Required').not().isEmpty()
];




//Routes

/**
 * @route       POST api/posts
 * @description Create a post
 * @access      Private
 */
router.post('/',[auth,createPostValidator],createPostController);

/**
 * @route       GET api/posts
 * @description GET all posts
 * @access      Private
 */
router.get('/',auth,getAllPostsController);

/**
 * @route       GET api/posts/:id
 * @description Get post by id
 * @access      Private
 */
router.get('/:id',auth,getPostByIdController);

/**
 * @route       DELETE api/posts/:id
 * @description Delete a post by id
 * @access      Private
 */
router.delete('/:id',auth,deletePostByIdController);




module.exports = router;