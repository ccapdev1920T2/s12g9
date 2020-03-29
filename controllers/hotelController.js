const db = require('../models/db.js');

const hotelController = {

    viewAmenitiesPage: function(req, res) {
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
    
        return res.render('amenities', {
            whichfooter: footertype,
            logging: loggingstring
        });
    },

    viewGymPage: function(req, res) {
        var headertype = 'header';
        var footertype = 'footer';
    
        // console.log(req.session.userId);
        if (req.session.userId) {
            headertype = 'headerUser';
            footertype = 'footerUser';
        }
    
        if (req.session.adminId) {
            headertype = 'headerAdmin';
            footertype = 'footerAdmin';
        }
    
        return res.render('gym', {
            whichheader: headertype,
            whichfooter: footertype
        });
    },

    viewMemberBenefit : function(req, res) {
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
                <a class="nav-link active" href="/hotel/memberBenefits">Member Benefits</a>\
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
                <a class="nav-link active" href="/hotel/memberBenefits">Member Benefits</a>\
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
    
        return res.render('memberBenefits', {
            logging: loggingstring,
            whichfooter: footertype
        });
    },
    
    viewPoolPage: function(req, res) {
        var headertype = 'header';
        var footertype = 'footer';
    
        // console.log(req.session.userId);
        if (req.session.userId) {
            headertype = 'headerUser';
            footertype = 'footerUser';
        }
    
        if (req.session.adminId) {
            headertype = 'headerAdmin';
            footertype = 'footerAdmin';
        }
    
        return res.render('pool', {
            whichheader: headertype,
            whichfooter: footertype
        });
    },

    viewRestaurantPage: function(req, res) {
        var headertype = 'header';
        var footertype = 'footer';
    
        // console.log(req.session.userId);
        if (req.session.userId) {
            headertype = 'headerUser';
            footertype = 'footerUser';
        }
    
        if (req.session.adminId) {
            headertype = 'headerAdmin';
            footertype = 'footerAdmin';
        }
    
        return res.render('restaurant', {
            whichheader: headertype,
            whichfooter: footertype
        });
    },

    viewRoomsPage: function(req, res) {
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
    
        return res.render('rooms', {
            whichfooter: footertype,
            logging: loggingstring
        });
    },

    viewSpaPage: function(req, res) {
        var headertype = 'header';
        var footertype = 'footer';
    
        // console.log(req.session.userId);
        if (req.session.userId) {
            headertype = 'headerUser';
            footertype = 'footerUser';
        }
    
        if (req.session.adminId) {
            headertype = 'headerAdmin';
            footertype = 'footerAdmin';
        }
    
        return res.render('spa', {
            whichheader: headertype,
            whichfooter: footertype
        });
    }

}

// exports the object `controller` (defined above) when another script exports from this file
module.exports = hotelController;