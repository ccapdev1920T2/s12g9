const { ObjectId } = require('mongodb');
const nodemailer = require('nodemailer');
const db = require('../models/db.js');
const moment = require('moment');

const hashController = require('../controllers/hashController.js');

const homeController = {
    //check if user is logged in, if not, he/she cannot access the page such as profile and admin， and log out
    notLoggedIn: function(req, res, next) {
        if (!req.session.userId && !req.session.adminId) {
            // console.log('hi');
            return res.redirect('/signIn');
        }

        return next();
    },

    loggedout: function(req, res) {
        req.session.destroy();
        return res.redirect('/signIn');
    },

    //check if user is logged in, if yes, he/she cannot access the pages of signIn and Be a Member
    loggedIn: function(req, res, next) {
        // console.log(req.session.userId);
        if (req.session.userId || req.session.adminId) {
            if (req.session.userId)
                var user = { _id: ObjectId(req.session.userId) };
            else {
                var user = { _id: ObjectId(req.session.adminId) };
            }
            // console.log('1');

            db.findOne('users', user, function(resp) {
                if (resp === null) {
                    return res.status(401).render('signIn', {
                        generalError: `
                        <div class="row ml-1">*No Such Account Registered in the System</div><div class="row ml-1">Click here to <a href="/signUp" class="ml-1"> be a member</a></div>
                        `,
                        whichfooter: 'footer'
                    });
                } else {
                    // console.log('4');n
                    if (resp.admin == true)
                        return res.status(201).redirect('/admin');
                    else
                        return res.status(201).redirect('/user');
                }
            });
        } else {
            // console.log('6');
            return next();
        }
    },

    viewHomePage: function(req, res) {
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

        //TODO: CHECK
        var adminuser = {
            email: "admin@paraisohotels.com",
            admin: true
        }

        var todayDate = new Date();
        //TODO: Check

        db.deleteMany('users', { signUpDate: { $lte: todayDate }, verified: false }, function(resDel) {
            db.findOne('users', adminuser, function(resp) {
                if (resp === null) {

                    var newpass = hashController.saltHashPassword('para1soHotels');
                    db.insertOne('users', {
                        email: "admin@paraisohotels.com",
                        password: newpass[0],
                        saltpass: newpass[1],
                        verified: true,
                        admin: true,
                        banned: false
                    }, function(admin) {
                        var todayDate = new Date();
                        if ((todayDate.getMonth() + 1) == 1 && todayDate.getDate() == 1) {
                            db.updateMany('users', {}, countUpdate, function(resset) {
                                return res.render('home', {
                                    logging: loggingstring,
                                    // whichheader: 'header',
                                    whichfooter: footertype
                                })
                            });
                        } else {
                            return res.render('home', {
                                logging: loggingstring,
                                // whichheader: 'header',
                                whichfooter: footertype
                            }); //function when rendering the webpage
                        }
                    });
                } else {
                    var todayDate = new Date();
                    var countUpdate = { $set: { cancellationCount: 0 } };

                    if ((todayDate.getMonth() + 1) == 1 && todayDate.getDate() == 1) {
                        db.updateMany('users', {}, countUpdate, function(resset) {
                            return res.render('home', {
                                logging: loggingstring,
                                // whichheader: 'header',
                                whichfooter: footertype
                            })
                        });
                    } else {
                        return res.render('home', {
                            logging: loggingstring,
                            // whichheader: 'header',
                            whichfooter: footertype
                        }); //function when rendering the webpage
                    }
                }
            });

        });
    },

    viewAvailableRoomsPage: function(req, res) {
        var footertype = 'footer';

        // console.log(req.session.userId);
        if (req.session.userId) {
            footertype = 'footerUser';
        }

        if (req.session.adminId) {
            footertype = 'footerAdmin';
        }

        return res.render('viewRooms', {
            whichfooter: footertype
        });
    },

    viewAvailableRooms: function(req, res) {
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

        if (!req.body.checkIn.trim()) {
            return res.render('viewRooms', {
                message: "Check-In date should not be empty ",
                data: req.body,
                whichfooter: footertype,
                logging: loggingstring
            });
        }

        if (!req.body.checkOut.trim()) {
            return res.render('viewRooms', {
                message: "Check-Out date should not be empty ",
                data: req.body,
                whichfooter: footertype,
                logging: loggingstring
            });
        }

        if (!req.body.nRooms.trim()) {
            return res.render('viewRooms', {
                message: "Number of rooms should not be empty ",
                data: req.body,
                whichfooter: footertype,
                logging: loggingstring
            });
        }

        if (!req.body.nAdults.trim()) {
            return res.render('viewRooms', {
                message: "Number of adults should not be empty ",
                data: req.body,
                whichfooter: footertype,
                logging: loggingstring
            });
        }

        if (!req.body.nKids.trim()) {
            return res.render('viewRooms', {
                message: "Number of kids should not be empty ",
                data: req.body,
                whichfooter: footertype,
                logging: loggingstring
            });
        }

        if (!moment(req.body.checkIn, "YYYY-MM-DD", true).isValid()) {
            return res.render('viewRooms', {
                message: "Check-In date is invalid (Format: YYYY-MM-DD)",
                data: req.body,
                whichfooter: footertype,
                logging: loggingstring
            });
        }

        if (!moment(req.body.checkOut, "YYYY-MM-DD", true).isValid()) {
            return res.render('viewRooms', {
                message: "Check-Out date is invalid (Format: YYYY-MM-DD)",
                data: req.body,
                whichfooter: footertype,
                logging: loggingstring
            });
        }

        var classicD = false;
        var famD = false;
        var execD = false;
        var juniorS = false;
        var execS = false;
        var grandS = false;
        var today = new Date();
        var checkin = new Date(req.body.checkIn);
        var checkout = new Date(req.body.checkOut);

        //check if entered dates are valid
        if (!(checkout.getTime() <= checkin.getTime()) && !(checkin.getTime() < today.getTime())) {
            //check for number of guests
            if (Number(req.body.nAdults) + (Number(req.body.nKids) / 2) <= 3 * req.body.nRooms) {
                db.findMany('booking', {
                    $and: [{
                            $or: [{ roomtype: 'Classic Deluxe' },
                                { roomtype: 'Family Deluxe' },
                                { roomtype: 'Executive Deluxe' },
                                { roomtype: 'Junior Suite' },
                                { roomtype: 'Executive Suite' },
                                { roomtype: 'Grand Suite' },
                            ]
                        },
                        {
                            $and: [{ checkInDate: { $lt: req.body.checkOut } },
                                { checkOutDate: { $gt: req.body.checkIn } }
                            ]
                        },
                        {
                            status: "Booked"
                        }
                    ]
                }, null, null, function(resp) {
                    // count rooms 
                    var cd = 0;
                    var fd = 0;
                    var ed = 0;
                    var js = 0;
                    var es = 0;
                    var gs = 0;
                    for (var i = 0; i < resp.length; i++) {
                        if (resp[i].roomtype == "Classic Deluxe") {
                            cd += resp[i].rooms;
                        } else if (resp[i].roomtype == "Family Deluxe") {
                            fd += resp[i].rooms;
                        } else if (resp[i].roomtype == "Executive Deluxe") {
                            ed += resp[i].rooms;
                        } else if (resp[i].roomtype == "Junior Suite") {
                            js += resp[i].rooms;
                        } else if (resp[i].roomtype == "Executive Suite") {
                            es += resp[i].rooms;
                        } else if (resp[i].roomtype == "Grand Suite") {
                            gs += resp[i].rooms;
                        }
                    }
                    if (cd < 5 && (5 - cd) >= req.body.nRooms) {
                        classicD = true;
                    }
                    if (fd < 5 && (5 - fd) >= req.body.nRooms) {
                        famD = true;
                    }
                    if (ed < 5 && (5 - ed) >= req.body.nRooms) {
                        execD = true;
                    }
                    if (js < 5 && (5 - js) >= req.body.nRooms) {
                        juniorS = true;
                    }
                    if (es < 5 && (5 - es) >= req.body.nRooms) {
                        execS = true;
                    }
                    if (gs < 5 && (5 - gs) >= req.body.nRooms) {
                        grandS = true;
                    }
                    if (classicD || famD || execD || juniorS || execS || grandS) {
                        return res.render('viewRooms', {
                            cd: classicD,
                            fd: famD,
                            ed: execD,
                            js: juniorS,
                            es: execS,
                            gs: grandS,
                            data: req.body,
                            // whichheader: 'header',
                            whichfooter: footertype,
                            logging: loggingstring
                        });
                    } else {
                        return res.render('viewRooms', {
                            message: "No rooms found! Please try other dates.",
                            data: req.body,
                            whichfooter: footertype,
                            logging: loggingstring
                        });
                    }
                })
            } else if (Number(req.body.nAdults) + (Number(req.body.nKids) / 2) <= 4 * req.body.nRooms) {
                db.findMany('booking', {
                    $and: [{
                            $or: [
                                { roomtype: 'Family Deluxe' },
                                { roomtype: 'Executive Deluxe' },
                                { roomtype: 'Junior Suite' },
                                { roomtype: 'Executive Suite' },
                                { roomtype: 'Grand Suite' },
                            ]
                        },
                        {
                            $and: [{ checkInDate: { $lt: req.body.checkOut } },
                                { checkOutDate: { $gt: req.body.checkIn } }
                            ]
                        },
                        {
                            status: "Booked"
                        }
                    ]
                }, null, null, function(resp) {
                    // count rooms 
                    var fd = 0;
                    var ed = 0;
                    var js = 0;
                    var es = 0;
                    var gs = 0;
                    for (var i = 0; i < resp.length; i++) {
                        if (resp[i].roomtype == "Family Deluxe") {
                            fd += resp[i].rooms;
                        } else if (resp[i].roomtype == "Executive Deluxe") {
                            ed += resp[i].rooms;
                        } else if (resp[i].roomtype == "Junior Suite") {
                            js += resp[i].rooms;
                        } else if (resp[i].roomtype == "Executive Suite") {
                            es += resp[i].rooms;
                        } else if (resp[i].roomtype == "Grand Suite") {
                            gs += resp[i].rooms;
                        }
                    }
                    if (fd < 5 && (5 - fd) >= req.body.nRooms) {
                        famD = true;
                    }
                    if (ed < 5 && (5 - ed) >= req.body.nRooms) {
                        execD = true;
                    }
                    if (js < 5 && (5 - js) >= req.body.nRooms) {
                        juniorS = true;
                    }
                    if (es < 5 && (5 - es) >= req.body.nRooms) {
                        execS = true;
                    }
                    if (gs < 5 && (5 - gs) >= req.body.nRooms) {
                        grandS = true;
                    }
                    if (famD || execD || juniorS || execS || grandS) {
                        return res.render('viewRooms', {
                            cd: classicD,
                            fd: famD,
                            ed: execD,
                            js: juniorS,
                            es: execS,
                            gs: grandS,
                            data: req.body,
                            whichfooter: footertype,
                            logging: loggingstring
                        });
                    } else {
                        return res.render('viewRooms', {
                            message: "No rooms found! Please try other dates.",
                            data: req.body,
                            whichfooter: footertype,
                            logging: loggingstring,
                        });
                    }
                })
            } else if (Number(req.body.nAdults) + (Number(req.body.nKids) / 2) <= 6 * req.body.nRooms) {
                db.findMany('booking', {
                    $and: [{ $or: [{ roomtype: 'Grand Suite' }, ] },
                        {
                            $and: [{ checkInDate: { $lt: req.body.checkOut } },
                                { checkOutDate: { $gt: req.body.checkIn } }
                            ]
                        },
                        {
                            status: "Booked"
                        }
                    ]
                }, null, null, function(resp) {
                    var gs = 0;
                    for (var i = 0; i < resp.length; i++) {
                        if (resp[i].roomtype == "Grand Suite") {
                            gs += resp[i].rooms;
                        }
                    }
                    if (gs < 5 && (5 - gs) >= req.body.nRooms) {
                        grandS = true;
                    }
                    if (grandS) {
                        return res.render('viewRooms', {
                            gs: grandS,
                            data: req.body,
                            whichfooter: footertype,
                            logging: loggingstring
                        });
                    } else {
                        return res.render('viewRooms', {
                            message: "No rooms found! Please try other dates.",
                            data: req.body,
                            whichfooter: footertype,
                            logging: loggingstring,
                        });
                    }
                })
            } else {
                return res.render('viewRooms', {
                    message: "Too many guests per room. Please add more rooms",
                    data: req.body,
                    whichfooter: footertype,
                    logging: loggingstring,
                });
            }
        } else {
            req.body.checkIn = null;
            req.body.checkOut = null;
            return res.render('viewRooms', {
                message: "Date entered invalid! Please change the dates entered.",
                whichfooter: footertype,
                logging: loggingstring,
                data: req.body
            })
        }
    },

    viewAboutUs: function(req, res) {
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

        return res.render('aboutUs', {
            whichfooter: footertype,
            logging: loggingstring

        });
    },

    viewSignInPage: function(req, res) {
        var footertype = 'footer';

        if (req.session.userId) {
            footertype = 'footerUser';
        }

        if (req.session.adminId) {
            footertype = 'footerAdmin';
        }

        res.render('signIn', {
            whichfooter: footertype
        });
    },

    userSignIn: function(req, res) {
        var footertype = 'footer';

        if (req.session.userId) {
            footertype = 'footerUser';
        }

        if (req.session.adminId) {
            footertype = 'footerAdmin';
        }

        let { email, password } = req.body;

        // console.log(req.body);
        email = email.trim();
        password = password.trim();

        // validation

        if (!email) {
            return res.status(401).render('signIn', {
                emailError: '*Please fill up missing field',
                data: req.body,
                whichfooter: footertype,
            });
        }

        let emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

        // dfa validator
        if (!emailRegex.test(email)) {
            return res.status(401).render('signIn', {
                emailError: '*Email not valid',
                whichfooter: footertype,
            });
        }

        if (!password) {
            return res.status(401).render('signIn', {
                passwordError: '*Please fill up missing field',
                data: req.body,
                whichfooter: footertype,
                email: email
            });
        }

        var useremail = {
            email
        }

        db.findOne('users', useremail, function(resp) {
            if (resp === null) {
                return res.status(401).render('signIn', {
                    generalError: `
                    <div class="row ml-1">*No Such Account Registered in the System</div><div class="row ml-1">Click here to <a href="/signUp" class="ml-1"> be a member</a></div>
                    `,
                    whichfooter: footertype
                });
            } else {
                if (resp.banned === false) {
                    if (resp.verified === true) {

                        if (hashController.validPassword(password, resp.saltpass, resp.password)) {
                            if (resp.admin == true) {
                                req.session.adminId = resp._id;
                            } else
                                req.session.userId = resp._id;
                            // console.log(req.session.userId);
                            return res.status(201).redirect('/');
                        } else {
                            return res.status(401).render('signIn', {
                                generalError: `
                                <div class="row ml-1">*Incorrect password entered.</div>`,
                                whichfooter: footertype,
                                email: email
                            });
                        }
                    } else if (resp.verified === false) {
                        return res.status(401).render('signIn', {
                            generalError: `
                            <div class="row ml-1">*Account not yet verified</div><div class="row ml-1">Click here to <a href="/verify" class="ml-1"> verify your email address.</a></div>
                            `,
                            whichfooter: footertype
                        });
                    }

                } else if (resp.banned === true) {
                    return res.status(401).render('signIn', {
                        generalError: `
                        <div class="row">*Account is banned. </div><div class="row">Please contact the admin to have your account reactivated.</div>
                        `,
                        whichfooter: footertype
                    });
                }
            }
        })
    },

    viewSignUpPage: function(req, res) {
        var footertype = 'footer';

        // console.log(req.session.userId);
        if (req.session.userId) {
            footertype = 'footerUser';
        }

        if (req.session.adminId) {
            footertype = 'footerAdmin';
        }

        return res.render('signUp', {
            whichfooter: footertype
        });
    },

    userSignUp: function(req, res) {
        var verified = false;
        var verificationKey = Math.random().toString(36).substr(2, 8);
        var footertype = 'footer';

        // console.log(req.session.userId);
        if (req.session.userId) {
            footertype = 'footerUser';
        }

        if (req.session.adminId) {
            footertype = 'footerAdmin';
        }

        // console.log(req.body);
        let { fname, lname, email, password, cpassword, creditcardOwner, cvv, creditcardNumber, month, year, ccprovider } = req.body;

        // sanitation of data/ cleaning of the data
        fname = fname.trim(); // '      '
        lname = lname.trim(); // '      '
        email = email.trim(); // '      '
        password = password.trim();
        cpassword = cpassword.trim();
        creditcardOwner = creditcardOwner.trim();
        cvv = cvv.trim();
        creditcardNumber = creditcardNumber.trim();
        // console.log('trimmed');

        // validation
        if (!fname) {
            return res.status(401).render('signUp', {
                fnameError: {
                    msg: '*Please fill up missing field'
                },
                data: req.body,
                whichfooter: footertype
            });
        }

        if (!lname) {
            return res.status(401).render('signUp', {
                lnameError: {
                    msg: '*Please fill up missing field'
                },
                data: req.body,
                whichfooter: footertype
            });
        }

        if (!email) {
            return res.status(401).render('signUp', {
                emailError: {
                    msg: '*Please fill up missing field'
                },
                data: req.body,
                whichfooter: footertype
            });
        }

        let emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

        // dfa validator
        if (!emailRegex.test(email)) {
            // console.log('hello');
            return res.status(401).render('signUp', {
                emailError: {
                    msg: '*Email not valid'
                },
                data: req.body,
                whichfooter: footertype
            });
        }

        if (!password) {
            return res.render('signUp', {
                passwordError: {
                    msg: '*Please fill up missing field'
                },
                data: req.body,
                whichfooter: footertype
            });
        } else if (!cpassword) {
            return res.render('signUp', {
                cpasswordError: {
                    msg: '*Please fill up missing field'
                },
                data: req.body,
                whichfooter: footertype
            });
        } else if (password !== cpassword) {
            return res.status(401).render('signUp', {
                cpasswordError: {
                    msg: '*passwords don\'t match'
                },
                data: req.body,
                whichfooter: footertype
            });
        }

        if (!creditcardOwner) {
            return res.status(401).render('signUp', {
                cardError: "*Please fill up credit card owner information",
                data: req.body,
                whichfooter: footertype
            });
        }

        if (!cvv) {
            return res.status(401).render('signUp', {
                cardError: "*Please fill up ccv information",
                data: req.body,
                whichfooter: footertype
            });
        }

        if (!creditcardNumber) {
            return res.status(401).render('signUp', {
                cardError: "*Please fill up credit card number information",
                data: req.body,
                whichfooter: footertype
            });
        }

        if (cvv.length != 3) {
            return res.status(401).render('signUp', {
                cardError: "*CVV number invalid format",
                data: req.body,
                whichfooter: footertype
            });
        }

        if (creditcardNumber.length < 13 || creditcardNumber.length > 16) {
            return res.status(401).render('signUp', {
                cardError: "*Credit card number invalid format",
                data: req.body,
                whichfooter: footertype
            });
        }

        var cardtoday = new Date();
        var monthToday = cardtoday.getMonth() + 1;
        var yearToday = cardtoday.getFullYear();
        yearToday = yearToday.toString();
        yearToday = yearToday.substring(yearToday.length - 2, yearToday.length);


        if (parseInt(year) == parseInt(yearToday)) {
            if (parseInt(month) <= monthToday) {
                // console.log('I should have passed here');
                return res.status(401).render('signUp', {
                    cardError: '*Card is not accepted because of the expiration date',
                    data: req.body,
                    whichfooter: footertype
                });

            }
        }

        //generating random membership number
        var memberNumber = Math.floor(1000000000 + Math.random() * 9000000000);

        //getting the date when the user signed up
        var milliseconds = 0; //amount of time from current date/time
        var sec = 0; //(+): future
        var min = 0; //(-): past
        var hours = 1;
        var days = 0;
        var startDate = new Date();
        var date = new Date(startDate.getTime() + milliseconds + 1000 * (sec + 60 * (min + 60 * (hours + 24 * days)))); //adding one hour to the current date and time it was made 
        // console.log("date: " + date);
        // var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        // var time = today.getHours() + ":" + today.getMinutes();

        // var dateTime = date + " " + time;
        // inserting to db
        var hashpass = hashController.saltHashPassword(password);
        var hashcvv = hashController.saltHashPassword(cvv);
        let user = {
            fname,
            lname,
            email,
            password: hashpass[0],
            cpassword: hashpass[0],
            saltpass: hashpass[1],
            creditcardOwner,
            cvv: hashcvv[0],
            cvvsalt: hashcvv[1],
            creditcardNumber,
            month,
            year,
            ccprovider,
            membershipNumber: memberNumber,
            membershipPoints: 0,
            admin: false,
            signUpDate: date,
            verificationKey,
            verified,
            cancellationCount: 0,
            banned: false
        };

        // promises
        db.findOne('users', { email }, function(resp) {
            if (resp === null) {

                //EMAIL VERIFICATION

                var transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    //port: 3000,
                    secure: false,
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

                let mailOptions = {
                    from: 'Hotel Paraiso',
                    to: email,
                    subject: 'Verify Email Address - Hotel Paraiso',
                    html: `
                            <head>
                            <link href="https://fonts.googleapis.com/css?family=Open+Sans:200,300,400,500,600,700,800,900&display=swap" rel="stylesheet">
                            
                            </head>
                            <p style="font-family: 'Open Sans'; letter-spacing: 1px; color: #2E4106; font-size:12px;">
                                <span style="font-size: 14px">Good day <b>${req.body.fname} ${req.body.lname}</b>!</span><br><br>
                                Please click <a href="https://paraiso-hotel.herokuapp.com/verify">Verify Email</a> to have your email verified. Your verification key is: <b>${verificationKey}</b><br> You only have one hour to verify your account.<br>
                                <br>
                                Best Regards,<br>
                                <b>Paraiso Hotel<br>
                            </p>
                        
                        `
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    } else {
                        console.log('Verification Email Sent Successfully!');
                    }
                    transporter.close();
                });

                db.insertOne('users', user, function(respinsert) {
                    return res.status(201).redirect('/verify');
                })
            } else {
                return res.status(500).render('signUp', {
                    generalError: "*Email address is already used. Please use another one.",
                    whichfooter: footertype
                });
            }
        })
    },

    verificationInput: function(req, res) {
        return res.render('verificationKey', {
            whichheadertype: 'header',
            whichfooter: 'footer',
            verificationKey: req.body.verificationKey
        });
    },

    verificationKey: function(req, res) {
        var verificationkey = { verificationKey: req.body.verification };

        var verification = req.body.verification.trim();

        if (!verification) {
            return res.render('verificationKey', {
                verificationError: '*Please fill up missing field',
                whichheadertype: 'header',
                whichfooter: 'footer',
            })
        }

        db.findOne('users', verificationkey, function(resp) {
            if (resp !== null) {
                var update = {
                    $set: {
                        'verified': true
                    }
                }

                db.updateOne('users', verificationkey, update, function(respupdate) {
                    return res.redirect('/signIn');
                })
            } else {
                return res.render('verificationKey', {
                    verificationError: 'Wrong verfication key.',
                    whichheadertype: 'header',
                    whichfooter: 'footer',
                });
            }
        })
    },

    checkOutDate: function(req, res) {
        var checkIn = new Date(req.query.checkin).getTime()
        var checkOut = new Date(req.query.checkout).getTime()
        if (checkIn < checkOut) {
            res.send(req.query.checkin)
        } else {
            res.send("")
        }
    },
    checkInDate: function(req, res) {
        var checkIn = new Date(req.query.checkin).getTime()
        var checkOut = new Date(req.query.checkout).getTime()
        var currDate = new Date().getTime()
        if (checkIn > checkOut) {
            res.send('')
        } else if (checkIn > currDate) {
            res.send(req.query.checkin)
        } else {
            res.send("")
        }
    }
}

module.exports = homeController;