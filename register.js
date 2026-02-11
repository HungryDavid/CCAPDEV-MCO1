
const registerButton = document.getElementById("register-button");
registerButton.addEventListener("click", register);

function registerUser(idNum, password) {
  let role = "student"
  if (idNum.startsWith("TECH-")) {
    role = "labTech"
  }
  users.push({idNum, password, role });
  alert(`User ${idNum} registered successfully!`);
}


function register(event) {
      event.preventDefault(); // Prevent the default form submission

      let firstName = document.getElementById("first-name").value;
      let lastName = document.getElementById("last-name").value;
      let emailAddress = document.getElementById("email-address").value;
      let idNumber = document.getElementById("id-number").value;
      let password = document.getElementById("password").value;
      let confirmPassword = document.getElementById("confirm-password").value;

      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      if (users.some(u => u.id_num === idNumber)) {
        alert("ID number already registered!");
        return;
      }

      if (users.some(u => u.email === emailAddress)) {
        alert("Email already registered!");
        return;
      }

      const newUser = {
            idNum: idNumber,
            password: password,
            role: 'user',
            fName: firstName,
            lName: lastName,
            email: emailAddress
        };

      saveUser(newUser);
      alert("Account Created!");
      window.location.replace("index.html");
    }