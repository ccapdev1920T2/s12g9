const express = require('express');
const router = express();
const { ObjectId } = require('mongodb');
var imagesource;
var checkIn, checkOut, formatCheckInDate, formatCheckOutDate, price;
var bookedYear = [];

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
                <a class="nav-link bookBtn active" href="/admin" tabindex="-1" aria-disabled="true">ADMIN</a>\
            </li>\
            `;
        footertype = 'footerAdmin';
    }
    //{ bookingDate: formattedDate.toString() }
    var today = new Date();
    var monthNum = today.getMonth() + 1;
    var todayFormat = today.getFullYear().toString() + '-' + monthNum.toString().padStart(2, 0) + '-' + today.getDate().toString().padStart(2, 0);
    var formattedDate = today.getFullYear().toString() + '-' + (today.getMonth() + 1).toString().padStart(2, 0) + '-' + today.getDate().toString().padStart(2, 0);
    
    const monthName = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    var noneMessageTodayBooking = "";
    var noneMessageView = "";
    var noneMessageCheckin = "";
    var noneMessageBanned ="";
    db.collection('booking').find({ bookingDate: formattedDate, status: 'Booked' }).toArray()
        .then(resp => {

            if (resp.length == 0) {
                noneMessageTodayBooking = '<div class="row justify-content-center pb-5 pt-4">There are no reservations today to be displayed.</div>';
            }
            // console.log(resp.length);
            else {
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
                    // price = (Math.round(resp[i].pricePerRoom * 100) / 100).toFixed(2);
                    // console.log(resp[i]._id);
                    price = resp[i].payment.total;
                    // console.log(price);


                    var bookingObject = {
                        img_src: imagesource,
                        roomType: resp[i].roomtype,
                        checkInDate: formatCheckInDate,
                        checkOutDate: formatCheckOutDate,
                        numAdults: resp[i].adults,
                        numKids: resp[i].kids,
                        numRooms: resp[i].rooms,
                        requests: resp[i].requests,
                        TOTAL: resp[i].payment.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        bookingid: resp[i]._id
                    }
                    // console.log("booking");
                    // console.log(resp[i]);
                    // console.log("booking");
                    // console.log(bookingObject);
                    newArray[i] = bookingObject;
                }
            }

            db.collection('booking').find({ status: 'Booked' }).toArray()
                .then(respViewAll => {

                    // console.log(respViewAll);
                    if (respViewAll.length == 0) {
                        noneMessageView = '<div class="row justify-content-center pb-5 pt-4">There are no reservations to be displayed.</div>';
                    }
                    // console.log(resp.length);
                    else {
                        var viewAllArray = [];
                        for (var i = 0; i < respViewAll.length; i++) {
                            imagesource = respViewAll[i].roomtype;
                            imagesource = imagesource.replace(/\s/g, '');
                            imagesource = '/images/Rooms/' + imagesource + '.jpg'
                            checkIn = new Date(respViewAll[i].checkInDate);
                            formatCheckInDate = monthName[checkIn.getMonth()] + " " + checkIn.getDate() + ", " + checkIn.getFullYear();
                            formatCheckInDate = formatCheckInDate.toString();
                            checkOut = new Date(respViewAll[i].checkOutDate);
                            formatCheckOutDate = monthName[checkOut.getMonth()] + " " + checkOut.getDate() + ", " + checkOut.getFullYear();
                            formatCheckOutDate = formatCheckOutDate.toString();
                            // price = (Math.round(resp[i].pricePerRoom * 100) / 100).toFixed(2);
                            // console.log(resp[i]._id);
                            price = respViewAll[i].payment.total;
                            // console.log(price);


                            var viewAllObject = {
                                img_src: imagesource,
                                roomType: respViewAll[i].roomtype,
                                checkInDate: formatCheckInDate,
                                checkOutDate: formatCheckOutDate,
                                numAdults: respViewAll[i].adults,
                                numKids: respViewAll[i].kids,
                                numRooms: respViewAll[i].rooms,
                                requests: respViewAll[i].requests,
                                TOTAL: respViewAll[i].payment.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                                bookingid: respViewAll[i]._id
                            }
                            // console.log("viewAll");
                            // console.log(respViewAll[i]);
                            // console.log("viewAll");
                            // console.log(viewAllObject);
                            viewAllArray[i] = viewAllObject;
                        }
                    }

                    // console.log('hello');
                    // console.log("date:" + todayFormat);
                    db.collection('booking').find({
                            $and: [
                                    { checkInDate: { $lte: todayFormat } },
                                    { checkOutDate: { $gte: todayFormat } }
                                ],
                            status: 'Booked'
                        }).toArray()
                        .then(respCheckedIn => {

                                // console.log(respCheckedIn);
                                if (respCheckedIn.length == 0) {
                                    noneMessageCheckin = '<div class="row justify-content-center pb-5 pt-4">There are no check-ins today to be displayed.</div>';
                                }
                                // console.log(resp.length);
                                else {
                                    var CheckedInArray = [];
                                    for (var i = 0; i < respCheckedIn.length; i++) {
                                        imagesource = respCheckedIn[i].roomtype;
                                        imagesource = imagesource.replace(/\s/g, '');
                                        imagesource = '/images/Rooms/' + imagesource + '.jpg'
                                        checkIn = new Date(respCheckedIn[i].checkInDate);
                                        formatCheckInDate = monthName[checkIn.getMonth()] + " " + checkIn.getDate() + ", " + checkIn.getFullYear();
                                        formatCheckInDate = formatCheckInDate.toString();
                                        checkOut = new Date(respCheckedIn[i].checkOutDate);
                                        formatCheckOutDate = monthName[checkOut.getMonth()] + " " + checkOut.getDate() + ", " + checkOut.getFullYear();
                                        formatCheckOutDate = formatCheckOutDate.toString();
                                        // price = (Math.round(resp[i].pricePerRoom * 100) / 100).toFixed(2);
                                        // console.log(resp[i]._id);
                                        price = respCheckedIn[i].payment.total;
                                        // console.log(price);


                                        var CheckedInObject = {
                                            img_src: imagesource,
                                            roomType: respCheckedIn[i].roomtype,
                                            checkInDate: formatCheckInDate,
                                            checkOutDate: formatCheckOutDate,
                                            numAdults: respCheckedIn[i].adults,
                                            numKids: respCheckedIn[i].kids,
                                            numRooms: respCheckedIn[i].rooms,
                                            requests: respCheckedIn[i].requests,
                                            TOTAL: respCheckedIn[i].payment.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                                            bookingid: respCheckedIn[i]._id
                                        }
                                        // console.log("checkIn");
                                        // console.log(respCheckedIn[i]);
                                        CheckedInArray[i] = CheckedInObject;
                                    }
                            }
                            db.collection('users').find({banned: true}).toArray()
                                .then(respaccount => {

                                    if (respaccount.length == 0){
                                        noneMessageBanned= '<div class="row justify-content-center pb-5 pt-4">There are no banned accounts.</div>';
                                    }

                                    return res.render('admin', {
                                        whichfooter: footertype,
                                        logging: loggingstring,
                                        currentlyChecked: CheckedInArray,
                                        viewAll: viewAllArray,
                                        todayReserve: newArray,
                                        bannedAccount: respaccount,
                                        noneMessageToday: noneMessageTodayBooking,
                                        noneMessageChecked: noneMessageCheckin,
                                        noneMessageViewAll: noneMessageView,
                                        noneMessageAccounts: noneMessageBanned
                                    });

                                }).catch(erraccount => {
                                    return res.status(500).render('admin', {
                                        databaseError: '*Bad Server',
                                        whichfooter: footertype,
                                        logging: loggingstring
                                    });
                                });
                }).catch(errcheck => {
                    return res.status(500).render('admin', {
                        databaseError: '*Bad Server',
                        whichfooter: footertype,
                        logging: loggingstring
                    });
                });

        }).catch(errall => {
            return res.status(500).render('admin', {
                databaseError: '*Bad Server',
                whichfooter: footertype,
                logging: loggingstring
            });
        });

    }).catch(errbook => {
        return res.status(500).render('admin', {
            databaseError: '*Bad Server',
            whichfooter: footertype,
            logging: loggingstring
        });
    });
});

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

router.get('/customerDetails/:bookid', notLoggedInAdmin, function(req, res) {
    var bookingID = { _id: ObjectId(req.params.bookid) };

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

    var update = {
        $set: {
            status: 'Check Out'
        }
    }

    db.collection('booking').updateOne(bookingID, update)
        .then(resp => {
            console.log(resp);
            return res.status(201).redirect('/admin');
        }).catch(err => {
            console.log(err);
            return res.status(500).render('customerDetails', {
                databaseError: '*Bad Server',
                whichheader: headertype,
                whichfooter: footertype,
                bookingid: req.params.bookid
            });

        });
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
            // console.log(resp._id);
            res.render('customerDetails', {
                fname: resp.fname,
                lname: resp.lname,
                email: resp.email,
                cardNumber: resp.payment.creditcardNumber,
                roomType: resp.roomtype,
                numAdults: resp.adults,
                numKids: resp.kids,
                whichheader: headertype,
                whichfooter: footertype,
                bookingid: req.params.bookid
            });
        }).catch(err => {
            console.log(err);
            return res.status(500).render('customerDetails', {
                databaseError: '*Bad Server',
                whichheader: headertype,
                whichfooter: footertype,
                bookingid: req.params.bookid
            });
        });
});


    router.get('/reactivate/:userid',notLoggedInAdmin, function(req,res){
        var userID = { _id: ObjectId(req.params.userid) }; //use to find the id in the database, (const { ObjectId } = require('mongodb'); is needed on top of this file)
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

        var update = {
            $set: {
                banned: false,
                cancellationCount: 0
            }
        }

        db.collection('users').updateOne(userID, update)
            .then(resp => {
                db.collection('users').findOne(userID)
                    .then(respfind => {

                        var today = new Date();
                        var year = today.getFullYear().toString();
                        var start=  new Date(year+'-01-01');
                        var end = new Date (year+'-12-31');

                        // console.log(start);
                        // console.log(end);

                        var startDate = start.getFullYear().toString() + '-' + (start.getMonth() + 1).toString().padStart(2, 0) + '-' + start.getDate().toString().padStart(2, 0);
                        var endDate = end.getFullYear().toString() + '-' + (end.getMonth() + 1).toString().padStart(2, 0) + '-' + end.getDate().toString().padStart(2, 0);

                        // console.log(startDate);
                        // console.log(endDate);

                        var newquery = {$set : {status: "Fee Paid"}};
                        db.collection('booking').updateMany({
                            email: respfind.email, 
                            status: "Cancelled", 
                            $and: [
                                { cancelledDate: { $lte: endDate} },
                                { cancelledDate: { $gte: startDate } }
                            ]
                            }, newquery)
                            .then(status => {
                                console.log(status);
                                return res.status(201).redirect('/admin');
                            }).catch(errstat => {
                                console.log(errstat);
                                return res.status(500).render('Reactivate', {
                                    databaseError: '*Bad Server',
                                    whichheader: headertype,
                                    whichfooter: footertype,
                                    userid: req.params.userid
                                });
                            })     
                    }).catch(errfind => {
                        console.log(errfind);
                        return res.status(500).render('Reactivate', {
                            databaseError: '*Bad Server',
                            whichheader: headertype,
                            whichfooter: footertype,
                            userid: req.params.userid
                        });
                    })
            }).catch(err=>{
                console.log(err);
                return res.status(500).render('Reactivate', {
                    databaseError: '*Bad Server',
                    whichheader: headertype,
                    whichfooter: footertype,
                    userid: req.params.userid
                });
            })
    });

    router.post('/reactivate/:userid', notLoggedInAdmin, function(req, res){
        var userID = { _id: ObjectId(req.params.userid) };

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
        

        db.collection('users').findOne(userID)
        .then(resp => {
            // console.log(resp._id);

            db.collection('booking').find({email: resp.email, status: "Cancelled"}).toArray()
                .then( respbook => {

                    var total = 0;
                    var count = 0;
                    for (var i=0;i<respbook.length;i++){
                        var year = respbook[i].cancelledDate;
                        year = year.substring(0,4);
                        var today = new Date();

                        if (today.getFullYear().toString() === year){
                            total = total + parseFloat(respbook[i].payment.total);

                            bookedYear[count] = respbook[i];
                            count++;
                        }
                    }
                    
                    var total = total * 0.5;

                    return res.render('Reactivate', {
                        whichheader: headertype,
                        whichfooter: footertype,
                        userid: req.params.userid,
                        totalPayment: total,
                        fname: resp.fname,
                        lname: resp.lname,
                        email: resp.email,
                        cardNumber: resp.creditcardNumber,
                        book: bookedYear
                    });
                }).catch(errbook => {
                    console.log(err);
                    return res.status(500).render('Reactivate', {
                        databaseError: '*Bad Server',
                        whichheader: headertype,
                        whichfooter: footertype,
                        userid: req.params.userid,
                    });
                })        
        }).catch(err => {
            console.log(err);
            return res.status(500).render('Reactivate', {
                databaseError: '*Bad Server',
                whichheader: headertype,
                whichfooter: footertype,
                userid: req.params.userid
            });
        });
    });

return router;
};


module.exports = routerFunction;