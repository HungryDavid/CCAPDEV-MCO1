const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Reservation must belong to a user']
  },
  laboratory: {
    type: mongoose.Schema.ObjectId,
    ref: 'Laboratory',
    required: [true, 'Reservation must belong to a laboratory']
  },
  seatNumber: {
    type: Number,
    required: [true, 'Reservation must have a seat number']
  },
  // "Intervals of 30 minutes"
  // Best practice: Store the actual Date object for start and end
  startTime: {
    type: Date,
    required: [true, 'Reservation must have a start time']
  },
  endTime: {
    type: Date,
    required: [true, 'Reservation must have an end time']
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['reservation', 'walk-in'],
    default: 'reservation'
  }
}, {
  timestamps: true 
});

// --- INDEXES FOR PERFORMANCE ---
// 1. Uniqueness: Prevents double booking the SAME seat in the SAME lab at the SAME time
// Note: This works best if you standardize time slots (e.g., strictly 09:00, 09:30). 
// If ranges vary, validation must happen in the Controller.
reservationSchema.index({ laboratory: 1, seatNumber: 1, startTime: 1 }, { unique: true });

// 2. Search Speed: Frequently searching for slots by Lab and Date
reservationSchema.index({ laboratory: 1, startTime: 1 });

// --- MIDDLEWARE ---

// PRE-FIND: Handle Anonymity
// When searching for reservations (to view slots), populating the user is tricky
// because we need to hide the name if isAnonymous is true.
reservationSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name email profilePic role'
  }).populate({
    path: 'laboratory',
    select: 'name'
  });
  next();
});

module.exports = mongoose.model('Reservation', reservationSchema);