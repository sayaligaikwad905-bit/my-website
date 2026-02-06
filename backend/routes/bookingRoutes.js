const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookingcontrollers');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, controller.getBookings);
router.post('/', verifyToken, controller.createBooking);

module.exports = router;