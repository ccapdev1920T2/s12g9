const express = require('express');

const router = express();

const paymentController = require('../controllers/paymentController.js')

//totalCharge
router.get('/',paymentController.viewTotalCharge);

router.get('/delete/:bookId',paymentController.backingTotalCharge);

router.post('/', paymentController.postTotalCharge);

router.get('/pay', paymentController.viewPaymentPage);

router.post('/pay', paymentController.postPayment);

//:bookId = means that the url of the website will be ending with the id in the databse
router.get('/billingDetails/:bookId', paymentController.viewBillingDetailsPage);

router.post('/billingDetails', paymentController.homePage);

router.get('/billingDetails', paymentController.homePage);

router.post('/billingDetails/:bookId',paymentController.postBillingDetails);

module.exports = router;