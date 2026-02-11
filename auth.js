let currentUser = null;
let userType = "";

function loginUser(idNum, password) {
  let user = users.find(u => u.idNum === idNum && u.password === password);
  if(user) {
    currentUser = user;
    userType = user.role;  
    //window.location.replace("front-page.html");
    window.location.href = "front-page.html";
    sessionStorage.setItem("userType", user.role); 
  } else {
    alert("Invalid username or password.");
    document.getElementById("idNum").value = "";
    document.getElementById("password").value = "";
  }
}

function login(){
  let idNum = document.getElementById("idNum").value;
  let password = document.getElementById("password").value;
  loginUser(idNum, password);
}

document.getElementById("login-btn").addEventListener("click", () => {
  login();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    login();
  }
});

document.getElementById("guest-btn").addEventListener("click", () => {
  userType = "guest";
  sessionStorage.setItem("userType", userType);
  //window.location.replace("front-page.html");
  window.location.href = "front-page.html";
});