//sample database that stores the accounts

let users = JSON.parse(localStorage.getItem('my_user_db')) || [
  { idNum: "12414794", password: "pass123", role: "student", fname: "David", lname: "Obar", email: "David@dlsu.edu.ph"},
  { idNum: "TECH-1999", password: "pass124", role: "labTech", fname: "John", lname: "Doe", email: "JohnDoe@dlsu.edu.ph"}
];

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