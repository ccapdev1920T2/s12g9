const db = require('../models/db.js');
const { ObjectId } = require('mongodb');
const nodemailer = require('nodemailer');

const hashController = require('../controllers/hashController.js');

var totalChargeBody, lastname, firstname, emailglobe, database;
var payBody, cardowner, idBook, card, cardNum, databasepay;
var imagesource;


const paymentController = {
    viewTotalCharge: function(req, res) {

        var headertype = 'header';
        var footertype = 'footer';
        var totalChargetype = 'totalChargeGuest';
        var point = "";
        var bedOne = "Two Twin Beds";
        var bedTwo = "One King Bed"

        if (req.body.roomtype === 'Classic Deluxe') {
            bedOne = "Two Single Beds";
            bedTwo = "One Queen Bed";
        } else if (req.body.roomtype === 'Grand Suite') {
            bedOne = "Two Queen Beds";
            bedTwo = "One King Bed & One Single Bed";
        }

        // console.log(req.session.userId);
        if (req.session.userId) {
            headertype = 'headerUser';
            footertype = 'footerUser';
            totalChargetype = 'totalChargeUser';

            var userid = { _id: ObjectId(req.session.userId) }

            db.findOne('users',userid, function(resp){
                point = resp.membershipPoints;
                // console.log(point);
            });
        }

        if (req.session.adminId) {
            headertype = 'headerAdmin';
            footertype = 'footerAdmin';
        }

        if (firstname) {
            return res.render('totalCharge', {
                data: totalChargeBody,
                fnameError: firstname,
                source: '/images/Rooms/' + imagesource + '.jpg',
                whichheader: headertype,
                whichfooter: footertype,
                whichtotalCharge: totalChargetype,
                memberPoints: point,
                bedChoiceOne: bedOne,
                bedChoiceTwo: bedTwo
            });
        }

        else if (lastname) {
            return res.render('totalCharge', {
                data: totalChargeBody,
                lnameError: lastname,
                source: '/images/Rooms/' + imagesource + '.jpg',
                whichheader: headertype,
                whichfooter: footertype,
                whichtotalCharge: totalChargetype,
                memberPoints: point,
                bedChoiceOne: bedOne,
                bedChoiceTwo: bedTwo
            });
        }

        else if (emailglobe) {
            return res.render('totalCharge', {
                data: totalChargeBody,
                emailError: emailglobe,
                source: '/images/Rooms/' + imagesource + '.jpg',
                whichheader: headertype,
                whichfooter: footertype,
                whichtotalCharge: totalChargetype,
                memberPoints: point,
                bedChoiceOne: bedOne,
                bedChoiceTwo: bedTwo
            });
        }

        else if (database) {
            return res.render('totalCharge', {
                data: totalChargeBody,
                databaseError: database,
                source: '/images/Rooms/' + imagesource + '.jpg',
                whichheader: headertype,
                whichfooter: footertype,
                whichtotalCharge: totalChargetype,
                memberPoints: point,
                bedChoiceOne: bedOne,
                bedChoiceTwo: bedTwo
            });
        }

        else{
            return res.render('totalCharge', {
                data: totalChargeBody,
                source: '/images/Rooms/' + imagesource + '.jpg',
                whichheader: headertype,
                whichfooter: footertype,
                whichtotalCharge: totalChargetype,
                memberPoints: point,
                bedChoiceOne: bedOne,
                bedChoiceTwo: bedTwo
            });
        }
    },

    backingTotalCharge:  function(req, res) {
        var bookingid = { _id: ObjectId(req.params.bookId) };

        db.deleteOne('booking', bookingid, function (resp){
            return res.redirect('/totalCharge');
        });
    },

    postTotalCharge: function(req, res) {

        imagesource = req.body.roomtype;
        imagesource = imagesource.replace(/\s/g, '');

        var headertype = 'header';
        var footertype = 'footer';
        var totalChargetype = 'totalChargeGuest';
        var point = "";
        var bedOne = "Two Twin Beds";
        var bedTwo = "One King Bed"

        if (req.body.roomtype === 'Classic Deluxe') {
            bedOne = "Two Single Beds";
            bedTwo = "One Queen Bed";
        } else if (req.body.roomtype === 'Grand Suite') {
            bedOne = "Two Queen Beds";
            bedTwo = "One King Bed & One Single Bed";
        }

        if (req.session.userId) {
            headertype = 'headerUser';
            footertype = 'footerUser';
            totalChargetype = 'totalChargeUser';

            var userid = { _id: ObjectId(req.session.userId) }

            db.findOne('users', userid, function(resp){
                point = resp.membershipPoints;

                if (req.body.roomtype === 'Classic Deluxe') {

                    var checkBox = `
                        <div class="row pt-3">\
                            <div class="style">Use Points to Book Classic Deluxe</div>\
                        </div>\
                        <div class="row pt-2">\
                            <div class="subheader">You may either choose to pay or use points for this type of room.</div>\
                        </div>\
                        <div class="row">\
                            <img src="/images/AboutUs/MP.svg" width="97%" height="1%">\
                        </div>\
                        <div class="pb-3 ml-4">\
                            <input class="form-check-input pointfee" type="checkbox" name="classicDeluxe" onclick=calculatePoints() value="classicDeluxe">\
                            <label class="form-check-label" for="gridCheck1">\
                                Use Points (<span id="classicdeluxepoints">150000</span> points)\
                            </label>\
                        </div>\
                    `

                    return res.render('totalCharge', {
                        data: req.body,
                        source: '/images/Rooms/' + imagesource + '.jpg',
                        whichheader: headertype,
                        whichfooter: footertype,
                        whichtotalCharge: totalChargetype,
                        memberPoints: point.toString(),
                        checkboxDiv: checkBox,
                        bedChoiceOne: bedOne,
                        bedChoiceTwo: bedTwo

                    });
                } else {
                    return res.render('totalCharge', {
                        data: req.body,
                        source: '/images/Rooms/' + imagesource + '.jpg',
                        whichheader: headertype,
                        whichfooter: footertype,
                        whichtotalCharge: totalChargetype,
                        memberPoints: point.toString(),
                        bedChoiceOne: bedOne,
                        bedChoiceTwo: bedTwo
                    });
                }
            });
        }

        if (req.session.adminId) {
            headertype = 'headerAdmin';
            footertype = 'footerAdmin';
        }

        if (!req.session.userId)
            return res.render('totalCharge', {
                data: req.body,
                source: '/images/Rooms/' + imagesource + '.jpg',
                whichheader: headertype,
                whichfooter: footertype,
                whichtotalCharge: totalChargetype,
                memberPoints: point,
                bedChoiceOne: bedOne,
                bedChoiceTwo: bedTwo
            });
    },

    viewPaymentPage: function(req, res) {

        var loggingstring = `
        <li class="nav-item">\
            <a class="nav-link" href="/signUp">Be a Member</a>\
        </li>\
        <li class="nav-item">\
            <a class="nav-link" href="/signIn">Log In</a>\
        </li>\
        <li class="nav-item">\
            <a class="nav-link bookBtn" href="/" tabindex="-1" aria-disabled="true">BOOK NOW</a>\
        </li>\
        `
        var footertype = 'footer';

        if (req.session.userId) {
            loggingstring =
                `<li class="nav-item">\
                <a class="nav-link" href="/hotel/memberBenefits">Member Benefits</a>\
            </li>\
            <li class="nav-item">\
                <a class="nav-link" data-toggle="modal" data-target="#exampleModal">Log Out</a>\
            </li>\
            <li class="nav-item">\
                <a class="nav-link bookBtn" href="/user" tabindex="-1" aria-disabled="true">PROFILE</a>\
            </li>\
            `;
            footertype = 'footerUser';
        }

        if (req.session.adminId) {
            loggingstring =
                `<li class="nav-item">\
                <a class="nav-link" href="/hotel/memberBenefits">Member Benefits</a>\
            </li>\
            <li class="nav-item">\
                <a class="nav-link" data-toggle="modal" data-target="#exampleModal">Log Out</a>\
            </li>\
            <li class="nav-item">\
                <a class="nav-link bookBtn" href="/admin" tabindex="-1" aria-disabled="true">ADMIN</a>\
            </li>\
            `;
            footertype = 'footerAdmin';
        }

        if (cardowner) {
            return res.render('pay', {
                data: payBody,
                cardOwnerError: cardowner,
                bookingid: idBook,
                whichfooter: footertype,
                logging: loggingstring
            });
        }

        else if (card) {
            return res.render('pay', {
                data: payBody,
                cardError: card,
                bookingid: idBook,
                whichfooter: footertype,
                logging: loggingstring
            });
        }

        else if (cardNum) {
            return res.render('pay', {
                data: payBody,
                cardNumError: cardNum,
                bookingid: idBook,
                whichfooter: footertype,
                logging: loggingstring
            });
        }

        else if (databasepay) {
            return res.render('pay', {
                data: payBody,
                databaseError: databasepay,
                bookingid: idBook,
                whichfooter: footertype,
                logging: loggingstring
            });
        }

        else{
            return res.redirect('/');
        }

    },

    postPayment: function(req, res) {
        // console.log(req.body);    

        if (!req.session.userId) {
            let { fname, lname, email, total, checkInDate, checkOutDate, rooms, adults, kids, roomtype, pricePerRoom } = req.body;

            fname = fname.trim();
            lname = lname.trim();
            email = email.trim();

            lastname = "";
            firstname = "";
            emailglobe = "";
            database = "";

            if (req.body.requests === "" && req.body.additionalrequest === "")
                req.body.requests = req.body.bedtype;
            else if (req.body.requests === "")
                req.body.requests = req.body.additionalrequest + ", " + req.body.bedtype;
            else if (req.body.additionalrequest === "")
                req.body.requests = req.body.requests + ', ' + req.body.bedtype;
            else
                req.body.requests = req.body.requests + ', ' + req.body.additionalrequest + ", " + req.body.bedtype;

            // console.log('Hello');
            // console.log(req.body.requests);
            totalChargeBody = req.body;

            //TODO: retain select options in the future
            if (!fname) {
                firstname = '*Please fill up missing field';
                return res.status(401).redirect('/totalCharge');
            }

            if (!lname) {
                lastname = '*Please fill up missing field';
                return res.status(401).redirect('/totalCharge');
            }

            if (!email) {
                emailglobe = '*Please fill up missing field';
                return res.status(401).redirect('/totalCharge');
            }

            let emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

            // dfa validator
            if (!emailRegex.test(email)) {
                req.body.email = "";
                emailglobe = '*Email not valid';
                return res.status(401).redirect('/totalCharge');
            }

            var today = new Date();
            var formattedDate = today.getFullYear().toString() + '-' + (today.getMonth() + 1).toString().padStart(2, 0) + '-' + today.getDate().toString().padStart(2, 0);
            //TODO: pricePerRoom

            var reservation = {
                fname,
                lname,
                email,
                requests: req.body.requests,
                checkInDate,
                checkOutDate,
                rooms: parseInt(rooms),
                adults: parseInt(adults),
                kids: parseInt(kids),
                roomtype,
                pricePerRoom : parseFloat(pricePerRoom),
                bookingDate: formattedDate,
                status: "Booked",
                payment: {
                    total: parseFloat(total),
                    status: "Not Paid",
                    creditcardNumber: "",
                    creditcardOwner: "",
                    cvv: "",
                    cvvsalt: "",
                    ccprovider: "",
                    month: "",
                    year: ""
                }
            };

            var loggingstring = `
            <li class="nav-item">\
                <a class="nav-link" href="/signUp">Be a Member</a>\
            </li>\
            <li class="nav-item">\
                <a class="nav-link" href="/signIn">Log In</a>\
            </li>\
            <li class="nav-item">\
                <a class="nav-link bookBtn" href="/" tabindex="-1" aria-disabled="true">BOOK NOW</a>\
            </li>\
            `
            var footertype = 'footer';

            if (req.session.userId) {
                loggingstring =
                    `<li class="nav-item">\
                    <a class="nav-link" href="/hotel/memberBenefits">Member Benefits</a>\
                </li>\
                <li class="nav-item">\
                    <a class="nav-link" data-toggle="modal" data-target="#exampleModal">Log Out</a>\
                </li>\
                <li class="nav-item">\
                    <a class="nav-link bookBtn" href="/user" tabindex="-1" aria-disabled="true">PROFILE</a>\
                </li>\
                `;
                footertype = 'footerUser';
            }

            if (req.session.adminId) {
                loggingstring =
                    `<li class="nav-item">\
                    <a class="nav-link" href="/hotel/memberBenefits">Member Benefits</a>\
                </li>\
                <li class="nav-item">\
                    <a class="nav-link" data-toggle="modal" data-target="#exampleModal">Log Out</a>\
                </li>\
                <li class="nav-item">\
                    <a class="nav-link bookBtn" href="/admin" tabindex="-1" aria-disabled="true">ADMIN</a>\
                </li>\
                `;
                footertype = 'footerAdmin';
            }

            var useremail = {
                email
            }
            db.findOne('users', useremail, function (respuser){
                if (respuser === null) {
                    db.insertOne('booking', reservation, function (resp){
                            // console.log(resp);
                            // for debugging and for production
                            // return res.status(201).send('Good');
                            //Use to find in database
                        db.findOne('booking', reservation, function (respfind){
                            // console.log(resp._id);
                            return res.render('pay', {
                                bookingid: respfind._id,
                                whichfooter: footertype,
                                logging: loggingstring
                            });
                        });
                    });
                } else {
                    if (respuser.admin == false)
                        database = 'You are a registered member based on your email address. Please book using your account. Click here to <a href="/signIn">sign in</a>';
                    else
                        database = 'You are an admin. Please book using the admin account. Click here to <a href="/signIn">sign in</a>';
                    return res.status(500).redirect('/totalCharge');
                }
            });


        } else {
            let { total, checkInDate, checkOutDate, rooms, adults, kids, roomtype, pricePerRoom, points } = req.body;

            var today = new Date();
            var formattedDate = today.getFullYear().toString() + '-' + (today.getMonth() + 1).toString().padStart(2, 0) + '-' + today.getDate().toString().padStart(2, 0);

            if (req.body.requests === "" && req.body.additionalrequest === "")
                req.body.requests = req.body.bedtype;
            else if (req.body.requests === "")
                req.body.requests = req.body.additionalrequest + ", " + req.body.bedtype;
            else if (req.body.additionalrequest === "")
                req.body.requests = req.body.requests + ', ' + req.body.bedtype;
            else
                req.body.requests = req.body.requests + ', ' + req.body.additionalrequest + ", " + req.body.bedtype;

            var userID = { _id: ObjectId(req.session.userId) };

            db.findOne('users', userID, function (resp){
                var allpoints = resp.membershipPoints - parseInt(points);
                allpoints = allpoints + parseInt(total) * 0.10;
                var update = {
                    $set: {
                        'membershipPoints': parseInt(allpoints)
                    }
                }

                db.updateOne('users',userID, update, function(resppoints){
                    var reservationMember = {
                        fname: resp.fname,
                        lname: resp.lname,
                        email: resp.email,
                        requests: req.body.requests,
                        checkInDate,
                        checkOutDate,
                        rooms: parseInt(rooms),
                        adults: parseInt(adults),
                        kids: parseInt(kids),
                        roomtype,
                        pricePerRoom : parseFloat(pricePerRoom),
                        bookingDate: formattedDate,
                        status: "Booked",
                        payment: {
                            total: parseFloat(total),
                            status: "Paid",
                            creditcardNumber: resp.creditcardNumber,
                            creditcardOwner: resp.creditcardOwner,
                            cvv: resp.cvv,
                            cvvsalt: resp.cvvsalt,
                            ccprovider: resp.ccprovider,
                            month: resp.month,
                            year: resp.year
                        }
                    };

                    db.insertOne('booking', reservationMember, function (respbook){
                        db.findOne('booking', reservationMember, function(respfind){
                            var transporter = nodemailer.createTransport({
                                service: 'gmail',
                                secure: false, //true
                                port: 587,
                                pool: true,
                                auth: {
                                    user: 'paraisohotelscorp@gmail.com',
                                    pass: 'para1soHotels'
                                },
                                tls: {
                                    rejectUnauthorized: false
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
                                        <span style="font-size: 14px">Good day Paraiso Member <b>${respfind.fname} ${respfind.lname}</b>!</span><br><br>
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
                                        <span style="font-weight:600">Your Remaining Membership Points</span>: ${parseInt(allpoints)}<br>
                                        <br>
                                        If there are any problems, feel free to send us an email or go to our website: <a href="https://paraiso-hotel.herokuapp.com/aboutUs">(Contact Us)</a> and email us your concern.<br><br>
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

                            return res.redirect('/totalCharge/billingDetails/' + respfind._id);
                        });
                    });
                });
            });
        }
    },

    viewBillingDetailsPage: function(req, res) {
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

        var bookingid = { _id: ObjectId(req.params.bookId) };
        // console.log(req.params.bookId);

        db.findOne('booking', bookingid, function(resp){
                // console.log(resp);
            var imagesource = resp.roomtype;
            imagesource = imagesource.replace(/\s/g, '');
            return res.render('billingDetails', {
                data: resp,
                source: '/images/Rooms/' + imagesource + '.jpg',
                whichfooter: footertype,
                whichheader: headertype,
                TOTAL: resp.payment.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            })
        });
    },

    homePage : function(req, res) {
        return res.redirect('/');
    },

    postBillingDetails :  function(req, res) {
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

        var bookingid = { _id: ObjectId(req.params.bookId) }; //use to find the id in the database, (const { ObjectId } = require

        var hashcvv = hashController.saltHashPassword(cvv);
        var update = {
            $set: {
                'payment.status': 'Paid',
                'payment.cvv': hashcvv[0],
                'payment.cvvsalt': hashcvv[1],
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
        db.updateOne('booking', bookingid, update, function(resp){
            // console.log(resp);
            db.findOne('booking', bookingid, function (respfind){
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
                            If there are any problems, feel free to send us an email or go to our website: <a href="https://paraiso-hotel.herokuapp.com/aboutUs">(Contact Us)</a> and email us your concern.<br><br>
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
            });
        });
 
    }
}

module.exports = paymentController;