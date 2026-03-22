const Reservation = require('./Reservation');
const Laboratory = require('../labs/Lab');
const User = require('../users/User');
const { getTimeSlots, renderErrorPage, timeToMinutes, minutesToTime } = require('../util/helpers');

function formatReservationToCart(reservation) {
  const formatted = {};

  reservation.slots.forEach(slot => {
    // We use the startTime as the key (e.g., 810 or 1050)
    formatted[slot.startTime] = {
      seatNumber: slot.seatNumber.toString(), // Ensures it is a string as requested
      status: "Reserved" // Usually, if it's in the reservation object, it's reserved
    };
  });
  return formatted;
}

function formatSlotsForSchema(cart) {
  return Object.entries(cart).map(([timeKey, data]) => {
    const startTime = parseInt(timeKey, 10);

    return {
      seatNumber: parseInt(data.seatNumber, 10),
      startTime: startTime,
      endTime: startTime + 30
    };
  })
};

// Create a new reservation
exports.createReservation = async (req, res) => {
  try {
    const { isAnonymous, studentNumber, selectedLab, selectedDate, labCart } = req.body;
    let userId = req.session.userId;

    if (req.session.role === "technician") {
      let user = await User.getUserByStudentId(studentNumber);
      userId = user._id;
    }

    const lab = await Laboratory.getLabByName(selectedLab);

    await Reservation.createReservation(userId, isAnonymous, lab._id, selectedDate, formatSlotsForSchema(labCart));

    res.status(200).json({
      message: "Reservation confirmed successfully!"
    });

  } catch (err) {
    const statusCode = err.errorNumber || 500;
    const formattedMessage = `${err.errorMessage || err.message} (${statusCode})`;

    res.status(statusCode).json({
      message: formattedMessage
    });
  }
};

// Edit an existing reservation
exports.loadReservationForUpdate = async (req, res) => {
  try {
    let reservationId = req.params.id;

    const reservation = await Reservation.getReservationById(reservationId);
    const cartData = formatReservationToCart(reservation);

    const labSeats = await Laboratory.getLabSeats(reservation.laboratory.name, reservation.slots[0].startTime, reservation.date);
    const lab = await Laboratory.getLabByName(reservation.laboratory.name);
    const timeSlotsArray = getTimeSlots(reservation.date, lab.openTime, lab.closeTime, 30);

    res.render("lab-details", {
      labSeats,
      timeSlotsArray,
      layout: "dashboard",
      activePage: "slots-availability",
      reservationId,
      headerTitle: lab.name,
      bookingDate: reservation.date,
      cartSession: JSON.stringify(cartData),
      lab: lab.toObject ? lab.toObject() : lab
    });
  } catch (err) {
    renderErrorPage(res, err);
  }
};

//Get Reservation
exports.getReservationJSON = async (req, res) => {
  try {
    let { labName, bookingDate, bookingTime, seatNumber } = req.query;
    console.log(labName, bookingDate, bookingTime, seatNumber);
    const reservationId = await Reservation.getReservationIdByLabNameDateTimeSeat(
      labName,
      bookingDate,
      bookingTime,
      seatNumber
    )
    res.json({
      redirectUrl: `/reservation/${reservationId}/update`
    });
  } catch (err) {
    renderErrorPage(res, err);
  }
}

// Get all reservations for a user
exports.getUserReservations = async (req, res) => {
  try {
    const sessionUser = await User.getUserById(req.session.userId);
    const reservations = await Reservation.getUpcomingUserReservations(sessionUser);
    const pastReservations = await Reservation.getUserPastReservations(sessionUser);
    res.render('my-reservations', {
      user: sessionUser,
      account: sessionUser,
      title: 'My Reservations',
      headerTitle: 'My Reservations',
      layout: 'dashboard',
      activePage: 'my-reservations',
      reservations,
      pastReservations
    });

  } catch (err) {
    renderErrorPage(res, err);
  }
};

// Update an existing reservation
exports.updateReservation = async (req, res) => {
  try {
    const { isAnonymous, reservationId, sessionCart } = req.body;

    if (!reservationId || !sessionCart || Object.keys(sessionCart).length === 0) {
      return res.status(400).json({ message: 'Reservation ID and session cart are required.' });
    }

    const updatedReservation = await Reservation.updateReservation(reservationId, formatSlotsForSchema(sessionCart), isAnonymous);

    res.status(200).json({
      message: 'Reservation updated successfully',
    })

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

    if (req.query.lab) filter.laboratory = req.query.lab;
    if (req.query.date) filter.date = req.query.date;
    if (req.query.student) filter.studentId = req.query.student;

    const reservations = await Reservation.getReservations(filter);
    res.json(reservations);

  } catch (err) {
    res.status(500).send(err.message);
  }
};

// deletes a reservation
exports.deleteReservation = async (req, res) => {
  try {

    const { labName, bookingDate, bookingTime, seatNumber } = req.body;

    let { id } = req.body;
    if (!id) {
      id = await Reservation.getReservationIdByLabNameDateTimeSeat(
        labName,
        bookingDate,
        bookingTime,
        seatNumber
      );
    }
    await Reservation.deleteReservation(id);

    if (req.session.role === "technician") {
      res.redirect("/labs/slots-availability/" + labName);
    } else
      res.redirect("/reservation");
  } catch (err) {
    console.log(err);
    res.status(404).send(err.message);
  }
};

