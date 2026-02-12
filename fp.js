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

function displayRooms() {
    labsContainer.innerHTML = "";
    const rooms_db = localStorage.getItem('room_db')
    const rooms = JSON.parse(rooms_db);

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

displayRooms();
