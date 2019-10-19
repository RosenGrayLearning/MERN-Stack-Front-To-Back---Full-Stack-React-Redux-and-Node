const express = require('express'),
      router = express.Router();

/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Funtion} next 
 */

const posts = (req,res,next) => {
    res.send('Posts Route');
}
    

/**
 * @route       GET api/posts
 * @description Test Route
 * @access      Public
 */
router.get('/',posts);



module.exports = router;