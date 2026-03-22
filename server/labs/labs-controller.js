const Laboratory = require('./Lab');
const Reservation = require('../reservations/Reservation');
const { timeToMinutes, getTimeSlots, renderErrorPage } = require('../util/helpers');
const bldgAbbreviations = ['SM', 'EY', 'VL', 'SJ', 'GK', 'LS', 'AG', 'ST', 'MM'];

// Load the manage labs page with all labs
exports.getManageLabsPage = async (req, res) => {
  try {
    const labs = await Laboratory.getAllLabs();
    res.render('manage-labs', {
      title: 'Manage Labs',
      headerTitle: 'Manage Labs',
      layout: 'dashboard',
      activePage: 'manage-labs',
      labs,
      bldgAbbreviations: bldgAbbreviations.sort()
    });

  } catch (err) {
    renderErrorPage(res, err);
  }
};

// Create a new lab
exports.createLab = async (req, res) => {
  try {
    let { roomNumber, capacity, buildingAbbreviation, openTime, closeTime } = req.body;

    name = buildingAbbreviation + roomNumber;
    openTime = timeToMinutes(openTime);
    closeTime = timeToMinutes(closeTime);

    await Laboratory.createLab(name, capacity, openTime, closeTime);
    res.redirect('/labs/manage');
  } catch (error) {
    res.status(500).send('Error creating lab');
  }
};

// Get all available labs for a specific date and time
exports.getAllAvailableLabs = async (req, res) => {
  try {

    const selectedDate = req.query.bookingDate || new Date().toLocaleDateString('en-CA');
    const selectedLabName = req.query.labName || null;
    const datesArray = getNextNDates(7);
    const timeSlotsArray = getTimeSlots(selectedDate, 0, 1440, 30);
    const selectedTime = timeToMinutes(req.query.bookingTime) || (timeSlotsArray.length > 0 ? timeSlotsArray[0] : null);
    const availableLabs = await Laboratory.getAvailableLabs(selectedDate, selectedTime, selectedLabName);
    const availableLabsNoRoomFilter = await Laboratory.getAvailableLabs(selectedDate, selectedTime);
    const labNamesArray = availableLabsNoRoomFilter.map(lab => lab.name);

    res.render('slots-availability', {
      title: 'Slots Availability',
      headerTitle: 'Slots Availability',
      layout: 'dashboard',
      activePage: 'slots-availability',
      datesArray,
      timeSlotsArray,
      labNamesArray,
      selectedDate,
      selectedTime,
      selectedLabName,
      availableLabs
    });
  } catch (err) {
    renderErrorPage(res, err);
  }
};


//Update a lab by ID
exports.updateLab = async (req, res) => {
  try {
    const labId = req.params.id;

    const { buildingAbbreviation, roomNumber, openTime, closeTime, capacity } = req.body;
    const updatedLab = await Laboratory.updateLab(labId, buildingAbbreviation + roomNumber, timeToMinutes(openTime), timeToMinutes(closeTime), capacity);

    res.redirect('/labs/manage');

  } catch (error) {
    renderErrorPage(res, error);
  }
};

// Delete a lab by ID
exports.deleteLab = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLab = await Laboratory.deleteLab(id);

    if (!deletedLab) {
      return res.status(404).send('Lab not found');
    }

    res.redirect('/labs/manage');
  } catch (error) {
    res.status(500).send('Error deleting lab');
  }
};

// Get details of a specific lab, including seat availability for a given date and time
exports.getLab = async (req, res) => {
  try {

    let { bookingTime, bookingDate, labName } = req.body;

    const labSeats = await Laboratory.getLabSeats(labName, timeToMinutes(bookingTime), bookingDate);
    const lab = await Laboratory.getLabByName(labName);
    const timeSlotsArray = getTimeSlots(bookingDate, lab.openTime, lab.closeTime, 30);

    res.render("lab-details", {
      labSeats,
      timeSlotsArray,
      layout: "dashboard",
      activePage: "slots-availability",
      headerTitle: lab.name,
      bookingDate,
      user: res.locals.user,
      bookingTime: timeToMinutes(bookingTime),
      lab: lab.toObject ? lab.toObject() : lab
    });
  } catch (err) {
    renderErrorPage(res, err);
  }
};


// Get seat availability for a specific lab, date, and time
exports.getSeatStatus = async (req, res) => {
  try {
    const { labName, bookingDate, bookingTime } = req.query;

    if (!labName || !bookingDate || !bookingTime) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const seats = await Laboratory.getLabSeats(labName, bookingTime, bookingDate);
    res.json({ labSeats: seats });

  } catch (err) {
    renderErrorPage(res, err);
  }
};

// Get cart availability for a specific lab, date, and time
exports.getCartStatus = async (req, res) => {
  try {
    const { labName, date, cartData } = req.body;
    const updatedStatus = await Reservation.checkCartStatus(labName, date, cartData);
    res.json(updatedStatus);

  } catch (err) {
    renderErrorPage(res, err);
  }
};


function getNextNDates(n = 7) {
  const today = new Date();
  const dates = [];

  for (let i = 0; i < n; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);

    const yyyy = nextDate.getFullYear();
    const mm = String(nextDate.getMonth() + 1).padStart(2, '0');
    const dd = String(nextDate.getDate()).padStart(2, '0');

    dates.push(`${yyyy}-${mm}-${dd}`);
  }
  return dates;
}



