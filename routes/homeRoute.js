const express = require('express');
const router = express();
const { ObjectId } = require('mongodb');

const routerFunction = function(db) {

    //check if user is logged in, if not, he/she cannot access the page such as profile and admin， and log out
    const notLoggedIn = (req, res, next) => {
        if (!req.session.userId && !req.session.adminId) {
            // console.log('hi');
            res.redirect('/signIn');
        }

        return next();
    };

    //check if user is logged in, if yes, he/she cannot access the pages of signIn and Be a Member
    const loggedIn = (req, res, next) => {
        // console.log(req.session.userId);
        if (req.session.userId || req.session.adminId) {
            if (req.session.userId)
                var user = { _id: ObjectId(req.session.userId) };
            else {
                var user = { _id: ObjectId(req.session.adminId) };
            }
            // console.log('1');
            db.collection('users').findOne(user)
                .then(resp => {
                    // console.log(resp);
                    if (resp === null) {
                        return res.status(401).render('signIn', {
                            generalError: `
                            <div class="row ml-1">*No Such Account Registered in the System</div><div class="row ml-1">Click here to <a href="/signUp" class="ml-1"> be a member</a></div>
                            `,
                            whichfooter: 'footer'
                        });
                    } else {
                        // console.log('4');
                        if (resp.admin == true)
                            return res.status(201).redirect('/admin');
                        else
                            return res.status(201).redirect('/user');
                    }
                }).catch(err => {
                    console.log(err);
                    return res.status(500).redirect('/signIn');
                });
        } else {
            // console.log('6');
            return next();
        }
    };

    router.get('/logout', notLoggedIn, function(req, res) {
        req.session.destroy();
        res.redirect('/signIn');
    });

    //FIXME: Think if you're going to put /:userId for home
    router.get('/', function(req, res) {
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

        //TODO: CHECK
        var adminuser = {
            email: "admin@paraisohotels.com",
            password: "para1soHotels",
            admin: true
        }

        db.collection('users').findOne(adminuser)
            .then(resp => {
                if (resp === null) {
                    db.collection('users').insertOne({
                            email: "admin@paraisohotels.com",
                            password: "para1soHotels",
                            admin: true
                        })
                        .then(resp => {
                            console.log(resp);
                            return res.render('home', {
                                    logging: loggingstring,
                                    // whichheader: 'header',
                                    whichfooter: footertype
                                }) //function when rendering the webpage
                        }).catch(err => {
                            console.log(err);
                            return res.status(500).send('Bad Server');
                        });
                } else {
                    return res.render('home', {
                        logging: loggingstring,
                        // whichheader: 'header',
                        whichfooter: footertype
                    })
                }
            }).catch(errsec => {
                console.log(errsec);
                return res.status(500).send('Bad Server');
            })

    });

    // post for view rooms]
    router.post('/viewRooms', function(req, res) {
        var classicD = false;
        var famD = false;
        var execD = false;
        var juniorS = false;
        var execS = false;
        var grandS = false;
        var today = new Date();
        var checkin = new Date(req.body.checkIn);
        var checkout = new Date(req.body.checkOut);
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

        //check if entered dates are valid
        if (!(checkout.getTime() <= checkin.getTime()) && !(checkin.getTime() < today.getTime())) {
            //check for number of guests
            if (Number(req.body.nAdults) + (Number(req.body.nKids) / 2) / req.body.nRooms <= 3) {
                db.collection('bookings').find({
                    $and: [{
                            $or: [{ roomType: 'Classic Deluxe' },
                                { roomType: 'Family Deluxe' },
                                { roomType: 'Executive Deluxe' },
                                { roomType: 'Junior Suite' },
                                { roomType: 'Executive Suite' },
                                { roomType: 'Grand Suite' },
                            ]
                        },
                        {
                            $or: [{ checkInDate: { $lte: req.body.checkIn } },
                                { checkOutDate: { $gte: req.body.checkOut } }
                            ]
                        }
                    ]
                }).toArray().then(
                    resp => {
                        // count rooms 
                        var cd = 0;
                        var fd = 0;
                        var ed = 0;
                        var js = 0;
                        var es = 0;
                        var gs = 0;
                        for (var i = 0; i < resp.length; i++) {
                            if (resp[i].roomType == "Classic Deluxe") {
                                cd += resp[i].numOfRooms;
                            } else if (resp[i].roomType == "Family Deluxe") {
                                fd += resp[i].numOfRooms;
                            } else if (resp[i].roomType == "Executive Deluxe") {
                                ed += resp[i].numOfRooms;
                            } else if (resp[i].roomType == "Junior Suite") {
                                js += resp[i].numOfRooms;
                            } else if (resp[i].roomType == "Executive Suite") {
                                es += resp[i].numOfRooms;
                            } else if (resp[i].roomType == "Grand Suite") {
                                gs += resp[i].numOfRooms;
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
                        // TODO: for testing console.log(resp);
                        return res.status(201);
                    }).catch(err => {
                    res.render('viewRooms', {
                        message: "An error occured! Please try again.",
                        data: req.body,
                        // whichheader: 'header',
                        whichfooter: 'footer',
                        logging: loggingstring
                    });
                    return res.status(500);
                }).finally(function() {
                    if (classicD || famD || execD || juniorS || execS || grandS) {
                        res.render('viewRooms', {
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
                        res.render('viewRooms', {
                            message: "No rooms found! Please try other dates.",
                            data: req.body,
                            whichfooter: footertype,
                            logging: loggingstring
                        });
                    }
                });
            } else if (Number(req.body.nAdults) + (Number(req.body.nKids) / 2) / req.body.nRooms <= 4) {
                db.collection('bookings').find({
                    $and: [{
                            $or: [{ roomType: 'Family Deluxe' },
                                { roomType: 'Executive Deluxe' },
                                { roomType: 'Junior Suite' },
                                { roomType: 'Executive Suite' },
                                { roomType: 'Grand Suite' },
                            ]
                        },
                        {
                            $or: [{ checkInDate: { $lte: req.body.checkIn } },
                                { checkOutDate: { $gte: req.body.checkOut } }
                            ]
                        }
                    ]
                }).toArray().then(
                    resp => {
                        // count rooms 
                        var fd = 0;
                        var ed = 0;
                        var js = 0;
                        var es = 0;
                        var gs = 0;
                        for (var i = 0; i < resp.length; i++) {
                            if (resp[i].roomType == "Family Deluxe") {
                                fd += resp[i].rooms;
                            } else if (resp[i].roomType == "Executive Deluxe") {
                                ed += resp[i].rooms;
                            } else if (resp[i].roomType == "Junior Suite") {
                                js += resp[i].rooms;
                            } else if (resp[i].roomType == "Executive Suite") {
                                es += resp[i].rooms;
                            } else if (resp[i].roomType == "Grand Suite") {
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
                        // TODO: for testing console.log(resp);
                        return res.status(201);
                    }).catch(err => {
                    res.render('viewRooms', {
                        message: "An error occured! Please try again.",
                        data: req.body,
                        whichfooter: footertype,
                        logging: loggingstring
                    });
                    return res.status(500);
                }).finally(function() {
                    if (famD || execD || juniorS || execS || grandS) {
                        res.render('viewRooms', {
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
                        res.render('viewRooms', {
                            message: "No rooms found! Please try other dates.",
                            data: req.body,
                            whichfooter: footertype,
                            logging: loggingstring
                        });
                    }
                });
            } else if (Number(req.body.nAdults) + (Number(req.body.nKids) / 2) / req.body.nRooms <= 6) {
                db.collection('bookings').find({
                    $and: [{ $or: [{ roomType: 'Grand Suite' }, ] },
                        {
                            $or: [{ checkInDate: { $lte: req.body.checkIn } },
                                { checkOutDate: { $gte: req.body.checkOut } }
                            ]
                        }
                    ]
                }).toArray().then(
                    resp => {
                        // count rooms 
                        var gs = 0;
                        for (var i = 0; i < resp.length; i++) {
                            if (resp[i].roomType == "Grand Suite") {
                                gs += resp[i].rooms;
                            }
                        }
                        if (gs < 5 && (5 - gs) >= req.body.nRooms) {
                            grandS = true;
                        }
                        // TODO: for testing console.log(resp);
                        return res.status(201);
                    }).catch(err => {
                    res.render('viewRooms', {
                        message: "An error occured! Please try again.",
                        data: req.body,
                        whichfooter: footertype,
                        logging: loggingstring
                    });
                    return res.status(500);
                }).finally(function() {
                    if (grandS) {
                        res.render('viewRooms', {
                            gs: grandS,
                            data: req.body,
                            whichfooter: footertype,
                            logging: loggingstring
                        });
                    } else {
                        res.render('viewRooms', {
                            message: "No rooms found! Please try other dates.",
                            data: req.body,
                            whichfooter: footertype,
                            logging: loggingstring
                        });
                    }
                });

            } else {
                res.render('viewRooms', {
                    message: "Too many guests per room. Please add more rooms",
                    data: req.body,
                    whichfooter: footertype,
                    logging: loggingstring
                });
            }
        } else {
            res.render('viewRooms', {
                message: "Date entered invalid! Please change the dates entered.",
                whichfooter: footertype,
                logging: loggingstring
            })
        }
    });


    router.get('/aboutUs', function(req, res) {
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

        res.render('aboutUs', {
            whichfooter: footertype,
            logging: loggingstring

        });
    });

    router.get('/signIn', loggedIn, function(req, res) {
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
    });

    router.post('/signIn', function(req, res) {
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
                whichfooter: footertype
            });
        }

        let emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

        // dfa validator
        if (!emailRegex.test(email)) {
            return res.status(401).render('signIn', {
                emailError: '*Email not valid',
                whichfooter: footertype
            });
        }

        if (!password) {
            return res.status(401).render('signIn', {
                passwordError: '*Please fill up missing field',
                data: req.body,
                whichfooter: footertype
            });
        }

        var useremail = {
            email
        }

        db.collection('users').findOne(useremail)
            .then(resp => {
                // console.log(resp);
                if (resp === null) {
                    return res.status(401).render('signIn', {
                        generalError: `
                        <div class="row ml-1">*No Such Account Registered in the System</div><div class="row ml-1">Click here to <a href="/signUp" class="ml-1"> be a member</a></div>
                        `,
                        whichfooter: footertype
                    });
                } else {
                    //TODO: fix account with userId
                    var user = {
                        email,
                        password
                    }

                    db.collection('users').findOne(user)
                        .then(found => {
                            if (found === null) {
                                return res.status(401).render('signIn', {
                                    generalError: `
                                    <div class="row ml-1">*Incorrect password entered.</div>
                                    `,
                                    whichfooter: footertype
                                });
                            } else {
                                if (found.admin == true)
                                    req.session.adminId = found._id;
                                else
                                    req.session.userId = found._id;
                                // console.log(req.session.userId);
                                return res.status(201).redirect('/');
                            }
                        }).catch(errfound => {
                            console.log(errfound);
                            return res.status(401).render('signIn', {
                                generalError: "*Bad Server",
                                whichfooter: footertype
                            });
                        });
                }
            }).catch(err => {
                console.log(err);
                return res.status(500).render('signIn', {
                    generalError: "*Bad Server",
                    whichfooter: footertype
                });
            });
    });

    router.get('/signUp', loggedIn, function(req, res) {
        var footertype = 'footer';

        // console.log(req.session.userId);
        if (req.session.userId) {
            footertype = 'footerUser';
        }

        if (req.session.adminId) {
            footertype = 'footerAdmin';
        }

        res.render('signUp', {
            whichfooter: footertype
        });
    });

    //function when submitting the form (create account form)
    router.post('/signUp',
        function(req, res) {

            var footertype = 'footer';

            // console.log(req.session.userId);
            if (req.session.userId) {
                footertype = 'footerUser';
            }

            if (req.session.adminId) {
                footertype = 'footerAdmin';
            }

            // console.log(req.body);
            let { fname, lname, email, password, cpassword, owner, cvv, creditcardNumber, month, year, ccprovider } = req.body;

            // sanitation of data/ cleaning of the data
            fname = fname.trim(); // '      '
            lname = lname.trim(); // '      '
            email = email.trim(); // '      '
            password = password.trim();
            cpassword = cpassword.trim();
            owner = owner.trim();
            cvv = cvv.trim();
            creditcardNumber = creditcardNumber.trim();

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

            if (!owner) {
                return res.render('signUp', {
                    ownerError: {
                        msg: '*Please fill up missing field'
                    },
                    data: req.body,
                    whichfooter: footertype
                });
            }

            if (!cvv) {
                return res.render('signUp', {
                    cvvError: {
                        msg: '*Please fill up missing field'
                    },
                    data: req.body,
                    whichfooter: footertype
                });
            }

            if (!creditcardNumber) {
                return res.render('signUp', {
                    cardNumError: {
                        msg: '*Please fill up missing field'
                    },
                    data: req.body,
                    whichfooter: footertype
                });
            }

            //generating random membership number
            var memberNumber = Math.floor(1000000000 + Math.random() * 9000000000);

            //checking if random generated number is used already in the database
            // var found = 1;

            // console.log('Hello, i was here2');

            // while (found){
            //     //generating random membership number
            //     var memberNumber = Math.floor(1000000000 + Math.random() * 9000000000);
            //     console.log(memberNumber);
            //     db.collection('users').findOne({membershipNumber: memberNumber})
            //     .then(resp=>{
            //         if (resp===null){
            //             found = 0;
            //             console.log('lol');
            //         }
            //         console.log('endless loop?');
            //     }).catch(err=>{
            //         console.log(err);
            //         return res.status(500).render('signUp', {
            //             generalError: "*Bad Server",
            //             whichfooter: footertype
            //         });
            //     })
            // }


            // inserting to db
            let user = {
                fname,
                lname,
                email,
                password,
                cpassword,
                owner,
                cvv,
                creditcardNumber,
                month,
                year,
                ccprovider,
                membershipNumber: memberNumber,
                membershipPoints: 0
            };

            // promises
            db.collection('users').findOne({ email })
                .then(resp => {
                    if (resp === null) {
                        db.collection('users').insertOne(user)
                            .then(respinsert => {
                                console.log(respinsert);
                                // for debugging and for production
                                return res.status(201).redirect('/signIn');
                            }).catch(errsec => {
                                console.log(errsec);
                                return res.status(500).render('signUp', {
                                    generalError: "*Bad Server",
                                    whichfooter: footertype
                                });
                            });
                    } else {
                        return res.status(500).render('signUp', {
                            generalError: "*Email address is already used. Please use another one.",
                            whichfooter: footertype
                        });
                    }
                }).catch(err => {
                    console.log(err);
                    //TODO: don't use send 
                    return res.status(500).render('signUp', {
                        generalError: "*Bad Server",
                        whichfooter: footertype
                    });
                });
        });

    // router.get('/aboutUs', function(req, res) {
    //     res.render('aboutUs',{
    //         whichfooter: 'footer'
    //     });
    // });

    router.get('/viewRooms', function(req, res) {
        var footertype = 'footer';

        // console.log(req.session.userId);
        if (req.session.userId) {
            footertype = 'footerUser';
        }

        if (req.session.adminId) {
            footertype = 'footerAdmin';
        }

        res.render('viewRooms', {
            whichfooter: footertype
        });
    });

    return router;
};

module.exports = routerFunction;