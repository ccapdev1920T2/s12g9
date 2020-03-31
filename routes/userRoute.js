const express = require('express');
const router = express();
const userController = require('../controllers/userController.js');
const hbs = require('hbs');

//TODO: move to controller
const notLoggedInUser = (req, res, next) => {
    if (!req.session.userId) {
        if (!req.session.adminId)
            return res.redirect('/signIn'); 
        else
            return res.redirect('/admin');
    } 
    return next();
};

router.get('/', notLoggedInUser,userController.getHome);
router.post('/', notLoggedInUser,userController.postCancel);

module.exports = router;