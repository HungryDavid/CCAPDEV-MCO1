
const users = [
  { idNum: "12414794", email: "john_doe@dlsu.edu.ph", password: "password123", role: "student", fName: "David", lName:"Obar", description: "CS major", profilePic: "./imgs/portraitPlaceholder.png", isPublicProfile: false },
  { idNum: "12345678", email: "jane_smith@dlsu.edu.ph", password: "password123", role: "student", fName: "Jane", lName:"Smith", description: "ID 121", profilePic: "./imgs/portraitPlaceholder.png", isPublicProfile: true },
  { idNum: "TECHNICIAN", email: "tech@dlsu.edu.ph", password: "password123", role: "technician", fName: "Sir", lName:"Robert", description: "Lab Tech", profilePic: "./imgs/portraitPlaceholder.png" },
  { idNum: "12123456", email: "mark_v@dlsu.edu.ph", password: "password123", role: "student", fName: "Mark", lName:"Villanueva", description: "Game Dev", profilePic: "./imgs/portraitPlaceholder.png", isPublicProfile: false },
  { idNum: "12012345", email: "lara_c@dlsu.edu.ph", password: "password123", role: "student", fName: "Lara", lName:"Croft", description: "Civil Eng", profilePic: "./imgs/portraitPlaceholder.png.jpg", isPublicProfile: false }
];

const rooms = [
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

const reservations = [
  { reservationId: "1", userId: "2021001", labId: "GK301", seatNumber: 5, date: "2026-02-13", timeSlot: "09:00 - 09:30", requestTimestamp: new Date().toISOString(), isAnonymous: false, status: "confirmed" },
  { reservationId: "2", userId: "2021002", labId: "GK301", seatNumber: 12, date: "2026-02-13", timeSlot: "09:00 - 09:30", requestTimestamp: new Date().toISOString(), isAnonymous: true, status: "confirmed" },
  { reservationId: "3", userId: "2021004", labId: "V201", seatNumber: 1, date: "2026-02-14", timeSlot: "14:00 - 14:30", requestTimestamp: new Date().toISOString(), isAnonymous: false, status: "confirmed" },
  { reservationId: "4", userId: "2021001", labId: "GK301", seatNumber: 5, date: "2026-02-13", timeSlot: "09:30 - 10:00", requestTimestamp: new Date().toISOString(), isAnonymous: false, status: "confirmed" },
  { reservationId: "5", userId: "2021005", labId: "GK302", seatNumber: 10, date: "2026-02-15", timeSlot: "11:00 - 11:30", requestTimestamp: new Date().toISOString(), isAnonymous: false, status: "confirmed" }
];

const labSlots = [
    { 
        labId: "GK202", 
        reservations: [
            { timeSlot: "09:00 - 09:30", seat: 17, userId: "12414794" }, 
            { timeSlot: "11:00 - 12:00", seat: 1, userId: "12345678" },
            { timeSlot: "14:00 - 15:30", seat: 5, userId: "2021001" },
            { timeSlot: "15:00 - 16:00", seat: 7, userId: "2021011" }
        ] 
    },
    { 
        labId: "GK302", 
        reservations: [
            { timeSlot: "11:00 - 11:30", seat: 10, userId: "2021005" }
        ] 
    },
    { 
        labId: "GK301", 
        reservations: [
            { timeSlot: "07:30 - 09:30", seat: 1, userId: "12123456" }, 
            { timeSlot: "09:00 - 09:30", seat: 5, userId: "2021001" }, 
            { timeSlot: "09:00 - 09:30", seat: 12, userId: "2021002" },
            { timeSlot: "09:30 - 10:00", seat: 5, userId: "2021001" }
        ] 
    },
    { 
        labId: "V201", 
        reservations: [
            { timeSlot: "07:30 - 09:30", seat: 1, userId: "2021004" }
        ] 
    }
];

function initDB() {
    if (!localStorage.getItem('users_db')) {
        localStorage.setItem('users_db', JSON.stringify(users));
    }
    if (!localStorage.getItem('rooms_db')) {
        localStorage.setItem('rooms_db', JSON.stringify(rooms));
    }
    if (!localStorage.getItem('reservations_db')) {
        localStorage.setItem('reservations_db', JSON.stringify(reservations));
    }
    if (!localStorage.getItem('lab_slots_db')) {
        localStorage.setItem('lab_slots_db', JSON.stringify(labSlots));
    }
    console.log("Database initialized in LocalStorage!");
}

initDB();

const timeToMins = (timeStr) => {
    const [hrs, mins] = timeStr.trim().split(':').map(Number);
    return (hrs * 60) + mins;
};

function isSeatTaken(labId, seatNum, requestedStartTime, durationMins) {
    const allLabSlots = JSON.parse(localStorage.getItem('lab_slots_db')) || [];
    const lab = allLabSlots.find(l => l.labId === labId);
    if (!lab) return null;

    const reqStart = timeToMins(requestedStartTime);
    const reqEnd = reqStart + parseInt(durationMins); 

    return lab.reservations.find(res => {
        if (res.seat !== parseInt(seatNum)) return false;

        const times = res.timeSlot.split('-');
        const exStart = timeToMins(times[0]);
        const exEnd = timeToMins(times[1]);

        return (reqStart < exEnd && reqEnd > exStart);
    });
}

function findUserById(idNum) {
    const users = JSON.parse(localStorage.getItem('users_db')) || [];

    const user = users.find(u => u.idNum === idNum);

    if (user) {
        return user;
    } else {
        return null;
    }
}


const getAllUsers = () => {
    return JSON.parse(localStorage.getItem('my_user_db')) || [];
};


const getRoom = (roomId) => rooms.find(room => room.id === roomId);