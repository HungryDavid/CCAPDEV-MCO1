const Laboratory = require('./Lab');
const Reservation = require('../reservations/Reservation');


exports.getPage = async (req, res) => {
    try {
        // Fetch all labs from the database
        const labs = await Laboratory.getAllLabs(req.query);
        console.log(labs);  // Log the labs data to check what you're receiving

        // Render the page with labs data
        res.render('manage-labs', {
            title: 'Manage Labs',
            headerTitle: 'Manage Labs',
            layout: 'dashboard',
            activePage: 'manage-labs',
            labs
        });

    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
};

exports.getSlotsAvailabilityPage = async (req, res) => {
  try {
    const selectedDate = req.query.bookingDate || getNextNDates(7)[0];
    const selectedLabId = req.query.labName || null;

    const todayStr = new Date().toISOString().split('T')[0];
    const isToday = selectedDate === todayStr;

    // Generate next 7 dates and time slots
    const availableDates = getNextNDates(7);
    const allTimeSlots = getTimeSlots(isToday);

    // Fetch all labs or filtered by selected lab
    let labsQuery = {};
    if (selectedLabId) labsQuery._id = selectedLabId;
    const allLabs = await Laboratory.getAllLabs(labsQuery);

    // Compute available slots per lab
    const labsWithAvailableSlots = [];

    for (const lab of allLabs) {
      // Generate all possible slots within lab open-close time
      const labSlots = allTimeSlots.filter(
        slot => slot >= lab.openTime && slot < lab.closeTime
      );

      // Fetch existing reservations for this lab/date
      const reservations = await Reservation.find({
        laboratory: lab._id,
        date: selectedDate
      }).lean();

      const reservedSlots = reservations.flatMap(r => r.timeSlots);

      // Available slots = labSlots - reservedSlots
      const availableSlots = labSlots.filter(slot => !reservedSlots.includes(slot));

      labsWithAvailableSlots.push({
        ...lab,
        availableSlots
      });
    }

    res.render('slots-availability', {
      title: 'Slots Availability',
      headerTitle: 'Slots Availability',
      layout: 'dashboard',
      currentDate: todayStr,
      activePage: 'slots-availability',
      availableDates,
      selectedDate,
      labs: labsWithAvailableSlots,
      selectedLabId
    });

  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
};

exports.getSlotsAvailabilityPage = async (req, res) => {
  try {
    const selectedDate = req.query.bookingDate || getNextNDates(7)[0];
    const selectedTime = req.query.bookingTime || null; // single slot or null
    const selectedLabId = req.query.labName || null;

    const todayStr = new Date().toISOString().split('T')[0];
    const isToday = selectedDate === todayStr;

    // Generate dates and time slots
    const availableDates = getNextNDates(7);
    const timeSlots = getTimeSlots(isToday);
    const autoSelectedTime = selectedTime || (timeSlots.length > 0 ? timeSlots[0] : null);

    // Filter labs by labName if provided
    let labsQuery = {};
    if (selectedLabId) labsQuery._id = selectedLabId;

    const allLabs = await Laboratory.getAllLabs(labsQuery);

    // Compute available slots count per lab
    const labsWithAvailability = [];

    for (const lab of allLabs) {
      // Skip if selected time is outside lab hours
      if (autoSelectedTime && (autoSelectedTime < lab.openTime || autoSelectedTime >= lab.closeTime)) {
        continue;
      }

      // Count reservations for this lab at selected date/time
      let reservedCount = 0;
      if (autoSelectedTime) {
        const reservations = await Reservation.find({
          laboratory: lab._id,
          date: selectedDate,
          timeSlots: autoSelectedTime
        }).lean();
        reservedCount = reservations.length;
      }

      const availableSlotsCount = lab.capacity - reservedCount;
      //console.log(availableSlotsCount);

      let image = "/imgs/logo.png"; // fallback default image

      if (lab.name.startsWith("GK")) {
        image = "/imgs/gk-building.jpg";
      } else if (lab.name.startsWith("LS")) {
        image = "/imgs/ls-building.png";
      } else if (lab.name.startsWith("VL")) {
        image = "/imgs/vl-building.jpg";
      }


      labsWithAvailability.push({
        ...lab,
        image,
        availableSlotsCount: availableSlotsCount >= 0 ? availableSlotsCount : 0
      });
    }


    res.render('slots-availability', {
      title: 'Slots Availability',
      headerTitle: 'Slots Availability',
      layout: 'dashboard',
      currentDate: todayStr,
      activePage: 'slots-availability',
      availableDates,
      selectedDate,
      timeSlots,
      selectedTime: autoSelectedTime,
      labs: labsWithAvailability,
      selectedLabId
    });

  } catch (err) {
    console.error(err);
    res.redirect('/esfefw');
  }
};


// 1. CREATE: Create a new lab
exports.createLab = async (req, res) => {
    try {
        const { name, capacity, openTime, closeTime, image } = req.body;

        // Create the lab
        const labData = {
            name,
            capacity,
            openTime,
            closeTime,
            image: image || 'lab-default.jpg' // Use default image if not provided
        };

        const newLab = await Laboratory.createLab(labData);
        res.redirect('/manage-labs'); // Redirect to the list of labs after creating
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating lab');
    }
};


// 3. READ ONE: Get a specific lab by ID for editing
exports.getLabById = async (req, res) => {
    try {
        const { id } = req.params;
        const lab = await Laboratory.getLabById(id);
        if (!lab) {
            return res.status(404).send('Lab not found');
        }
        res.render('labs/edit-lab', { lab }); // Pass lab to edit form view
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching lab for editing');
    }
};

// 4. UPDATE: Update a lab's details
exports.updateLab = async (req, res) => {
    try {
        const labId = req.params.id;  // Get the lab ID from the URL
        const { name, openTime, closeTime, capacity } = req.body;  // Extract data from the form submission

        // Call the updateLab method from the model
        const updatedLab = await Laboratory.updateLab(labId, {
            name,
            openTime,
            closeTime,
            capacity
        });

        // Redirect back to the labs page with updated lab list
        res.redirect('/manage-labs');  // Adjust if needed to the correct route

    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while updating the lab.");
    }
};

// 5. DELETE: Delete a lab by ID
exports.deleteLab = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedLab = await Laboratory.deleteLab(id);

        if (!deletedLab) {
            return res.status(404).send('Lab not found');
        }

        res.redirect('/manage-labs'); // Redirect to labs list after successful deletion
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting lab');
    }
};

function getTimeSlots(skipPast = true, intervalMinutes = 30, start = "07:30", end = "21:00") {
  const slots = [];
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);

  const now = new Date();
  const startTime = new Date();
  startTime.setHours(startH, startM, 0, 0);

  const endTime = new Date();
  endTime.setHours(endH, endM, 0, 0);

  // Subtract one interval to avoid creating a slot that ends after lab closes
  endTime.setMinutes(endTime.getMinutes() - intervalMinutes);

  let slotTime = new Date(startTime);

  while (slotTime <= endTime) {
    if (!skipPast || slotTime >= now) {
      const hours = slotTime.getHours();
      const minutes = slotTime.getMinutes();
      const formatted = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
      slots.push(formatted);
    }
    slotTime.setMinutes(slotTime.getMinutes() + intervalMinutes);
  }

  return slots;
}

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