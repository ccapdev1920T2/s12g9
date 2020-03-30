const express = require('express');
const router = express();
const userController = require('../controllers/userController.js')
// const { ObjectId } = require('mongodb');
const hbs = require('hbs');
// const nodemailer = require('nodemailer');

const notLoggedInUser = (req, res, next) => {
    if (!req.session.userId) {
        if (!req.session.adminId)
            return res.redirect('/signIn'); 
        else
            return res.redirect('/admin');
    } 
    return next();
};

hbs.registerHelper('ifCD', function(arg1, options) {
    if (arg1 == "Classic Deluxe"){
        return options.fn(this);
    }
    else return options.inverse(this);
});
hbs.registerHelper('ifFD', function(arg1, options) {
    if (arg1 == "Family Deluxe"){
        return options.fn(this);
    }
    else return options.inverse(this);
});
hbs.registerHelper('ifED', function(arg1, options) {
    if (arg1 == "Executive Deluxe"){
        return options.fn(this);
    }
    else return options.inverse(this);
});
hbs.registerHelper('ifJS', function(arg1, options) {
    if (arg1 == "Junior Suite"){
        return options.fn(this);
    }
    else return options.inverse(this);
});
hbs.registerHelper('ifES', function(arg1, options) {
    if (arg1 == "Executive Suite"){
        return options.fn(this);
    }
    else return options.inverse(this);
});
hbs.registerHelper('ifGS', function(arg1, options) {
    if (arg1 == "Grand Suite"){
        return options.fn(this);
    }
    else return options.inverse(this);
});

hbs.registerHelper('format', function(text) {
    return parseFloat(text).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});

router.get('/', notLoggedInUser,userController.getHome);
router.post('/', notLoggedInUser,userController.postCancel);

module.exports = router;