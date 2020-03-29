const express = require('express');
const router = express();
const userController = require('../controllers/userController.js')
const { ObjectId } = require('mongodb');
const hbs = require('hbs');
const nodemailer = require('nodemailer');

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