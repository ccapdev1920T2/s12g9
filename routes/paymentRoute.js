const express = require('express');
const router = express();
const { ObjectId } = require('mongodb');
var totalChargeBody, lastname, firstname, emailglobe, database;
var payBody, cardowner, idBook, card, cardNum, databasepay;
var imagesource;

//totalCharge
const routerFunction = function(db) {
    router.get('/', function(req, res) {

        var headertype = 'header';
        var footertype = 'footer';
        var totalChargetype = 'totalChargeGuest';
        var point ="";

        // console.log(req.session.userId);
        if (req.session.userId){
            headertype = 'headerUser';
            footertype = 'footerUser';
            totalChargetype = 'totalChargeUser';

            var userid = {_id: ObjectId(req.session.userId)}

            db.collection('users').findOne(userid)
                .then(res => {
                    point = res.membershipPoints;
                    console.log(point);
                }).catch (err => {
                    console.log(err);
                })
        }

        if (req.session.adminId){
            headertype = 'headerAdmin';
            footertype = 'footerAdmin';
        }

        if (firstname){
            res.render('totalCharge',{
                data: totalChargeBody,
                fnameError: firstname,
                source: '/images/Rooms/'+ imagesource + '.jpg',
                whichheader: headertype,
                whichfooter: footertype,
                whichtotalCharge: totalChargetype,
                memberPoints: point
            });
        }

        if (lastname){
            res.render('totalCharge',{
                data: totalChargeBody,
                lnameError: lastname,
                source: '/images/Rooms/'+ imagesource + '.jpg',
                whichheader: headertype,
                whichfooter: footertype,
                whichtotalCharge: totalChargetype,
                memberPoints: point
            });
        }

        if (emailglobe){
            res.render('totalCharge',{
                data: totalChargeBody,
                emailError: emailglobe,
                source: '/images/Rooms/'+ imagesource + '.jpg',
                whichheader: headertype,
                whichfooter: footertype,
                whichtotalCharge: totalChargetype,
                memberPoints: point
            });
        }

        if (database){
            res.render('totalCharge',{
                data: totalChargeBody,
                databaseError: emailglobe,
                source: '/images/Rooms/'+ imagesource + '.jpg',
                whichheader: headertype,
                whichfooter: footertype,
                whichtotalCharge: totalChargetype,
                memberPoints: point
            });
        }
    });

    router.post('/', function(req, res){

        imagesource = req.body.roomtype;
        imagesource = imagesource.replace(/\s/g,'');

        var headertype = 'header';
        var footertype = 'footer';
        var totalChargetype = 'totalChargeGuest';
        var point ="";

        if (req.session.userId){
            headertype = 'headerUser';
            footertype = 'footerUser';
            totalChargetype = 'totalChargeUser';

            var userid = {_id: ObjectId(req.session.userId)}

            db.collection('users').findOne(userid)
                .then(resp => {
                    point = resp.membershipPoints;
                    return res.render('totalCharge', {
                        data: req.body,
                        source: '/images/Rooms/'+ imagesource + '.jpg',
                        whichheader:  headertype,
                        whichfooter: footertype,
                        whichtotalCharge: totalChargetype,
                        memberPoints: point.toString()
                    }); 
                }).catch (err => {
                    console.log(err);
                })
        }

        if (req.session.adminId){
            headertype = 'headerAdmin';
            footertype = 'footerAdmin';
        }

        if (!req.session.userId)
            res.render('totalCharge', {
                data: req.body,
                source: '/images/Rooms/'+ imagesource + '.jpg',
                whichheader:  headertype,
                whichfooter: footertype,
                whichtotalCharge: totalChargetype,
                memberPoints: point
            }); 
    });
   
    router.get('/pay', function(req, res) {

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

        if (req.session.userId){
            loggingstring = 
            `<li class="nav-item">\
                <a class="nav-link" href="/hotel/memberBenefits">Member Benefits</a>\
            </li>\
            <li class="nav-item">\
                <a class="nav-link" href="/logout">Log Out</a>\
            </li>\
            <li class="nav-item">\
                <a class="nav-link bookBtn" href="/user" tabindex="-1" aria-disabled="true">PROFILE</a>\
            </li>\
            `;
            footertype = 'footerUser';
        }

        if (req.session.adminId){
            loggingstring = 
            `<li class="nav-item">\
                <a class="nav-link" href="/hotel/memberBenefits">Member Benefits</a>\
            </li>\
            <li class="nav-item">\
                <a class="nav-link" href="/logout">Log Out</a>\
            </li>\
            <li class="nav-item">\
                <a class="nav-link bookBtn" href="/admin" tabindex="-1" aria-disabled="true">ADMIN</a>\
            </li>\
            `;
            footertype = 'footerAdmin';
        }

        if (cardowner){
            res.render('pay',{
                data: payBody,
                cardOwnerError: cardowner,
                bookingid: idBook,
                whichfooter: footertype,
                logging: loggingstring
            });
        }

        if (card){
            res.render('pay',{
                data: payBody,
                cardError: card,
                bookingid: idBook,
                whichfooter: footertype,
                logging: loggingstring
            });
        }

        if (cardNum){
            res.render('pay',{
                data: payBody,
                cardNumError: cardNum,
                bookingid: idBook,
                whichfooter: footertype,
                logging: loggingstring
            });
        }

        if (databasepay){
            res.render('pay',{
                data: payBody,
                databaseError: databasepay,
                bookingid: idBook,
                whichfooter: footertype,
                logging: loggingstring
            });
        }

    });

    router.post('/pay',function(req, res){
        // console.log(req.body);    
        let { fname, lname, email, total, requests, checkInDate, checkOutDate, rooms, adults, kids, roomtype, pricePerRoom} = req.body;

        fname = fname.trim();
        lname = lname.trim();
        email = email.trim();

        lastname="";
        firstname="";
        emailglobe="";
        database="";

        if (req.body.requests === "")
            req.body.requests = req.body.additionalrequest;
        else 
            req.body.requests = req.body.requests +', ' + req.body.additionalrequest;

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
        
        var reservation = {
            fname,
            lname,
            email, 
            requests: req.body.requests,
            checkInDate, 
            checkOutDate, 
            rooms, 
            adults, 
            kids, 
            roomtype, 
            pricePerRoom,
            bookingDate: formattedDate,
            status: "Booked",
            payment: {
                total, 
                status: "Not Paid",
                creditcardNumber : "",
                creditcardOwner : "",
                cvv: "",
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

        if (req.session.userId){
            loggingstring = 
            `<li class="nav-item">\
                <a class="nav-link" href="/hotel/memberBenefits">Member Benefits</a>\
            </li>\
            <li class="nav-item">\
                <a class="nav-link" href="/logout">Log Out</a>\
            </li>\
            <li class="nav-item">\
                <a class="nav-link bookBtn" href="/user" tabindex="-1" aria-disabled="true">PROFILE</a>\
            </li>\
            `;
            footertype = 'footerUser';
        }

        if (req.session.adminId){
            loggingstring = 
            `<li class="nav-item">\
                <a class="nav-link" href="/hotel/memberBenefits">Member Benefits</a>\
            </li>\
            <li class="nav-item">\
                <a class="nav-link" href="/logout">Log Out</a>\
            </li>\
            <li class="nav-item">\
                <a class="nav-link bookBtn" href="/admin" tabindex="-1" aria-disabled="true">ADMIN</a>\
            </li>\
            `;
            footertype = 'footerAdmin';
        }

        db.collection('booking').insertOne(reservation)
            .then(resp => {
                console.log(resp);
                // for debugging and for production
                // return res.status(201).send('Good');
            }).catch(err => {
                console.log(err);
                database = '*Bad Server';
                return res.status(500).redirect('/totalCharge');
                // return res.status(500).render('totalCharge',
                //     {databaseError: '*Bad Server'}
                // );
            });

            //Use to find in database
            db.collection('booking').findOne(reservation)
                .then(resp=> {
                    // console.log(resp._id);
                    // res.redirect('totalCharge/pay/'+resp._id); //resp._id is the id of the database
                    res.render('pay',{
                        bookingid: resp._id,
                        whichfooter: footertype,
                        logging: loggingstring
                    });
                }).catch(err => {
                    console.log(err);
                    database = '*Bad Server';
                    return res.status(500).redirect('/totalCharge');
                })
    });

    //:bookId = means that the url of the website will be ending with the id in the databse
    router.get('/billingDetails/:bookId', function(req, res){
        var headertype = 'header';
        var footertype = 'footer';

        if (req.session.userId){
            headertype = 'headerUser';
            footertype = 'footerUser';
        }

        if (req.session.adminId){
            headertype = 'headerAdmin';
            footertype = 'footerAdmin';
        }

        res.render('billingDetails',{
            whichheader: headertype,
            whichfooter: footertype
        });
    });

    router.post('/billingDetails', function(req,res){
        res.redirect('/totalCharge/pay');
    });

    router.post('/billingDetails/:bookId', function(req, res){
        // console.log(req.body);    
        let { owner, cvv, cardNumber, month, year,  ccprovider} = req.body;

        cardowner = "";
        card ="";
        cardNum ="";
        databasepay ="";
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
        
        var bookingid = {_id: ObjectId(req.params.bookId)}; //use to find the id in the database, (const { ObjectId } = require('mongodb'); is needed on top of this file)
        var update = { $set: 
            {'payment.status': 'Paid',
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

        if (req.session.userId){
            headertype = 'headerUser';
            footertype = 'footerUser';
        }

        if (req.session.adminId){
            headertype = 'headerAdmin';
            footertype = 'footerAdmin';
        }
        
        //updating the collection of booking
        db.collection('booking').updateOne(bookingid,update)
            .then(resp=> {
                console.log(resp);
                // res.redirect('/totalCharge/billingDetails/'+req.params.bookId); //redirecting to a website
                // res.render('billingDetails');
            }).catch(err => {
                console.log(err);
                database = '*Bad Server';
                return res.status(500).redirect('/totalCharge/pay');
            })
        
        db.collection('booking').findOne(bookingid)
            .then(resp=> {
                var imagesource = resp.roomtype;
                imagesource = imagesource.replace(/\s/g,'');
                res.render('billingDetails', {
                    data: resp,
                    source: '/images/Rooms/'+ imagesource + '.jpg',
                    whichfooter: footertype,
                    whichheader: headertype
                })
            }).catch(err=>{
                console.log(err);
                database = '*Bad Server';
                return res.status(500).redirect('/totalCharge/pay');
            })
    });
    return router;
};


module.exports = routerFunction;