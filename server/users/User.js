const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    // User's full name
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true, // Remove leading/trailing spaces
    },
    // User's email address
    email: {
      type: String,
      required: [true, 'Please provide your DLSU email'],
      unique: true, // Ensure email is unique
      lowercase: true, // Convert email to lowercase
      validate: {
        validator: (val) =>
          validator.isEmail(val) && val.endsWith('@dlsu.edu.ph'), // Validate email format & domain
        message: 'Email must be a valid @dlsu.edu.ph address',
      },
    },
    // User's ID number (should be 8 digits)
    idNumber: {
      type: String,
      required: [true, 'ID Number is required'],
      unique: true, // Ensure ID number is unique
      trim: true, // Remove leading/trailing spaces
      match: [/^\d{8}$/, 'ID Number must be exactly 8 digits'], // Validate the format
    },
    // User's role (either student or technician)
    role: {
      type: String,
      enum: ['student', 'technician'], // Only these two roles are allowed
      default: 'student', // Default role is 'student'
    },
    // User's password (hashed for security)
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8, // Minimum length of 8 characters
      select: false, // Don't return the password by default
    },
    // Profile picture (default placeholder if not provided)
    profilePic: {
      type: String,
      default: '/imgs/portraitPlaceholder.png', // Default profile picture path
    },
    // Short bio of the user
    bio: {
      type: String,
      maxlength: 300, // Max length of 300 characters
      default: '',
    },
    // Privacy setting (whether the user wants to hide profile details)
    isPrivate: {
      type: Boolean,
      default: false, // Default is public
    },
    // Timestamp for when the password was last changed
    passwordChangedAt: Date,
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    toJSON: { virtuals: true }, // Include virtuals when converting to JSON
    toObject: { virtuals: true }, // Include virtuals when converting to object
  }
);

// ─── Virtuals (References to other models) ──────────────────────────────────
userSchema.virtual('reservations', {
  ref: 'Reservation', // The model being referenced
  foreignField: 'student', // Field in Reservation model that links to User
  localField: '_id', // Local field to match
});

// --- MIDDLEWARE (HOOKS) ---
// Pre-save hook to hash the password before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Skip if password is not modified
  try {
    const salt = await bcrypt.genSalt(10); // Generate salt for hashing
    this.password = await bcrypt.hash(this.password, salt); // Hash password
    next();
  } catch (err) {
    next(err); // Pass any errors to the next middleware
  }
});

// --- STATIC METHODS (Business Logic) ---
// Register a new user
userSchema.statics.registerUser = async function (userData) {
  const { email, idNumber, password } = userData;

  if (!email || !idNumber || !password) {
    throw new Error('Please fill in all fields.');
  }

  // Check if email or ID number already exists
  const userExists = await this.findOne({
    $or: [{ email }, { idNumber }]
  });

  if (userExists) {
    const field = userExists.email === email ? 'Email' : 'ID Number';
    throw new Error(`${field} is already registered.`);
  }

  // Set role based on the email (if technician in email, set role to 'technician')
  const role = email.toLowerCase().includes('technician') ? 'technician' : 'student';

  // Extract and format the user's name from the email
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

// Login a user with email and password
userSchema.statics.loginUser = async function (email, password) {
  if (!email || !password) {
    throw new Error('Please provide both email and password');
  }

  const user = await this.findOne({ email }).select('+password'); // Include password field
  if (user) {
    const auth = await bcrypt.compare(password, user.password); // Compare entered password with stored hash
    if (auth) {
      return user; // Return user if authentication is successful
    }
  }
  throw new Error('Invalid Credentials');
};

// Search users by email (case-insensitive)
userSchema.statics.searchUsers = async function (query) {
  return await this.find({
    email: { $regex: query, $options: 'i' } // Search for email matching query
  }).select('-password'); // Exclude password from the results
};

// --- INSTANCE METHODS ---
// Update user's profile (bio and profile picture)
userSchema.methods.updateProfile = async function (data, filePath) {
  if (data.bio) this.bio = data.bio; // Update bio if provided
  if (filePath) {
    this.profilePic = filePath; // Update profile picture if provided
  }
  return await this.save(); // Save the updated user data
};

// Delete a user by ID
userSchema.statics.deleteUser = async function (userId) {
  if (!userId) {
    throw new Error('User ID is required.');
  }

  const user = await this.findById(userId);
  if (!user) {
    throw new Error('User not found.');
  }

  // Optionally delete related reservations (commented out in this example)
  // await mongoose.model('Reservation').deleteMany({ student: userId });

  await user.deleteOne(); // Delete the user document
  return true;
};

// Find a public profile by email or ID number
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

  // If private, only return basic details
  if (privacyCheck.isPrivate) {
    return await this.findOne(baseQuery)
      .select('name profilePic isPrivate');
  }

  // If public, return full profile excluding password
  return await this.findOne(baseQuery)
    .select('-password');
};

// Find a user by their MongoDB ID
userSchema.statics.findUserById = function (userId) {
  if (!userId) {
    throw new Error('User ID is required.');
  }

  return this.findById(userId).select('-password'); // Return user excluding password
};

const User = mongoose.model('User', userSchema);
module.exports = User; // Export the User model