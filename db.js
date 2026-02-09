//sample database that stores the accounts

const users = [
  { username: "12414794", password: "pass123", role: "student" },
  { username: "TECH-1903", password: "pass124", role: "labTech" }
];

function registerUser(username, password) {
  let role = "student"
  if (username.startsWith("TECH-")) {
    role = "labTech"
  }
  users.push({ username, password, role });
  alert(`User ${username} registered successfully!`);
}

let currentUser = null;
let userType = "";

function loginUser(username, password) {
  const user = users.find(u => u.username === username && u.password === password);
  if(user) {
    currentUser = user;
    userType = user.role;  
    window.location.href = "Front_Page.html";
  } else {
    alert("Invalid username or password.");
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
  }
}

document.getElementById("log_in-btn").addEventListener("click", () => {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  loginUser(username, password);
});

document.getElementById("sign_up-btn").addEventListener("click", () =>{
  window.location.href = "Register.html";
});

document.getElementById("guest-btn").addEventListener("click", () => {
  window.location.href = "Front_Page.html";
  userType = "";
});