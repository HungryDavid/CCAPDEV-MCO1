//sample database that stores the accounts
let users = JSON.parse(localStorage.getItem('my_user_db'));

if (!users) {
    users = [
        { idNum: "12414794", password: "pass123", role: "student", fname: "David", lname: "Obar", email: "David@dlsu.edu.ph"},
        { idNum: "TECH-1999", password: "pass124", role: "technician", fname: "John", lname: "Doe", email: "JohnDoe@dlsu.edu.ph"}
    ];
    localStorage.setItem('my_user_db', JSON.stringify(users));
}

let rooms = JSON.parse(localStorage.getItem('room_db'));

if (!rooms) {
    rooms = [
        { id: "GK202", status: "AVAILABLE", name: "GOKONGWEI - 202"},
        { id: "GK203", status: "FULL", name: "GOKONGWEI - 203" },
        { id: "GK204", status: "AVAILABLE", name: "GOKONGWEI - 204"},
        { id: "GK301", status: "AVAILABLE", name: "GOKONGWEI - 301"},
        { id: "GK302", status: "AVAILABLE", name: "GOKONGWEI - 302"},
        { id: "LS210", status: "AVAILABLE", name: "LA SALLE HALL - 210"},
        { id: "LS211", status: "FULL", name: "LA SALLE HALL - 211"},
        { id: "LS212", status: "AVAILABLE", name: "LA SALLE HALL - 212"},
        { id: "LS310", status: "FULL", name: "LA SALLE HALL - 310"},
        { id: "LS311", status: "AVAILABLE", name: "LA SALLE HALL - 311"},
        { id: "VL205", status: "AVAILABLE", name: "VELASCO - 205"},
        { id: "VL206", status: "AVAILABLE", name: "VELASCO - 206"},
        { id: "VL207", status: "AVAILABLE", name: "VELASCO - 207"},
        { id: "VL208", status: "FULL", name: "VELASCO - 208"},
        { id: "VL209", status: "AVAILABLE", name: "VELASCO - 209"}
    ];
    localStorage.setItem('room_db', JSON.stringify(rooms));
}

const usersData = [
  { id: "2021001", email: "john_doe@dlsu.edu.ph", password: "password123", role: "student", name: "John Doe", description: "CS major", profilePic: "john.jpg", isAnonymousDefault: false },
  { id: "2021002", email: "jane_smith@dlsu.edu.ph", password: "password123", role: "student", name: "Jane Smith", description: "ID 121", profilePic: "jane.png", isAnonymousDefault: true },
  { id: "TECH01", email: "tech@dlsu.edu.ph", password: "password123", role: "lab_tech", name: "Sir Robert", description: "Gox Lab Tech", profilePic: "tech.jpg" },
  { id: "2021004", email: "mark_v@dlsu.edu.ph", password: "password123", role: "student", name: "Mark Villanueva", description: "Game Dev", profilePic: "mark.jpg", isAnonymousDefault: false },
  { id: "2021005", email: "lara_c@dlsu.edu.ph", password: "password123", role: "student", name: "Lara Croft", description: "Civil Eng", profilePic: "lara.jpg", isAnonymousDefault: false }
];

const labsData = [
  { id: "GK301", name: "Gox Lab 301", totalSeats: 30 },
  { id: "GK302", name: "Gox Lab 302", totalSeats: 25 },
  { id: "V201", name: "Velasco 201", totalSeats: 40 }
];

const reservationsData = [
  { reservationId: "1", userId: "2021001", labId: "GK301", seatNumber: 5, date: "2026-02-13", timeSlot: "09:00 - 09:30", requestTimestamp: new Date().toISOString(), isAnonymous: false, status: "confirmed" },
  { reservationId: "2", userId: "2021002", labId: "GK301", seatNumber: 12, date: "2026-02-13", timeSlot: "09:00 - 09:30", requestTimestamp: new Date().toISOString(), isAnonymous: true, status: "confirmed" },
  { reservationId: "3", userId: "2021004", labId: "V201", seatNumber: 1, date: "2026-02-14", timeSlot: "14:00 - 14:30", requestTimestamp: new Date().toISOString(), isAnonymous: false, status: "confirmed" },
  { reservationId: "4", userId: "2021001", labId: "GK301", seatNumber: 5, date: "2026-02-13", timeSlot: "09:30 - 10:00", requestTimestamp: new Date().toISOString(), isAnonymous: false, status: "confirmed" },
  { reservationId: "5", userId: "2021005", labId: "GK302", seatNumber: 10, date: "2026-02-15", timeSlot: "11:00 - 11:30", requestTimestamp: new Date().toISOString(), isAnonymous: false, status: "confirmed" }
];

// 2. Function to initialize LocalStorage
function initDB() {
    // Only set if they don't exist to avoid overwriting existing data
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(usersData));
    }
    if (!localStorage.getItem('labs')) {
        localStorage.setItem('labs', JSON.stringify(labsData));
    }
    if (!localStorage.getItem('reservations')) {
        localStorage.setItem('reservations', JSON.stringify(reservationsData));
    }
    console.log("Database initialized in LocalStorage!");
}

initDB();



const saveUser = (user) => {
    console.log(users);
    users.push(user);
    localStorage.setItem('my_user_db', JSON.stringify(users));
    console.log(users);
};

const getAllUsers = () => {
    // Always return the most up-to-date list
    return JSON.parse(localStorage.getItem('my_user_db')) || [];
};


const getRoom = (roomId) => rooms.find(room => room.id === roomId);