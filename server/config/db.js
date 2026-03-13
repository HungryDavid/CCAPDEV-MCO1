const mongoose = require('mongoose');
const User = require('../users/User');
const Lab = require('../labs/Lab');
const Reservation = require('../reservations/Reservation');

 const users = [
    {
        _id: "12345611",
        email: "john_doe@dlsu.edu.ph",
        password: "hashed_password_123", // In real DB, store hashed passwords
        role: "student",
        profile: {
            firstName: "John",
            lastName: "Doe",
            description: "CS Student loves coding.",
            profilePicture: "images/profiles/john.jpg"
        },
        accountStatus: "active"
    },
    {
        _id: "12345672",
        email: "jane_smith@dlsu.edu.ph",
        password: "hashed_password_456",
        role: "student",
        profile: {
            firstName: "Jane",
            lastName: "Smith",
            description: "IT Major, looking for study buddies.",
            profilePicture: "images/profiles/jane.jpg"
        },
        accountStatus: "active"
    },
    {
        _id: "12345673",
        email: "tech_admin@dlsu.edu.ph",
        password: "admin_password_789",
        role: "technician", // Can block slots and remove no-shows
        profile: {
            firstName: "Lab",
            lastName: "Technician",
            description: "Gokongwei Building Main Technician",
            profilePicture: "images/profiles/default_tech.jpg"
        },
        accountStatus: "active"
    },
    {
        _id: "12345674",
        email: "carl_johnson@dlsu.edu.ph",
        password: "hashed_password_321",
        role: "student",
        profile: {
            firstName: "Carl",
            lastName: "Johnson",
            description: "Engineering student.",
            profilePicture: "images/profiles/carl.jpg"
        },
        accountStatus: "active"
    },
    {
        _id: "12345675",
        email: "maria_clara@dlsu.edu.ph",
        password: "hashed_password_654",
        role: "student",
        profile: {
            firstName: "Maria",
            lastName: "Clara",
            description: "Multimedia Arts.",
            profilePicture: "images/profiles/maria.jpg"
        },
        accountStatus: "deleted" // Simulates a user who deleted their account
    }
];

 const labs = [
    {
        _id: "GOKS101",
        name: "Gokongwei 101A",
        description: "General Purpose Lab - Windows Machines",
        location: "1st Floor, Gokongwei Hall",
        capacity: 40,
        openTime: "07:30",
        closeTime: "20:00",
        image: "images/labs/gk101.jpg"
    },
    {
        _id: "VEL205",
        name: "Velasco 205",
        description: "Multimedia Lab - Mac Studios",
        location: "2nd Floor, Velasco Hall",
        capacity: 30,
        openTime: "07:30",
        closeTime: "20:00",
        image: "images/labs/vl205.jpg"
    },
    {
        _id: "AND909",
        name: "Andrew 909",
        description: "Networking and Cybersecurity Lab",
        location: "9th Floor, Andrew Gonzalez Hall",
        capacity: 25,
        openTime: "07:30",
        closeTime: "20:00",
        image: "images/labs/ag909.jpg"
    },
    {
        _id: "LIB004",
        name: "Library Cyber Nook",
        description: "Quiet study area with PCs",
        location: "6th Floor, Henry Sy Hall",
        capacity: 15,
        openTime: "07:30",
        closeTime: "20:00",
        image: "images/labs/libnook.jpg"
    },
    {
        _id: "ES301",
        name: "Engineering ES301",
        description: "CAD and Simulation Lab",
        location: "3rd Floor, ES Building",
        capacity: 35,
        openTime: "07:30",
        closeTime: "20:00",
        image: "images/labs/es301.jpg"
    }
];

 const reservations = [
    {
        _id: new mongoose.Types.ObjectId(),
        userId: "12345611", // John Doe
        labId: "l001",  // Gokongwei 101A
        seatNumber: 5,
        reservationDate: "2023-11-25",
        timeSlotStart: "09:00",
        timeSlotEnd: "09:30",
        reservedAt: "2023-11-20T08:30:00Z", // When the request was made
        isAnonymous: false,
        status: "active" // options: active, cancelled, completed
    },
    {
        _id: new mongoose.Types.ObjectId(),
        userId: "12345672", // Jane Smith
        labId: "l001",  // Gokongwei 101A
        seatNumber: 6,
        reservationDate: "2023-11-25",
        timeSlotStart: "09:00",
        timeSlotEnd: "09:30",
        reservedAt: "2023-11-21T09:15:00Z",
        isAnonymous: true, // Jane wants to be anonymous on the view slot screen
        status: "active"
    },
    {
        _id: new mongoose.Types.ObjectId(),
        userId: "12345673", // Technician (Walk-in reservation)
        labId: "l002",  // Velasco 205
        seatNumber: 12,
        reservationDate: "2023-11-25",
        timeSlotStart: "13:00",
        timeSlotEnd: "13:30",
        reservedAt: "2023-11-25T12:55:00Z",
        isAnonymous: false,
        status: "active",
        walkInStudent: "Walk-in: ID 12112345" // Optional field for tech notes
    },
    {
        _id: new mongoose.Types.ObjectId(),
        userId: "12345611", // John Doe (Reserving 2 consecutive slots)
        labId: "l003",  // Andrew 909
        seatNumber: 1,
        reservationDate: "2023-11-26",
        timeSlotStart: "10:00",
        timeSlotEnd: "10:30",
        reservedAt: "2023-11-22T10:00:00Z",
        isAnonymous: false,
        status: "active"
    },
    {
        _id: new mongoose.Types.ObjectId(),
        userId: "12345611", // John Doe (Part 2 of his reservation)
        labId: "l003",
        seatNumber: 1,
        reservationDate: "2023-11-26",
        timeSlotStart: "10:30",
        timeSlotEnd: "11:00",
        reservedAt: "2023-11-22T10:00:00Z",
        isAnonymous: false,
        status: "active"
    },
    {
        _id: new mongoose.Types.ObjectId(),
        userId: "12345674", // Carl
        labId: "l001",
        seatNumber: 20,
        reservationDate: "2023-11-25",
        timeSlotStart: "08:00",
        timeSlotEnd: "08:30",
        reservedAt: "2023-11-24T15:00:00Z",
        isAnonymous: false,
        status: "cancelled" // Technician removed this or user cancelled
    }
];

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

         // ───── USERS ─────
            for (let u of users) {
              // Skip deleted accounts
              if (u.accountStatus === 'deleted') continue;
        
              // Check if user already exists
              const existing = await User.findOne({ $or: [{ email: u.email }, { _id: u._id }] });
              if (existing) continue;
        
              const newUser = new User({
                  _id: u._id,
                  name: `${u.profile.firstName} ${u.profile.lastName}`,
                  email: u.email,
                  password: u.password,
                  role: u.role,
                  profilePic: u.profile.profilePicture,
                  bio: u.profile.description
              });
        
              newUser.isAlreadyHashed = true; 
              
              await newUser.save();
            }

        // LABS
                for (let l of labs) {
                  const existingLab = await Lab.findById(l._id);
                  if (existingLab) continue;
            
                  await Lab.create(l);
            }
         // ───── RESERVATIONS ─────
            for (let r of reservations) {
              const existingRes = await Reservation.findById(r._id);
              if (existingRes) continue;
        
              await Reservation.create({
                _id: r._id,
                userId: r.userId,        
                labId: r.labId,         
                seatNumbers: [r.seatNumber],             
                reservationDate: r.reservationDate,
                timeSlots: [r.timeSlotStart, r.timeSlotEnd], 
                anonymous: r.isAnonymous,               
                status: r.status,
                walkInStudent: r.walkInStudent || null
              });
            }

    } catch (err) {
        console.error(err);
        process.exit(1); // Stop app on failure
    }
};
module.exports = {connectDB};
