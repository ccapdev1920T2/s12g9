const express = require('express');
const router = express();


const adminController = require('../controllers/adminController.js');

router.get('/', adminController.notLoggedInAdmin, adminController.viewAdminPage);

//FOR CLEANILESS OF WEBSITE ONLY
router.get('/customerDetails', adminController.cleanWebiste);

router.get('/customerDetails/:bookid', adminController.notLoggedInAdmin, adminController.viewCustomerDetails);

router.post('/customerDetails/:bookid', adminController.notLoggedInAdmin, adminController.postCustomerDetails);

router.get('/reactivate', adminController.cleanWebiste);

router.get('/reactivate/:userid',adminController.notLoggedInAdmin, adminController.viewReactivatePage);

router.post('/reactivate/:userid', adminController.notLoggedInAdmin, adminController.postReactivatePage);

module.exports = router;