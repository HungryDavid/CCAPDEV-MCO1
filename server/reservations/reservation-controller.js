const Reservation = require('./Reservation');
const Laboratory = require('../labs/Lab');
const User = require('../users/User');
const { getTimeSlots, renderErrorPage } = require('../util/helpers');


exports.createReservation = async (req, res) => {
  try {
    const { isAnonymous, userId, selectedLab, selectedDate, labCart } = req.body;
    let studentId = req.session.userId;

    if (req.session.role === "technician") {
      if (userId) {
        const studentData = await User.getIdByStudentId(userId);
        studentId = studentData._id; // This works for real users AND walk-ins now
      } else {
        return res.status(400).json({ message: "Please provide a Student ID." });
      }
    }

    const labId = await Laboratory.getIdByName(selectedLab);

    const slots = [];
    for (const [timeSlot, seatObj] of Object.entries(labCart)) {
      if (!seatObj || !seatObj.seatNumber) continue;

      const seatNumber = Number(seatObj.seatNumber);
      if (isNaN(seatNumber)) continue;

      slots.push({ timeSlot, seatNumber });
    }

    if (slots.length === 0) {
      return res.status(400).json({ message: "No seats selected." });
    }

    await Reservation.createReservation({
      userId: studentId,         
      anonymous: isAnonymous,   
      labId: labId,              
      reservationDate: selectedDate, 
      timeSlots: slots.map(s => s.timeSlot), 
      seatNumbers: slots.map(s => s.seatNumber),
      walkInStudent: req.session.role === "technician" ? `Walk-in: ID ${studentId}` : null
    });

    res.status(200).json({
      message: "Reservation confirmed successfully!"
    });

  } catch (err) {
    console.log(err);
    const statusCode = err.errorNumber || 500;
    const formattedMessage = `${err.errorMessage || err.message} (${statusCode})`;

    res.status(statusCode).json({
      message: formattedMessage
    });
  }
};

exports.getReservationById = async (req, res) => {
  try {
    const sessionUser = await User.readUserByIdSafe(req.session.userId).lean();
    const reservations = await Reservation.getUpcomingReservationsByUser(req.session.userId);

    res.render('my-reservations', {
      user: sessionUser,
      account: sessionUser,
      title: 'My Reservations',
      headerTitle: 'My Reservations',
      layout: 'dashboard',
      activePage: 'my-reservations',
      reservations
    });

  } catch (err) {
    console.log(err);
    res.status(404).send(err.message);

  }
};

exports.updateReservation = async (req, res) => {
  try {
    const { isAnonymous, _id, sessionCart } = req.body;

    if (!_id || !sessionCart || Object.keys(sessionCart).length === 0) {
      return res.status(400).json({ message: 'Reservation ID and session cart are required.' });
    }

    const updatedReservation = await Reservation.updateReservationFromCart(_id, sessionCart, isAnonymous);

    const formattedSlots = {};
    updatedReservation.slots.forEach(slot => {
      formattedSlots[slot.timeSlot] = {
        seatNumber: String(slot.seatNumber),
        status: 'available'
      };
    });

    res.status(200).json({
      message: 'Reservation updated successfully.',
      _id: updatedReservation._id,
      slots: formattedSlots
    });

  } catch (err) {
    console.error('Error updating reservation:', err);
    const statusCode = err.errorNumber || 500;
    res.status(statusCode).json({
      message: err.errorMessage || err.message || 'Internal Server Error'
    });
  }
};


exports.getReservations = async (req, res) => {
  try {

    const filter = {};

    if (req.query.lab) filter.labId = req.query.lab;
    if (req.query.date) filter.date = req.query.date;
    if (req.query.student) filter.studentId = req.query.student;

    const reservations = await Reservation.getReservations(filter);

    res.json(reservations);

  } catch (err) {

    res.status(500).send(err.message);

  }
};

exports.deleteReservation = async (req, res) => {
  try {

    const { labName, bookingDate, bookingTime, seatNumber } = req.body;
    let seat;
    if (seatNumber) {
      seat = parseInt(seatNumber, 10);

      if (isNaN(seat)) {
        return res.status(400).send({ error: "Invalid seat number provided." });
      }
    }

    let { id } = req.body;
    if (labName && bookingDate && bookingTime && seat) {
      id = await Reservation.getReservationIdByLabNameDateTimeSeat(
        labName,
        bookingDate,
        bookingTime,
        seat
      );
    }

    await Reservation.deleteReservation(id);

    if (req.session.role === "technician") {
      res.redirect("/labs/slots-availability");
    } else 
      res.redirect("/reservation");
    

  } catch (err) {

    console.log(err);
    res.status(404).send(err.message);

  }
};

exports.checkSeatAvailability = async (req, res, next) => {
  try {
    const { selectedLab, selectedDate, labCart } = req.body;
    const timeSlots = Object.keys(labCart);
    const seatNumbers = Object.values(labCart);
    const labId = await Laboratory.getIdByName(selectedLab);
    const slotStatus = await Reservation.checkSlotStatus(labId, selectedDate, labCart);
    return res.json(slotStatus);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
