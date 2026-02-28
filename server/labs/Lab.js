const mongoose = require('mongoose');

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
    type: String,  // Add open time for each lab
    required: [true, 'A lab must have an open time']
  },
  closeTime: {
    type: String,  // Add close time for each lab
    required: [true, 'A lab must have a close time']
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

// Static Method: Create a new lab
laboratorySchema.statics.createLab = async function(labData) {
  return await this.create(labData); // Calls Mongoose's built-in `create()` method
};

// Static Method: Get all labs with filtering support
laboratorySchema.statics.getAllLabs = function(queryObj) {
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  const filterData = { ...queryObj };
  excludedFields.forEach(el => delete filterData[el]);
  
  return this.find(filterData).lean();  // Return all labs based on the filterData
};

// Static Method: Get one lab by ID
laboratorySchema.statics.getLabById = async function(id) {
  return await this.findById(id);
};

laboratorySchema.statics.updateLab = async function(id, updateData) {
  return await this.findByIdAndUpdate(id, updateData, {
    returnDocument: 'after',
    runValidators: true
  });
};

// Static Method: Delete a lab by ID
laboratorySchema.statics.deleteLab = async function(id) {
  return await this.findByIdAndDelete(id);
};

module.exports = mongoose.model('Laboratory', laboratorySchema);



