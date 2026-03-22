const mongoose = require('mongoose');
const Reservation = require('../reservations/Reservation');
const moment = require('moment');
const CustomError = require('../util/CustomError');

const laboratorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A lab must have a name'],
    unique: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'A lab must have a total number of seats'],
    min: [1, 'Lab must have at least one seat']
  },
  image: {
    type: String,
    default: 'lab-default.jpg'
  },
  openTime: {
    type: Number,
    min: 0,
    max: 1439,
    required: [true, 'A lab must have an open time']
  },
  closeTime: {
    type: Number,
    min: 0,
    max: 1439,
    required: [true, 'A lab must have a close time']
  }
},
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });


function getLabImage(name) {
  let image;
  switch (true) {
    case name.startsWith("AG"):
      image = "/imgs/ag-building.webp";
      break;
    case name.startsWith("EY"):
      image = "/imgs/ey-building.webp";
      break;
    case name.startsWith("GK"):
      image = "/imgs/gk-building.webp";
      break;
    case name.startsWith("LS"):
      image = "/imgs/ls-building.webp";
      break;
    case name.startsWith("MM"):
      image = "/imgs/mm-building.webp";
      break;
    case name.startsWith("SJ"):
      image = "/imgs/sj-building.webp";
      break;
    case name.startsWith("SM"):
      image = "/imgs/sm-building.webp";
      break;
    case name.startsWith("ST"):
      image = "/imgs/vl-building.webp";
      break;
    case name.startsWith("VL"):
      image = "/imgs/vl-building.webp";
      break;
    default:
      image = "/imgs/logo.png";
  }
  return image;
}

//create a lab
laboratorySchema.statics.createLab = async function (name, capacity, openTime, closeTime) {
  if (!name || !capacity || !openTime || !closeTime) {
    throw new Error("All fields are required");
  }

  const existingLab = await this.findOne({ name: name });
  if (existingLab) {
    throw new Error("Laboratory already exists");
  }

  let image = getLabImage(name);
  return await this.create({ name, capacity, openTime, closeTime, image });
};

laboratorySchema.statics.doesLabExist = function (name) {
  return this.findOne({ name });
};


//Get all Labs 
laboratorySchema.statics.getAllLabs = async function () {
  const labs = await this.find({}).lean();

  return labs.map(lab => {
    // This regex splits 'gk306a' into ['gk', '306a']
    const match = lab.name.match(/^([a-z]+)(\d+.*)$/i);

    if (match) {
      lab.bldg = match[1];
      lab.roomNumber = match[2];
    }

    return lab;
  });

};

//update a lab
laboratorySchema.statics.updateLab = async function (id, name, openTime, closeTime, capacity) {
  const existingLab = await this.findOne({ name: name, _id: { $ne: id } });
  if (existingLab) {
    throw new CustomError(400, 'Bad Request', "Another laboratory with the same name already exists");
  }

  let image = getLabImage(name);

  
  return this.findByIdAndUpdate(id, { name, openTime, closeTime, capacity, image}, {
    new: true,
    runValidators: true,
  });
};

//delete a lab
laboratorySchema.statics.deleteLab = function (id) {
  return this.findByIdAndDelete(id);
};

//get lab by name
laboratorySchema.statics.getLabByName = async function (labName) {
  const lab = await this.findOne({ name: labName });
  if (!lab) {
    throw new Error(`Lab with name "${labName}" not found`);
  }
  return await lab;
};


laboratorySchema.statics.areSeatsAvailable = async function (labName, date, timeSlots, seatNumbers) {
  try {
    const lab = await this.findOne({ name: labName });
    if (!lab) throw new Error(`Laboratory "${labName}" not found.`);

    const Reservation = mongoose.model('Reservation');
    const existingReservations = await Reservation.find({ laboratory: lab._id, date });

    for (const time of timeSlots) {
      // Get all seats already reserved at this time
      const reservedSeats = existingReservations
        .flatMap(r => r.slots
          .filter(s => s.timeSlot === time)
          .map(s => s.seatNumber)
        );

      const conflict = seatNumbers.some(seat => reservedSeats.includes(seat));
      if (conflict) {
        return false;
      }
    }
    return true;
  } catch (err) {
    throw err;
  }
};

// get available labs for a specific date and time
laboratorySchema.statics.getAvailableLabs = async function (bookingDate, bookingTime, labName = '') {
  const result = await this.aggregate([
    // 1. Filter Labs by Name
    {
      $match: labName 
        ? { name: { $regex: new RegExp(`^${labName}`, 'i') } } 
        : {}
    },

    // 2. Filter out labs that are closed at the requested time
    {
      $match: {
        openTime: { $lte: bookingTime },
        closeTime: { $gt: bookingTime }
      }
    },

    // 3. Join with Reservations (Left Outer Join)
    {
      $lookup: {
        from: 'reservations', 
        let: { labId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$laboratory', '$$labId'] },
                  { $eq: ['$date', bookingDate] }
                ]
              }
            }
          },
          { $unwind: '$slots' },
          { $match: { 'slots.startTime': bookingTime } }
        ],
        as: 'activeReservations'
      }
    },

    // 4. Calculate Free Seats
    {
      $addFields: {
        bookedSeatsCount: { $size: '$activeReservations' }
      }
    },
    {
      $addFields: {
        freeSeats: { $subtract: ['$capacity', '$bookedSeatsCount'] }
      }
    },

    // 5. Final Filtering and Sorting
    { $match: { freeSeats: { $gt: 0 } } },
    { $sort: { name: 1 } },
    
    // 6. Cleanup: Remove the temporary calculation array
    { $project: { activeReservations: 0 } }
  ]);
  return result;
};

// Get seat availability for a specific lab, date, and time
laboratorySchema.statics.getLabSeats = async function (labName, startTime, date) {
  const lab = await this.findOne({ name: labName });
  if (!lab)
    throw new CustomError(404, 'Not Found', 'Lab not found.');

  const reservations = await Reservation.find({
    laboratory: lab._id,
    date: date,
    'slots.startTime': { $eq: startTime },
  }).populate('studentId');

  return Array.from({ length: lab.capacity }, (_, i) => {
    const seatNumber = i + 1;

    const booking = reservations.find(res =>
      res.slots.some(s => s.seatNumber === seatNumber)
    );

    //No Reservation
    if (!booking) {
      return {
        seatNumber,
        status: 'Available',
        studentName: null,
        studentIdNumber: null,
        reservationId: null
      };
    }

    //Anonymous Reservation
    if (booking.anonymous) {
      return {
        seatNumber,
        status: 'Reserved',
        studentName: 'Anonymous',
        studentIdNumber: null,
        reservationId: booking._id
      };
    }

    //Public Reservation
    return {
      seatNumber,
      status: 'Reserved',
      studentName: booking.studentId?.name || 'Unknown',
      studentIdNumber: booking.studentId?.idNumber || null,
      reservationId: booking._id
    };
  });

};


module.exports = mongoose.model('Laboratory', laboratorySchema);