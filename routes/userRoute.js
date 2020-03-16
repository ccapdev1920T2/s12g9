const express = require('express');
const router = express();
const { ObjectId } = require('mongodb');
const hbs = require('hbs');
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
    //check if user is logged in, if not, he/she cannot access the page such as profile and admin， and log out
    const notLoggedInUser = (req, res, next) => {
        if (!req.session.userId) {
            if (!req.session.adminId)
                res.redirect('/signIn'); 
            else
                res.redirect('/admin');
        } 
        return next();
    };
    // TODO: Double check db names
    // TODO: tab 1 - DONE
    // TODO: tab 2 - DONE (for furthur testing)
    // TODO: do tab 3 - past bookings
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

        var user = null;
        var pastBookings = null;
        var currBookings = null;
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
        // console.log(req.session.userId); //prints userid in db
        // db.collection('users').find({_id:ObjectId(req.session.userId)}).toArray().then(resp=>{console.log(resp)});
        db.collection('users').find({ 
            _id:ObjectId(req.session.userId)
        }).toArray().then(
            resp=>{
                // res.render('profile', {
                //     name: resp[0].fname+" "+ resp[0].lname,
                //     membershipNumber: resp[0].membershipNumber,
                //     email: resp[0].email,
                //     creditCard: resp[0].creditCardNumber,
                //     // guests:
                //     points:resp[0].membershipPoints,
                //     whichfooter: footertype,
                //     logging: loggingstring
                // });
                user=resp;
                db.collection('bookings').find({ 
                    email:user[0].email,
                    checkInDate: {$gte:today.toString()}
                }).toArray().then(r=> {
                    console.log(r)
                    res.render('profile', {
                        name: resp[0].fname+" "+ resp[0].lname,
                        membershipNumber: resp[0].membershipNumber,
                        email: resp[0].email,
                        creditCard: resp[0].creditCardNumber,
                        // guests:
                        points:resp[0].membershipPoints,
                        whichfooter: footertype,
                        logging: loggingstring,
                        tab2:r
                    });
                });
            // TODO: for testing console.log(resp);
            return res.status(201);
        }).catch(err => {
            res.render('profile', {
                message:"An error occured! Please reload the page!.",
        });
            return res.status(500);
        });
    });    
    return router;
}

module.exports = routerFunction;