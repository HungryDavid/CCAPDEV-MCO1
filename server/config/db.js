const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../users/User");
const Laboratory = require("../labs/Lab");
const Reservation = require("../reservations/Reservation");

const users = [
    {
        name: "John Doe",
        email: "john_doe@dlsu.edu.ph",
        idNumber: "12345611",
        role: "student",
        password: "password123"
    },
    {
        name: "Jane Smith",
        email: "jane_smith@dlsu.edu.ph",
        idNumber: "12345672",
        role: "student",
        password: "password123"
    },
    {
        name: "Lab Technician",
        email: "tech_admin@dlsu.edu.ph",
        idNumber: "12345673",
        role: "technician",
        password: "password123"
    },
    {
        name: "Carl Johnson",
        email: "carl_johnson@dlsu.edu.ph",
        idNumber: "12345674",
        role: "student",
        password: "password123"
    }
];

const labs = [
    { name: "GK101", capacity: 25, openTime: "07:30", closeTime: "23:59" },
    { name: "VL205", capacity: 30, openTime: "07:30", closeTime: "23:59" },
    { name: "AG1901", capacity: 40, openTime: "07:30", closeTime: "23:59" },
    { name: "GK102", capacity: 25, openTime: "07:30", closeTime: "23:59" },
    { name: "VL206", capacity: 25, openTime: "07:30", closeTime: "23:59" }
];

const seedDatabase = async () => {

    const existingUsers = await User.countDocuments();

    // Prevent reseeding every restart
    if (existingUsers > 0) {
        console.log("Database already seeded");
        return;
    }

    console.log("Seeding database...");

    // Hash passwords
    const hashedUsers = [];
    for (let user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 12);
        hashedUsers.push({ ...user, password: hashedPassword });
    }

    const createdUsers = await User.insertMany(hashedUsers);
    const createdLabs = await Laboratory.insertMany(labs);

    const john = createdUsers.find(u => u.name === "John Doe");
    const jane = createdUsers.find(u => u.name === "Jane Smith");
    const tech = createdUsers.find(u => u.role === "technician");

    const gk101 = createdLabs.find(l => l.name === "GK101");
    const vl205 = createdLabs.find(l => l.name === "VL205");

    const reservations = [
        {
            studentId: john._id,
            laboratory: gk101._id,
            date: "2026-03-20",
            anonymous: false,
            slots: [{ seatNumber: 5, timeSlot: "09:00" }]
        },
        {
            studentId: jane._id,
            laboratory: gk101._id,
            date: "2026-03-20",
            anonymous: true,
            slots: [{ seatNumber: 6, timeSlot: "09:00" }]
        },
        {
            studentId: tech._id,
            laboratory: vl205._id,
            date: "2026-03-20",
            anonymous: false,
            slots: [{ seatNumber: 12, timeSlot: "13:00" }]
        }
    ];

    await Reservation.insertMany(reservations);

    console.log("Database seeded successfully");

};

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);

        await seedDatabase(); // seed after connection

        console.log("Available Accounts:");
        console.log("- john_doe@dlsu.edu.ph");
        console.log("- jane_smith@dlsu.edu.ph");
        console.log("- tech_admin@dlsu.edu.ph");
        console.log("- carl_johnson@dlsu.edu.ph");
        console.log("Default Password: password123");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

module.exports = { connectDB };