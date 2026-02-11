//Show front page content based on user type
document.addEventListener("DOMContentLoaded", () => {
  const userType = sessionStorage.getItem("userType");

  document.querySelectorAll("[data-role]").forEach(el => {
    const allowedRoles = el.dataset.role.split(",");

    if (!allowedRoles.includes(userType)) {
      el.remove();;
    }
  });
});

//Searchbar function
const searchBar = document.getElementById("fp_input");

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const searchTerm = searchBar.value.trim().toUpperCase();
    const boxes = document.querySelectorAll(".box");
    boxes.forEach(box => {
      const innerText = box.textContent;
      if (box.getAttribute('data-name').startsWith(searchTerm) || innerText.includes(searchTerm)) {
        box.style.display = 'block';
      } else {
        box.style.display = 'none';
      }
    });
  }
});

// labs creation
const labsContainer = document.getElementById("labs-container");

const roomData = [
  //GK
    { id: "GK202", status: "AVAILABLE", name: "GOKONGWEI - 202"},
    { id: "GK203", status: "FULL", name: "GOKONGWEI - 203" },
    { id: "GK204", status: "AVAILABLE", name: "GOKONGWEI - 204"},
    { id: "GK301", status: "AVAILABLE", name: "GOKONGWEI - 301"},
    { id: "GK302", status: "AVAILABLE", name: "GOKONGWEI - 302"},
  //LS
    { id: "LS210", status: "AVAILABLE", name: "LA SALLE HALL - 210"},
    { id: "LS211", status: "FULL", name: "LA SALLE HALL - 211"},
    { id: "LS212", status: "AVAILABLE", name: "LA SALLE HALL - 212"},
    { id: "LS310", status: "FULL", name: "LA SALLE HALL - 310"},
    { id: "LS311", status: "AVAILABLE", name: "LA SALLE HALL - 311"},
  //VL
    { id: "VL205", status: "AVAILABLE", name: "VELASCO - 205"},
    { id: "VL206", status: "AVAILABLE", name: "VELASCO - 206"},
    { id: "VL207", status: "AVAILABLE", name: "VELASCO - 207"},
    { id: "VL208", status: "FULL", name: "VELASCO - 208"},
    { id: "VL209", status: "AVAILABLE", name: "VELASCO - 209"},
];

function displayRooms(rooms) {
    labsContainer.innerHTML = "";

    rooms.forEach(room => {
        let buildingClass = "";
        if (room.id.startsWith("GK")) {
            buildingClass = "bg-gk";
        } else if (room.id.startsWith("LS")) {
            buildingClass = "bg-ls";
        } else if (room.id.startsWith("VL")) {
            buildingClass = "bg-vl";
        }

        const boxHTML = `
            <div class="box ${buildingClass}" data-name="${room.id}">
                <div class="box-info">
                    <p class="info-text">${room.name}</p>
                    <p class="info-text">${room.status}</p>
                </div>
            </div>
        `;
        labsContainer.insertAdjacentHTML('beforeend', boxHTML);
    });
}

displayRooms(roomData);
