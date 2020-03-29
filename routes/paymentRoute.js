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

    router.post('/billingDetails/:bookId', function(req, res) {
        // console.log(req.body);    
        let { owner, cvv, cardNumber, month, year, ccprovider } = req.body;

        cardowner = "";
        card = "";
        cardNum = "";
        databasepay = "";
        idBook = req.params.bookId
        payBody = req.body;

        owner = owner.trim();
        cvv = cvv.trim();
        cardNumber = cardNumber.trim();

        if (!owner) {
            cardowner = '*Please fill up missing field';
            return res.status(401).redirect('/totalCharge/pay');
        }

        if (!cvv) {
            card = '*Please fill up missing field';
            return res.status(401).redirect('/totalCharge/pay');
        }

        if (!cardNumber) {
            cardNum = '*Please fill up missing field';
            return res.status(401).redirect('/totalCharge/pay');
        }

        if (cvv.length != 3){
            card = '*CVV number invalid format';
            return res.status(401).redirect('/totalCharge/pay');
        }

        if (cardNumber.length < 13 || cardNumber.length > 16) {
            cardNum = '*Credit card number invalid format';
            return res.status(401).redirect('/totalCharge/pay');
        }

        var today = new Date();
        var monthToday = today.getMonth() + 1;
        var yearToday = today.getFullYear();
        yearToday = yearToday.toString();
        yearToday = yearToday.substring(yearToday.length - 2, yearToday.length);


        if (parseInt(year) == parseInt(yearToday)) {
            if (parseInt(month) <= monthToday) {
                databasepay = '*Card is not accepted because of the expiration date';
                return res.status(500).redirect('/totalCharge/pay');
            }
        }

        var bookingid = { _id: ObjectId(req.params.bookId) }; //use to find the id in the database, (const { ObjectId } = require('mongodb'); is needed on top of this file)
        var update = {
            $set: {
                'payment.status': 'Paid',
                'payment.cvv': cvv,
                'payment.creditcardOwner': owner,
                'payment.creditcardNumber': cardNumber,
                'payment.ccprovider': ccprovider,
                'payment.month': month,
                'payment.year': year
            }
        };

        var headertype = 'header';
        var footertype = 'footer';

        if (req.session.userId) {
            headertype = 'headerUser';
            footertype = 'footerUser';
        }

        if (req.session.adminId) {
            headertype = 'headerAdmin';
            footertype = 'footerAdmin';
        }

        //updating the collection of booking
        db.collection('booking').updateOne(bookingid, update)
            .then(resp => {
                // console.log(resp);

                db.collection('booking').findOne(bookingid)
                    .then(respfind => {
                        var imagesource = respfind.roomtype;
                        imagesource = imagesource.replace(/\s/g, '');

                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            secure: false, //true
                            port: 587,
                            pool: true,
                            tls: {
                                rejectUnauthorized: false
                            },
                            auth: {
                                user: 'paraisohotelscorp@gmail.com',
                                pass: 'para1soHotels'
                            }
                        });

                        var months = ["January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"
                        ];

                        var cardmonth = parseInt(respfind.payment.month) - 1;
                        cardmonth = months[cardmonth];

                        var addrequests;

                        if (respfind.requests === "")
                            addrequests = 'None';
                        else
                            addrequests = respfind.requests;

                        var mailOptions = {
                            from: 'Paraiso Hotel', // sender address
                            to: respfind.email, // list of receivers
                            subject: 'Paraiso Hotel Reservation Details [BOOKING ID: ' + respfind._id + ']',
                            html: `
                                <head>
                                <link href="https://fonts.googleapis.com/css?family=Open+Sans:200,300,400,500,600,700,800,900&display=swap" rel="stylesheet">
                                
                                </head>
                                <p style="font-family: 'Open Sans'; letter-spacing: 1px; color: #2E4106; font-size:12px;">
                                    <span style="font-size: 14px">Good day <b>${respfind.fname} ${respfind.lname}</b>!</span><br><br>
                                    Thank you for booking in our hotel.<br><br>
                                    This is your <b>booking details</b>.<br>
                                    <br>
                                    <span style="font-weight:600">Your Check-In Date</span>: ${respfind.checkInDate}<br>
                                    <span style="font-weight:600">Your Check-Out Date</span>: ${respfind.checkOutDate}<br>
                                    <span style="font-weight:600">Type of Room</span>: ${respfind.roomtype}<br>
                                    <span style="font-weight:600">Number of Room/s</span>: ${respfind.rooms}<br>
                                    <span style="font-weight:600">Number of Adult/s</span>: ${respfind.adults}<br>
                                    <span style="font-weight:600">Number of Kid/s</span>: ${respfind.kids}<br>
                                    <span style="font-weight:600">Requests</span>: ${addrequests}<br>
                                    <br>
                                    Here is your <b>payment details</b>.<br><br>
                                    <span style="font-weight:600">Total Amount</span>: PHP ${respfind.payment.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}<br><br>
                                    Paid using credit card:<br>
                                    <span style="font-weight:600">Credit Card Owner</span>: ${respfind.payment.creditcardOwner}<br>
                                    <span style="font-weight:600">Credit Card Number</span>: ${respfind.payment.creditcardNumber}<br>
                                    <span style="font-weight:600">Credit Card Provider</span>: ${respfind.payment.ccprovider}<br>
                                    <span style="font-weight:600">Credit Card Expiry Date</span>: ${cardmonth}  20${respfind.payment.year}<br>
                                    <br>
                                    If there are any problems, feel free to send us an email or go to our website: <a href="http://localhost:3000/aboutUs">(Contact Us)</a> and email us your concern.<br><br>
                                    We hope to see you on ${respfind.checkInDate}, and enjoy the amenities and services of Paraiso Hotel. <br>Have a good day!<br>
                                    <br>
                                    Best Regards,<br>
                                    <b>Paraiso Hotel<br>
                                </p>
                                `
                        };

                        transporter.sendMail(mailOptions, (error, response) => {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email Sent Successfully!');
                                // console.log(response);
                            }
                            transporter.close();
                        })


                        return res.render('billingDetails', {
                            data: respfind,
                            source: '/images/Rooms/' + imagesource + '.jpg',
                            whichfooter: footertype,
                            whichheader: headertype,
                            TOTAL: respfind.payment.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        })

                    }).catch(errfind => {
                        console.log(errfind);
                        database = '*Bad Server';
                        return res.status(500).redirect('/totalCharge/pay');
                    });
            }).catch(err => {
                console.log(err);
                database = '*Bad Server';
                return res.status(500).redirect('/totalCharge/pay');
            });
    });

module.exports = router;