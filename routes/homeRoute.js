const express = require('express');
const router = express();

const homeController = require('../controllers/homeController.js')

router.get('/logout', homeController.notLoggedIn, homeController.loggedout);

router.get('/', homeController.viewHomePage);

router.get('/viewRooms', homeController.viewAvailableRoomsPage);

router.post('/viewRooms', homeController.viewAvailableRooms);

router.get('/aboutUs', homeController.viewAboutUs);

router.get('/signIn', homeController.loggedIn, homeController.viewSignInPage);

router.post('/signIn', homeController.userSignIn);

router.get('/signUp', homeController.loggedIn, homeController.viewSignUpPage);

router.post('/signUp', homeController.userSignUp);

router.get('/verify', homeController.loggedIn, homeController.verificationInput);

router.post('/verify', homeController.verificationKey);

router.get('/checkOutDate', homeController.checkOutDate);

router.get('/checkInDate', homeController.checkInDate);

module.exports = router;