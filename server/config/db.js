const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(err);
        process.exit(1); // Stop app on failure
    }
};


 const users = [
    {
        _id: "u001",
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
        _id: "u002",
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
        _id: "u003",
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
        _id: "u004",
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
        _id: "u005",
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
        _id: "l001",
        name: "Gokongwei 101A",
        description: "General Purpose Lab - Windows Machines",
        location: "1st Floor, Gokongwei Hall",
        totalSeats: 40,
        image: "images/labs/gk101.jpg"
    },
    {
        _id: "l002",
        name: "Velasco 205",
        description: "Multimedia Lab - Mac Studios",
        location: "2nd Floor, Velasco Hall",
        totalSeats: 30,
        image: "images/labs/vl205.jpg"
    },
    {
        _id: "l003",
        name: "Andrew 909",
        description: "Networking and Cybersecurity Lab",
        location: "9th Floor, Andrew Gonzalez Hall",
        totalSeats: 25,
        image: "images/labs/ag909.jpg"
    },
    {
        _id: "l004",
        name: "Library Cyber Nook",
        description: "Quiet study area with PCs",
        location: "6th Floor, Henry Sy Hall",
        totalSeats: 15,
        image: "images/labs/libnook.jpg"
    },
    {
        _id: "l005",
        name: "Engineering ES301",
        description: "CAD and Simulation Lab",
        location: "3rd Floor, ES Building",
        totalSeats: 35,
        image: "images/labs/es301.jpg"
    }
];

 const reservations = [
    {
        _id: "r001",
        userId: "u001", // John Doe
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
        _id: "r002",
        userId: "u002", // Jane Smith
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
        _id: "r003",
        userId: "u003", // Technician (Walk-in reservation)
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
        _id: "r004",
        userId: "u001", // John Doe (Reserving 2 consecutive slots)
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
        _id: "r005",
        userId: "u001", // John Doe (Part 2 of his reservation)
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
        _id: "r006",
        userId: "u004", // Carl
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
module.exports = {connectDB, users, labs, reservations };