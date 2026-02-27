const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your DLSU email'],
      unique: true,
      lowercase: true,
      validate: {
        validator: (val) =>
          validator.isEmail(val) && val.endsWith('@dlsu.edu.ph'),
        message: 'Email must be a valid @dlsu.edu.ph address',
      },
    },
    idNumber: {
      type: String,
      required: [true, 'ID Number is required'],
      unique: true,
      trim: true,
      match: [/^\d{8}$/, 'ID Number must be exactly 8 digits'],
    },
    role: {
      type: String,
      enum: ['student', 'technician'],
      default: 'student',
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false,
    },
    profilePic: {
      type: String,
      default: '/imgs/portraitPlaceholder.png',
    },
    bio: {
      type: String,
      maxlength: 300,
      default: '',
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Virtuals ────────────────────────────────────────────────────────────────

userSchema.virtual('reservations', {
  ref: 'Reservation',
  foreignField: 'student',
  localField: '_id',
});

// --- MIDDLEWARE (HOOKS) ---
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) 
    return;
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw err;
  }
});

// --- STATIC METHODS (Business Logic) ---
// 1. Register Logic
userSchema.statics.registerUser = async function (userData) {
  const { email, idNumber, password } = userData;

  if (!email || !idNumber || !password) {
    throw new Error('Please fill in all fields.');
  }

  const userExists = await this.findOne({
    $or: [{ email }, { idNumber }]
  });

  if (userExists) {
    const field = userExists.email === email ? 'Email' : 'ID Number';
    throw new Error(`${field} is already registered.`);
  }

  const role = email.toLowerCase().includes('technician') ? 'technician' : 'student';

  const name = email
    .split('@')[0]
    .split(/[._]/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return await this.create({
    ...userData,
    name,
    role
  });
};

// 2. Login Logic
userSchema.statics.loginUser = async function (email, password) {
  if (!email || !password) {
    throw new Error('Please provide both email and password');
  }

  const user = await this.findOne({ email }).select('+password');
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
  }
  throw new Error('Invalid Credentials');
};

// 3. Search Users
userSchema.statics.searchUsers = async function (query) {
  // Basic search by email part
  return await this.find({
    email: { $regex: query, $options: 'i' }
  }).select('-password'); // Exclude password
};

// --- INSTANCE METHODS ---
// 1. Update Profile
userSchema.methods.updateProfile = async function (data, filePath) {
  // Whitelist allowed fields to prevent role injection etc.
  if (data.bio) this.bio = data.bio;
  if (filePath) {
        this.profilePic = filePath;
    }
  return await this.save();
};

userSchema.statics.deleteUser = async function (userId) {
  if (!userId) {
    throw new Error('User ID is required.');
  }

  const user = await this.findById(userId);

  if (!user) {
    throw new Error('User not found.');
  }

 // await mongoose.model('Reservation').deleteMany({ student: userId });

  await user.deleteOne();

  return true;
};

// 6. Find User by ID Number or Email (With Privacy Check)
userSchema.statics.findPublicProfile = async function (identifier) {
  if (!identifier) {
    throw new Error('ID number or email is required.');
  }

  const baseQuery = {
    $or: [
      { email: identifier.toLowerCase() },
      { idNumber: identifier }
    ]
  };

  // First get only privacy flag
  const privacyCheck = await this.findOne(baseQuery).select('isPrivate');

  if (!privacyCheck) {
    throw new Error('User not found.');
  }

  // 🔐 If Private → Only return safe fields
  if (privacyCheck.isPrivate) {
    return await this.findOne(baseQuery)
      .select('name profilePic isPrivate');
  }

  // 🔓 If Public → Return everything except password
  return await this.findOne(baseQuery)
    .select('-password');
};

// 7. Find User by MongoDB ID
userSchema.statics.findUserById = function (userId) {
  if (!userId) {
    throw new Error('User ID is required.');
  }

  return this.findById(userId).select('-password'); 
  // ⚠️ Notice: no await here
};

const User = mongoose.model('User', userSchema);
module.exports = User;
