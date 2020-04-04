const express = require('express');
const router = express();
const userController = require('../controllers/userController.js');

router.get('/', userController.notLoggedInUser,userController.getHome);
router.post('/', userController.notLoggedInUser,userController.postCancel);

module.exports = router;
