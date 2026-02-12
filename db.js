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