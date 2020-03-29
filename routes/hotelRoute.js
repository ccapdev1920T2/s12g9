const express = require('express');

const hotelController = require('../controllers/hotelController.js');

const router = express();

router.get('/amenities', hotelController.viewAmenitiesPage);

router.get('/gym', hotelController.viewGymPage);

router.get('/memberBenefits', hotelController.viewMemberBenefit);

router.get('/pool', hotelController.viewPoolPage);

router.get('/restaurant', hotelController.viewRestaurantPage);

router.get('/rooms', hotelController.viewRoomsPage);

router.get('/spa', hotelController.viewSpaPage);

module.exports = router;