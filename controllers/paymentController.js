const db = require('../models/db.js');
const { ObjectId } = require('mongodb');
const nodemailer = require('nodemailer');

var totalChargeBody, lastname, firstname, emailglobe, database;
var payBody, cardowner, idBook, card, cardNum, databasepay;
var imagesource;

const paymentController = {
    viewTotalCharge: function(req, res) {

        var headertype = 'header';
        var footertype = 'footer';
        var totalChargetype = 'totalChargeGuest';
        var point = "";
        var bedOne = "Two Twin Beds";
        var bedTwo = "One King Bed"

        if (req.body.roomtype === 'Classic Deluxe') {
            bedOne = "Two Single Beds";
            bedTwo = "One Queen Bed";
        } else if (req.body.roomtype === 'Grand Suite') {
            bedOne = "Two Queen Beds";
            bedTwo = "One King Bed & One Single Bed";
        }

        // console.log(req.session.userId);
        if (req.session.userId) {
            headertype = 'headerUser';
            footertype = 'footerUser';
            totalChargetype = 'totalChargeUser';

            var userid = { _id: ObjectId(req.session.userId) }

            db.findOne('users',userid, function(resp){
                point = resp.membershipPoints;
                // console.log(point);
            });

        if (req.session.adminId) {
            headertype = 'headerAdmin';
            footertype = 'footerAdmin';
        }

        if (firstname) {
            return res.render('totalCharge', {
                data: totalChargeBody,
                fnameError: firstname,
                source: '/images/Rooms/' + imagesource + '.jpg',
                whichheader: headertype,
                whichfooter: footertype,
                whichtotalCharge: totalChargetype,
                memberPoints: point,
                bedChoiceOne: bedOne,
                bedChoiceTwo: bedTwo
            });
        }

        else if (lastname) {
            return res.render('totalCharge', {
                data: totalChargeBody,
                lnameError: lastname,
                source: '/images/Rooms/' + imagesource + '.jpg',
                whichheader: headertype,
                whichfooter: footertype,
                whichtotalCharge: totalChargetype,
                memberPoints: point,
                bedChoiceOne: bedOne,
                bedChoiceTwo: bedTwo
            });
        }

        else if (emailglobe) {
            return res.render('totalCharge', {
                data: totalChargeBody,
                emailError: emailglobe,
                source: '/images/Rooms/' + imagesource + '.jpg',
                whichheader: headertype,
                whichfooter: footertype,
                whichtotalCharge: totalChargetype,
                memberPoints: point,
                bedChoiceOne: bedOne,
                bedChoiceTwo: bedTwo
            });
        }

        else if (database) {
            return res.render('totalCharge', {
                data: totalChargeBody,
                databaseError: database,
                source: '/images/Rooms/' + imagesource + '.jpg',
                whichheader: headertype,
                whichfooter: footertype,
                whichtotalCharge: totalChargetype,
                memberPoints: point,
                bedChoiceOne: bedOne,
                bedChoiceTwo: bedTwo
            });
        }

        else{
            return res.render('totalCharge', {
                data: totalChargeBody,
                source: '/images/Rooms/' + imagesource + '.jpg',
                whichheader: headertype,
                whichfooter: footertype,
                whichtotalCharge: totalChargetype,
                memberPoints: point,
                bedChoiceOne: bedOne,
                bedChoiceTwo: bedTwo
            });
        }
    }
    }
}

module.exports = paymentController;