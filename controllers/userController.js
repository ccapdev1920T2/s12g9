const db = require('../models/db.js');
const { ObjectId } = require('mongodb');
const nodemailer = require('nodemailer');
const userController = {
    notLoggedInUser: function(req, res, next) {
        if (!req.session.userId) {
            if (!req.session.adminId)
                return res.redirect('/signIn');
            else
                return res.redirect('/admin');
        }
        return next();
    },

    getHome: function(req, res) {
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
                <a class="nav-link bookBtn active" href="/user" tabindex="-1" aria-disabled="true">PROFILE</a>\
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
        var user = null;
        var today = new Date();
        var year = today.getFullYear();
        var month = Number(today.getMonth()) + 1;
        var day = today.getDate();
        if (day < 10) {
            day = '0' + day;
        }
        if (month < 10) {
            month = '0' + month;
        }
        var today = year + '-' + month + '-' + day;
        db.findOne('users', {
            _id: ObjectId(req.session.userId)
        }, function(resp) {
            user = resp;
            db.findMany('booking', {
                email: user.email,
                checkInDate: { $gte: today.toString() },
                status: "Booked"
            }, { checkInDate: 1 }, null, function(r) {
                db.findMany('booking', {
                    email: user.email,
                    checkInDate: { $lt: today.toString() },
                    status: "Check Out"
                }, { checkInDate: -1 }, null, function(r2) {
                    res.render('profile', {
                        name: user.fname + " " + user.lname,
                        membershipNumber: user.membershipNumber,
                        email: user.email,
                        creditCard: user.creditcardNumber,
                        points: user.membershipPoints,
                        cancelCount: user.cancellationCount,
                        whichfooter: footertype,
                        logging: loggingstring,
                        tab2: r,
                        tab3: r2
                    });
                })
            })
        });
    },

    postCancel: function(req, res) {
        var today = new Date();
        var formattedDate = today.getFullYear().toString() + '-' + (today.getMonth() + 1).toString().padStart(2, 0) + '-' + today.getDate().toString().padStart(2, 0);
        db.updateOne('booking', {
            email: req.body.email,
            _id: ObjectId(req.body.ID),
            status: "Booked"
        }, {
            $set: { status: "Cancelled", cancelledDate: formattedDate.toString() }
        }, function() {
            var subPoints = Number(parseInt(req.body.payment) / Number(10) * Number(-1));
            db.updateOne('users', {
                email: req.body.email
            }, {
                $inc: {
                    cancellationCount: 1,
                    membershipPoints: parseInt(subPoints)
                }
            }, function() {
                db.findOne('users', {
                    email: req.body.email
                }, function(re) {
                    if (re.cancellationCount < 5) {
                        res.redirect('back');
                    } else {
                        db.updateOne('users', { email: req.body.email }, {
                            $set: { banned: true }
                        }, function() {
                            var transporter = nodemailer.createTransport({
                                host: 'smtp.gmail.com',
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
                                to: req.body.email,
                                subject: 'Banned Account - Hotel Paraiso',
                                html: `
                                    <head>
                                    <link href="https://fonts.googleapis.com/css?family=Open+Sans:200,300,400,500,600,700,800,900&display=swap" rel="stylesheet">
                                 
                                    </head>
                                    <p style="font-family: 'Open Sans'; letter-spacing: 1px; color: #2E4106; font-size:12px;">
                                        <span style="font-size: 14px">Good day <b>${re.fname} ${re.lname}</b>!</span><br><br>
                                        Your account is currently banned due to excess cancellations for this year. Please contact us through email at paraisohotelscorp@gmail.com or call us through +63 912 345 6789 to reactivate your account.<br>
                                        <br>
                                        Best Regards,<br>
                                        <b>Paraiso Hotel<br>
                                    </p>
                             
                                `
                            };
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {
                                    return console.log(error);
                                }

                                console.log('Email Sent Successfully!');
                                transporter.close();
                            });
                            return res.redirect("/logout");
                        });
                    }
                })
            })
        })
    }
}

module.exports = userController;