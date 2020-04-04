const db = require('../models/db.js');
const { ObjectId } = require('mongodb');
var imagesource;
var checkIn, checkOut, formatCheckInDate, formatCheckOutDate;

const adminController = {
    notLoggedInAdmin : function (req, res, next){
        if (!req.session.adminId) {
            if (!req.session.userId)
                return res.redirect('/signIn');
            else
                return res.redirect('/user');
        }
        return next();
    },

    viewAdminPage : function(req, res) {
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
        db.findMany('booking', { bookingDate: formattedDate, status: 'Booked' }, {checkInDate:1}, null,function(resp) {
            var newArray = [];
            if (resp.length == 0) {
                noneMessageTodayBooking = '<div class="row justify-content-center pb-5 pt-4">There are no reservations today to be displayed.</div>';
            }
            // console.log(resp.length);
            else {
                
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

            db.findMany('booking', { status: 'Booked' },{checkInDate:1}, null, function(respViewAll){
                var viewAllArray = [];
                // console.log(respViewAll);
                if (respViewAll.length == 0) {
                    noneMessageView = '<div class="row justify-content-center pb-5 pt-4">There are no reservations to be displayed.</div>';
                }
                // console.log(resp.length);
                else {
                    
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
                db.findMany('booking',{
                    $and: [
                            { checkInDate: { $lte: todayFormat } },
                            { checkOutDate: { $gte: todayFormat } }
                        ],
                    status: 'Booked'
                }, {checkInDate:1}, null, function (respCheckedIn){
                    var CheckedInArray = [];
                        // console.log(respCheckedIn);
                    if (respCheckedIn.length == 0) {
                        noneMessageCheckin = '<div class="row justify-content-center pb-5 pt-4">There are no check-ins today to be displayed.</div>';
                    }
                    // console.log(resp.length);
                    else {
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
                    db.findMany('users',{banned: true}, null, null, function (respaccount){
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

                    });
                });
            });

        });
    },

    cleanWebiste: function(req, res) {
        if (req.session.adminId) {
            return res.redirect('/');
        } else if (req.session.userId) {
            return res.redirect('/');
        } else {
            return res.redirect('/signIn');
        }
    },

    viewCustomerDetails: function(req, res) {
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
    
        db.updateOne('booking',bookingID, update, function(resp){
            // console.log(resp);
            return res.status(201).redirect('/admin');
        });
    },

    postCustomerDetails : function(req, res) {
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
    
        db.findOne('booking', bookingID, function (resp){
            // console.log(resp._id);
            return res.render('customerDetails', {
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
        });
    },

    viewReactivatePage : function(req,res){
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
    
        db.updateOne('users',userID, update, function(resp){
            db.findOne('users', userID, function (respfind){
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
                db.updateMany('booking', {
                    email: respfind.email, 
                    status: "Cancelled", 
                    $and: [
                        { cancelledDate: { $lte: endDate} },
                        { cancelledDate: { $gte: startDate } }
                    ]
                    }, newquery, function (status){
                        // console.log(status);
                    return res.status(201).redirect('/admin');
                });  
            });
        });
    },

    postReactivatePage : function(req, res){
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
        
    
        db.findOne('users', userID, function (resp){
            db.findMany('booking',{email: resp.email, status: "Cancelled"}, null, null, function (respbook){
                var bookedYear = [];
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
                total = total.toFixed(2);

                return res.render('reactivate', {
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
            });   
        });
    }
}


module.exports = adminController;