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
    //window.location.replace("Front_Page.html");
    window.location.href = "Front_Page.html";
    sessionStorage.setItem("userType", user.role); 
  } else {
    alert("Invalid username or password.");
    document.getElementById("id_num").value = "";
    document.getElementById("password").value = "";
  }
}

function login(){
  let id_num = document.getElementById("id_num").value;
  let password = document.getElementById("password").value;
  loginUser(id_num, password);
}

document.getElementById("log_in-btn").addEventListener("click", () => {
  login();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    login();
  }
});

document.getElementById("sign_up-btn").addEventListener("click", () =>{
  window.location.href = "Register.html";
});

document.getElementById("guest-btn").addEventListener("click", () => {
  userType = "guest";
  sessionStorage.setItem("userType", userType);
  //window.location.replace("Front_Page.html");
  window.location.href = "Front_Page.html";
});