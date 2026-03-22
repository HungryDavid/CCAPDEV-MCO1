const express = require('express');
const router = express.Router();
const reservationController = require('./reservation-controller');
router.get('/update-technician', reservationController.getReservationJSON);
router.get('/:id/update', reservationController.loadReservationForUpdate);
router.post('/:id/update', reservationController.updateReservation);
router.post('/create', reservationController.createReservation);
router.post('/delete', reservationController.deleteReservation);
router.get('/', reservationController.getUserReservations);

module.exports = router;