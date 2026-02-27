const mongoose = require('mongoose');

const laboratorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A lab must have a name'],
    unique: true, 
    trim: true
  },
  totalSeats: {
    type: Number,
    required: [true, 'A lab must have a total number of seats'],
    min: [1, 'Lab must have at least one seat']
  },
  image: {
    type: String,
    default: 'lab-default.jpg'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual: Get all reservations for this lab
laboratorySchema.virtual('reservations', {
  ref: 'Reservation',
  foreignField: 'laboratory',
  localField: '_id'
});

exports.createLab = async (labData) => {
  return await Laboratory.create(labData);
};

// 2. READ ALL
exports.getAllLabs = async (queryObj) => {
  // Basic logic to remove pagination/sorting params from query
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  const filterData = { ...queryObj };
  excludedFields.forEach(el => delete filterData[el]);

  return await Laboratory.find(filterData);
};

// 3. READ ONE
exports.getLabById = async (id) => {
  return await Laboratory.findById(id);
};

// 4. UPDATE
exports.updateLab = async (id, updateData) => {
  return await Laboratory.findByIdAndUpdate(id, updateData, {
    new: true,           // Return the updated document
    runValidators: true  // Ensure schema rules (like min seats) are checked
  });
};

// 5. DELETE
exports.deleteLab = async (id) => {
  return await Laboratory.findByIdAndDelete(id);
};


module.exports = mongoose.model('Laboratory', laboratorySchema);