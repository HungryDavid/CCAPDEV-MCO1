const Reservation = require('./Reservation');

exports.createReservation = async (req, res) => {
  try {
    const { labId, date, selections } = req.body;
    
    // Ensure that selections exist and are non-empty
    if (!selections || selections.length === 0) return res.redirect('back');

    // Make selections an array (it can be a single selection string or an array of selections)
    const selectionsArray = Array.isArray(selections) ? selections : [selections];

    // Parse seat numbers and time slots
    const seatNumbers = [];
    const timeSlots = [];

    selectionsArray.forEach(item => {
      const [seat, time] = item.split('|');  // Split each selection into seat and time
      if (!seatNumbers.includes(Number(seat))) seatNumbers.push(Number(seat));  // Avoid duplicates in seat numbers
      if (!timeSlots.includes(time)) timeSlots.push(time);  // Avoid duplicates in time slots
    });

    // Conflict check: For each timeSlot, check if any of the selected seats are already taken
    for (const time of timeSlots) {
      const existing = await Reservation.find({
        laboratory: labId,
        date,
        timeSlots: time
      }).lean();

      const takenSeats = existing.flatMap(r => r.seatNumbers);  // Get all reserved seats for the time slot
      const conflict = seatNumbers.some(seat => takenSeats.includes(seat));  // Check if any selected seat is taken

      if (conflict) {
        return res.status(400).send(`One or more seats already reserved at ${time}`);
      }
    }

    // Create a single reservation entry with all selected seats and time slots
    await Reservation.create({
      user: req.user._id,  // Logged-in user's ID
      userName: req.user.name,  // Logged-in user's name
      laboratory: labId,
      date,
      seatNumbers,  // Array of selected seat numbers
      timeSlots  // Array of selected time slots
    });

    // Redirect to lab details page after reservation is created
    res.redirect(`/labs/${labId}?date=${date}`);  // Now using `labId` in the URL instead of `slug`
  } catch (err) {
    console.error(err);
    res.redirect('/');
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


