const User = require('../models/User');

// Helper to filter fields
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// 1. Search Users (Respects isPrivate)
exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query; 
    const dbQuery = {
      name: { $regex: query || '', $options: 'i' } //"ben" finds "Ben", "BEN", or "Benjamin" is searchsable
    };

    // If NOT technician, hide private users
    if (req.user.role !== 'technician') {
      dbQuery.isPrivate = { $ne: true };
    }

    // .select(...) limits the data returned (don't send passwords or sensitive info)
    const users = await User.find(dbQuery).select('name email profilePic role isPrivate');


    /// Send the results back to the frontend
    res.status(200).json({ status: 'success', results: users.length, data: { users } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. View a Profile (Respects isPrivate)
exports.getUser = async (req, res) => {
  try {
    const userToView = await User.findById(req.params.id).populate({
      path: 'reservations',
      select: 'laboratory startTime endTime seatNumber' // Only show basic info
    });

    if (!userToView) return res.status(404).json({ message: 'User not found' });

    // Privacy Logic
    const isOwner = req.user.id === userToView.id;
    const isLabTech = req.user.role === 'lab_tech';
    const isPublic = !userToView.isPrivate;

    if (!isPublic && !isOwner && !isLabTech) {
      return res.status(403).json({ message: 'This profile is private.' });
    }

    res.status(200).json({ status: 'success', data: { user: userToView } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Update Current User
exports.updateMe = async (req, res) => {
  try {
    // 1. Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return res.status(400).json({ message: 'This route is not for password updates.' });
    }

    // 2. Filter out unwanted fields (don't allow role or email changes easily)
    const filteredBody = filterObj(req.body, 'name', 'description', 'profilePic', 'isPrivate');

    // 3. Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ status: 'success', data: { user: updatedUser } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 4. Delete Account (Cascade Delete)
exports.deleteMe = async (req, res) => {
  try {
    // Triggers the 'deleteOne' middleware in User model -> Deletes Reservations
    const user = await User.findById(req.user.id);
    await user.deleteOne(); 

    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};