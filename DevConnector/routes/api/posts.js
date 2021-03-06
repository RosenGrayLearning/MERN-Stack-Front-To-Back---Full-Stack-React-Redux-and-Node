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
const putLikePostController = async (req,res,next) => {
    try {
        const post = await Post.findById(req.params.id);
        //Check if the post has already been liked by the user
        if(post.likes.filter(like=> like.user.toString() === req.user.id).length > 0){
            return res.status(400).json({msg:'Post already liked'});
        }
        post.likes.unshift({user:req.user.id});
        await post.save();
        res.json(post.likes);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error'); 
    }
};
const putUnLikePostController = async (req,res,next) => {
    try {
        const post = await Post.findById(req.params.id);
        //Check if the post has already been liked by the user
        if(post.likes.filter(like=> like.user.toString() === req.user.id).length === 0){
            return res.status(400).json({msg:'Post has not yet been liked'});
        }
        //Get remove index
        const removeIndex = post.likes.map(like=> like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex,1);
        await post.save();
        res.json(post.likes);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error'); 
    }
};   
const createCommentPostController = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    try {
        const user = await User.findById(req.user.id).select('-password'),
              post = await Post.findById(req.params.id),
        NewComment = {
            text : req.body.text,
            name : user.name,
            avatar : user.avatar,
            user : req.user.id
        };  
        post.comments.unshift(NewComment);
        await post.save();
        res.json(post.comments);

        
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

const deleteCommentPostController = async (req,res,next) => {
    try {
        const post  = await Post.findById(req.params.post_id);
        //Pull out comment from the post
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);
        //Make sure comment exists
        if(!comment){
            return res.status(404).json({msg:'Comment Does not Exists'});
        }
        //Check User
        if(comment.user.toString() !== req.user.id){
            return res.status(404).json({msg:'User Not Authorized'});
        }
        //Get remove index
        const removeIndex = post.comments.map(comment=> comment.user.toString()).indexOf(req.user.id);
        post.comments.splice(removeIndex,1);
        await post.save();
        res.json(post.comments);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

//Validators
const createPostValidator = [
    check('text','Text Is Required').not().isEmpty()
];
const createCommentPostValidator = [
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

/**
 * @route       PUt api/posts/like/:id
 * @description Like a post
 * @access      Private
 */
router.put('/like/:id',auth,putLikePostController);

/**
 * @route       PUt api/posts/unlike/:id
 * @description Unike a post
 * @access      Private
 */
router.put('/unlike/:id',auth,putUnLikePostController);

/**
 * @route       POST api/posts/comment/:id
 * @description comment on a post
 * @access      Private
 */
router.post('/comment/:id',[auth,createCommentPostValidator],createCommentPostController);


/**
 * @route       DELETE api/posts/comment/:post_id/:comment_id
 * @description delete a comment from  post
 * @access      Private
 */
router.delete('/comment/:post_id/:comment_id',auth,deleteCommentPostController);




module.exports = router;