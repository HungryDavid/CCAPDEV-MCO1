const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    default: null // null if anonymous
  },
  anonymous: {
    type: Boolean,
    default: false
  },
  laboratory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Laboratory',
    required: true
  },
  date: {
    type: String, // 'YYYY-MM-DD'
    required: true
  },
  timeSlots: {
    type: [String], // e.g. ["09:00","09:30","10:00"]
    required: true,
    validate: [arr => arr.length > 0, 'Must select at least one slot']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

/**
 * Check if requested slots are available
 * @param {ObjectId} labId 
 * @param {String} date 
 * @param {Array} requestedSlots 
 * @returns {Boolean}
 */
reservationSchema.statics.areSlotsAvailable = async function(labId, date, requestedSlots, excludeReservationId = null) {
  const filter = { laboratory: labId, date };
  if (excludeReservationId) filter._id = { $ne: excludeReservationId };

  const existingReservations = await this.find(filter);
  const reservedSlots = existingReservations.flatMap(r => r.timeSlots);
  return !requestedSlots.some(slot => reservedSlots.includes(slot));
};

/**
 * Create a new reservation safely
 */
reservationSchema.statics.createReservation = async function({ studentId, anonymous, laboratory, date, timeSlots }) {
  const available = await this.areSlotsAvailable(laboratory, date, timeSlots);
  if (!available) throw new Error('One or more selected slots are already reserved');

  return this.create({ studentId, anonymous, laboratory, date, timeSlots });
};

/**
 * Update a reservation
 */
reservationSchema.statics.updateReservation = async function(reservationId, updateData) {
  // Check if timeSlots/laboratory/date is being updated
  if (updateData.timeSlots || updateData.date || updateData.laboratory) {
    const reservation = await this.findById(reservationId);
    if (!reservation) throw new Error('Reservation not found');

    const labId = updateData.laboratory || reservation.laboratory;
    const date = updateData.date || reservation.date;
    const slots = updateData.timeSlots || reservation.timeSlots;

    const available = await this.areSlotsAvailable(labId, date, slots, reservationId);
    if (!available) throw new Error('One or more selected slots are already reserved');
  }

  return this.findByIdAndUpdate(reservationId, updateData, {
    new: true,
    runValidators: true
  });
};

/**
 * Delete a reservation
 */
reservationSchema.statics.deleteReservation = async function(reservationId) {
  const res = await this.findByIdAndDelete(reservationId);
  if (!res) throw new Error('Reservation not found');
  return res;
};

/**
 * Get reservations (optionally filter by lab, student, date)
 */
reservationSchema.statics.getReservations = function(filter = {}) {
  return this.find(filter)
    .populate('laboratory', 'name openTime closeTime')
    .populate('studentId', 'name email')
    .lean();
};

/**
 * Get a single reservation by ID
 */
reservationSchema.statics.getReservationById = async function(id) {
  const res = await this.findById(id)
    .populate('laboratory', 'name openTime closeTime')
    .populate('studentId', 'name email')
    .lean();
  if (!res) throw new Error('Reservation not found');
  return res;
};

module.exports = mongoose.model('Reservation', reservationSchema);