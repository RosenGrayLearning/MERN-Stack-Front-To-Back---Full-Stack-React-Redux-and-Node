const express = require('express'),
      router = express.Router();

/**
 * @route       GET api/profile
 * @description Test Route
 * @access      Public
 */
router.get('/',(req,res,next) => {
    res.send('Profile Route');
});


module.exports = router;