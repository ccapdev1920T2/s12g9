const express = require('express');
const router = express();
const { ObjectId } = require('mongodb');
var imagesource;
var checkIn, checkOut, formatCheckInDate, formatCheckOutDate, price;

const routerFunction = function(db) {
    const notLoggedInAdmin = (req, res, next) => {
        if (!req.session.adminId) {
            if (!req.session.userId)
                res.redirect('/signIn');
            else
                res.redirect('/user');
        }
        return next();
    };

    router.get('/', notLoggedInAdmin, function(req, res) {
        //for login
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
                <a class="nav-link" href="/logout">Log Out</a>\
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
                <a class="nav-link" href="/logout">Log Out</a>\
            </li>\
            <li class="nav-item">\
                <a class="nav-link bookBtn" href="/admin" tabindex="-1" aria-disabled="true">ADMIN</a>\
            </li>\
            `;
            footertype = 'footerAdmin';
        }
        //{ bookingDate: formattedDate.toString() }
        var today = new Date();
        var formattedDate = today.getFullYear().toString() + '-' + (today.getMonth() + 1).toString().padStart(2, 0) + '-' + today.getDate().toString().padStart(2, 0);
        const monthName = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        db.collection('booking').find({ bookingDate: formattedDate.toString() }).toArray()
            .then(resp => {
                var newArray = [];
                for (var i = 0; i < resp.length; i++) {
                    imagesource = resp[i].roomtype;
                    imagesource = imagesource.replace(/\s/g, '');
                    imagesource = '/images/Rooms/' + imagesource + '.jpg'
                    checkIn = new Date(resp[i].checkInDate);
                    formatCheckInDate = monthName[checkIn.getMonth()] + " " + checkIn.getDate() + ", " + checkIn.getFullYear();
                    formatCheckInDate = formatCheckInDate.toString();
                    checkOut = new Date(resp[i].checkOutDate);
                    formatCheckOutDate = monthName[checkOut.getMonth()] + " " + checkOut.getDate() + ", " + checkOut.getFullYear();
                    formatCheckOutDate = formatCheckOutDate.toString();
                    price = (Math.round(resp[i].pricePerRoom * 100) / 100).toFixed(2);
                    console.log(resp[i]._id);
                    var bookingObject = {
                        img_src: imagesource,
                        roomType: resp[i].roomtype,
                        checkInDate: formatCheckInDate,
                        checkOutDate: formatCheckOutDate,
                        numAdults: resp[i].adults,
                        numKids: resp[i].kids,
                        numRooms: resp[i].rooms,
                        requests: resp[i].requests,
                        TOTAL: resp[i].payment.total,
                        bookingid: resp[i]._id
                    }

                    newArray[i] = bookingObject;
                }

                res.render('admin', {
                    whichfooter: footertype,
                    logging: loggingstring,
                    roomInfo: newArray
                });
            }).catch(err => {
                return res.status(500).render('admin', {
                    databaseError: '*Bad Server',
                    whichfooter: footertype,
                    logging: loggingstring
                });
            });
    });

    //TODO: ivy's for log in
    // router.get('/adminaccount/:userId', function(req, res) {
    //     res.render('home',{
    //         logging: 
    //             `<li class="nav-item">\
    //                 <a class="nav-link" href="/logout">Log Out</a>\
    //             </li>\
    //             <li class="nav-item">\
    //                 <a class="nav-link bookBtn" href="/admin" tabindex="-1" aria-disabled="true">ACCOUNT</a>\
    //             </li>\
    //             `
    //     });
    // });

    //FOR CLEANILESS OF WEBSITE ONLY
    router.get('/customerDetails', function(req, res) {
        if (req.session.adminId) {
            res.redirect('/');
        } else if (req.session.userId) {
            res.redirect('/');
        } else {
            res.redirect('/signIn');
        }

    });

    //FOR CLEANILESS OF WEBSITE ONLY
    router.get('/customerDetails/:bookid', function(req, res) {
        if (req.session.adminId) {
            res.redirect('/');
        } else if (req.session.userId) {
            res.redirect('/');
        } else {
            res.redirect('/signIn');
        }
    });

    router.post('/customerDetails/:bookid', notLoggedInAdmin, function(req, res) {
        var bookingID = { _id: ObjectId(req.params.bookid) }; //use to find the id in the database, (const { ObjectId } = require('mongodb'); is needed on top of this file)
        //for login
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

        db.collection('booking').findOne(bookingID)
            .then(resp => {
                console.log(resp._id);
                res.render('customerDetails', {
                    fname: resp.fname,
                    lname: resp.lname,
                    email: resp.email,
                    cardNumber: resp.payment.creditcardNumber,
                    roomType: resp.roomtype,
                    numAdults: resp.adults,
                    numKids: resp.kids,
                    whichheader: headertype,
                    whichfooter: footertype
                });
            }).catch(err => {
                console.log(err);
                return res.status(500).render('customerDetails', {
                    databaseError: '*Bad Server',
                    whichheader: headertype,
                    whichfooter: footertype
                });
            });
    });

    return router;
};


module.exports = routerFunction;