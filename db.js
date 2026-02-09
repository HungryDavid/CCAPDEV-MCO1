//sample database that stores the accounts

const users = [
  { id_num: "12414794", password: "pass123", role: "student", fname: "David", lname: "Obar", email: "David@dlsu.edu.ph"},
  { id_num: "TECH-1999", password: "pass124", role: "labTech", fname: "John", lname: "Doe", email: "JohnDoe@dlsu.edu.ph"}
];

function registerUser(id_num, password) {
  let role = "student"
  if (id_num.startsWith("TECH-")) {
    role = "labTech"
  }
  users.push({ id_num, password, role });
  alert(`User ${id_num} registered successfully!`);
}

let currentUser = null;
let userType = "";

function loginUser(id_num, password) {
  let user = users.find(u => u.id_num === id_num && u.password === password);
  if(user) {
    currentUser = user;
    userType = user.role;  
    window.location.href = "Front_Page.html";
  } else {
    alert("Invalid username or password.");
    document.getElementById("id_num").value = "";
    document.getElementById("password").value = "";
  }
}

document.getElementById("log_in-btn").addEventListener("click", () => {
  let id_num = document.getElementById("id_num").value;
  let password = document.getElementById("password").value;
  loginUser(id_num, password);
});

document.getElementById("sign_up-btn").addEventListener("click", () =>{
  window.location.href = "Register.html";
});

document.getElementById("guest-btn").addEventListener("click", () => {
  window.location.href = "Front_Page.html";
  userType = "";
});