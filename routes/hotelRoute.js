const express = require('express');
const router = express();

router.get('/amenities', function(req, res) {
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

    res.render('amenities',{
        whichfooter: footertype,
        logging: loggingstring
    });
});

router.get('/gym', function(req, res) {
    var headertype = 'header';
    var footertype = 'footer';

    // console.log(req.session.userId);
    if (req.session.userId){
        headertype = 'headerUser';
        footertype = 'footerUser';
    }

    if (req.session.adminId){
        headertype = 'headerAdmin';
        footertype = 'footerAdmin';
    }

    res.render('gym',{
        whichheader: headertype,
        whichfooter: footertype
    });
});

router.get('/memberBenefits', function(req, res) {
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

    res.render('memberBenefits',{
        logging: loggingstring,
        whichfooter: footertype
    });
});

router.get('/pool', function(req, res) {
    var headertype = 'header';
    var footertype = 'footer';

    // console.log(req.session.userId);
    if (req.session.userId){
        headertype = 'headerUser';
        footertype = 'footerUser';
    }

    if (req.session.adminId){
        headertype = 'headerAdmin';
        footertype = 'footerAdmin';
    }

    res.render('pool',{
        whichheader: headertype,
        whichfooter: footertype
    });
});

router.get('/restaurant', function(req, res) {
    var headertype = 'header';
    var footertype = 'footer';

    // console.log(req.session.userId);
    if (req.session.userId){
        headertype = 'headerUser';
        footertype = 'footerUser';
    }

    if (req.session.adminId){
        headertype = 'headerAdmin';
        footertype = 'footerAdmin';
    }

    res.render('restaurant',{
        whichheader: headertype,
        whichfooter: footertype
    });
});

router.get('/rooms', function(req, res) {
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

    res.render('rooms',{
        whichfooter: footertype,
        logging: loggingstring
    });
});

router.get('/spa', function(req, res) {
    var headertype = 'header';
    var footertype = 'footer';

    // console.log(req.session.userId);
    if (req.session.userId){
        headertype = 'headerUser';
        footertype = 'footerUser';
    }

    if (req.session.adminId){
        headertype = 'headerAdmin';
        footertype = 'footerAdmin';
    }

    res.render('spa', {
        whichheader: headertype,
        whichfooter: footertype
    });
});

module.exports = router;