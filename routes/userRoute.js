const express = require('express');
const router = express();
const { ObjectId } = require('mongodb').ObjectID;
const hbs = require('hbs');
const nodemailer = require('nodemailer');

const routerFunction = function(db) {
    //helpers for tab2 and tab3
    hbs.registerHelper('ifCD', function(arg1, options) {
        if (arg1 == "Classic Deluxe"){
            return options.fn(this);
        }
        else return options.inverse(this);
    });
    hbs.registerHelper('ifFD', function(arg1, options) {
        if (arg1 == "Family Deluxe"){
            return options.fn(this);
        }
        else return options.inverse(this);
    });
    hbs.registerHelper('ifED', function(arg1, options) {
        if (arg1 == "Executive Deluxe"){
            return options.fn(this);
        }
        else return options.inverse(this);
    });
    hbs.registerHelper('ifJS', function(arg1, options) {
        if (arg1 == "Junior Suite"){
            return options.fn(this);
        }
        else return options.inverse(this);
    });
    hbs.registerHelper('ifES', function(arg1, options) {
        if (arg1 == "Executive Suite"){
            return options.fn(this);
        }
        else return options.inverse(this);
    });
    hbs.registerHelper('ifGS', function(arg1, options) {
        if (arg1 == "Grand Suite"){
            return options.fn(this);
        }
        else return options.inverse(this);
    });

    hbs.registerHelper('format', function(text) {
        return parseFloat(text).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    });
    
    //check if user is logged in, if not, he/she cannot access the page such as profile and admin， and log out
    const notLoggedInUser = (req, res, next) => {
        if (!req.session.userId) {
            if (!req.session.adminId)
                return res.redirect('/signIn'); 
            else
                return res.redirect('/admin');
        } 
        return next();
    };
    
    router.get('/',notLoggedInUser ,function(req, res) {
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
                <a class="nav-link" data-toggle="modal" data-target="#exampleModal">Log Out</a>\
            </li>\
            <li class="nav-item">\
                <a class="nav-link bookBtn active" href="/user" tabindex="-1" aria-disabled="true">PROFILE</a>\
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
                <a class="nav-link" data-toggle="modal" data-target="#exampleModal">Log Out</a>\
            </li>\
            <li class="nav-item">\
                <a class="nav-link bookBtn" href="/admin" tabindex="-1" aria-disabled="true">ADMIN</a>\
            </li>\
            `;
            footertype = 'footerAdmin';
        }
        var user=null;
        var today = new Date();
        var year =  today.getFullYear();
        var month=Number(today.getMonth())+1;
        var day = today.getDate();
        if (day< 10) { 
            day = '0' + day; 
        } 
        if (month < 10) { 
            month = '0' + month; 
        } 
        var today = year + '-' + month + '-' + day; 
        db.collection('users').find({ 
            _id:ObjectId(req.session.userId)
        }).toArray().then(function(resp){
                user=resp;
                // console.log(resp[0].email);
                db.collection('booking').find({ 
                    email:user[0].email,
                    checkInDate: {$gte:today.toString()},
                    status:"Booked"
                }).sort({checkInDate:1}).toArray().then(r=> {
                    db.collection('booking').find({ 
                        email:user[0].email,
                        checkInDate: {$lt:today.toString()},
                        status:"Check Out"
                    }).sort({checkInDate:-1}).toArray().then(r2 =>{
                        return res.render('profile', {
                            name: user[0].fname+" "+ user[0].lname,
                            membershipNumber: user[0].membershipNumber,
                            email: user[0].email,
                            creditCard: user[0].creditcardNumber,
                            points:user[0].membershipPoints,
                            cancelCount: user[0].cancellationCount,
                            whichfooter: footertype,
                            logging: loggingstring,
                            tab2:r,
                            tab3:r2
                        });
                    });    
                });
            // return res.status(201);
        }).catch(err => {
            // res.render('profile', {
            //     message:"An error occured! Please reload the page!.",
            //     whichfooter: footertype,
            //     logging: loggingstring
            // });
            console.log(err);
            return res.status(500);
        });
    });   

    // Post for Cancel Reservation
    router.post('/',function(req, res) {
        var today = new Date();
        var formattedDate = today.getFullYear().toString()+'-'+(today.getMonth()+1).toString().padStart(2,0)+'-'+today.getDate().toString().padStart(2,0);
        db.collection('booking').updateOne(
            {
                email:req.body.email,
                _id:ObjectId(req.body.ID),
                status:"Booked"
            },
            {
                $set:{ status : "Cancelled" , cancelledDate : formattedDate.toString()}
            }
        ). then(resp=>{
            var subPoints = Number(parseInt(req.body.payment)/Number(10)*Number(-1));
            db.collection('users').updateOne(
                {email:req.body.email},
                {
                    $inc: {
                        cancellationCount:1,
                        membershipPoints: parseInt(subPoints)
                    }
                }
            ).then(r=>
                db.collection('users').findOne({
                    email:req.body.email
                }).then(re=>{
                    if(re.cancellationCount<5){
                        res.redirect('back');
                    }
                    else{
                        db.collection('users').updateOne(
                            {email:req.body.email},
                            {
                                $set:{banned:true}
                            }
                        );
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
                    }
                })
            ).catch(er=>console.log(er));
        }).catch(err=> console.log(err));
    });

    return router;
}

module.exports = routerFunction;