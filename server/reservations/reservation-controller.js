const Reservation = require('./Reservation');

exports.createReservation = async (req, res) => {
  try {
    const reservation = await Reservation.createReservation(req.body);
    res.status(201).json({ status: 'success', data: reservation });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.getReservations(req.query);
    res.status(200).json({ status: 'success', results: reservations.length, data: reservations });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getReservation = async (req, res) => {
  try {
    const reservation = await Reservation.getReservationById(req.params.id);
    res.status(200).json({ status: 'success', data: reservation });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err.message });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.updateReservation(req.params.id, req.body);
    res.status(200).json({ status: 'success', data: reservation });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    await Reservation.deleteReservation(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err.message });
  }
};