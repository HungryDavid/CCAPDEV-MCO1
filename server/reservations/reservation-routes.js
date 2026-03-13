const express = require('express');
const router = express.Router();
const reservationController = require('./reservation-controller');

router.post('/update-technician', reservationController.updateReservation);
router.post('/update', reservationController.updateReservation);
router.post('/create', reservationController.createReservation);
router.post('/delete', reservationController.deleteReservation);
router.post('/availability', reservationController.checkSeatAvailability);
router.get('/', reservationController.getReservationById);

module.exports = router;