function minutesToTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const hDisplay = String(hours).padStart(2, '0');
  const mDisplay = String(minutes).padStart(2, '0');

  return `${hDisplay}:${mDisplay}`;
}



document.addEventListener("DOMContentLoaded", function () {

  const reservationIdElement = document.getElementById("reservationId");
  const bookingDateElement = document.getElementById("bookingDate");
  const bookingTimeElement = document.getElementById("bookingTime");
  const labNameElement = document.getElementById("labName");
  const seatNumberElement = document.getElementById("seatNumber");
  const cartSessionElement = document.getElementById("cartSession");
  const isAnonymous = document.getElementById("isAnonymous");
  const seatGrid = document.getElementById("seatGrid");

  const selectedSeatsTableBody = document.getElementById("selectedSeatsTableBody");

  const isTechnicianElement = document.getElementById("isTechnician");
  const isTechnician = isTechnicianElement?.value === "true"; // This creates a boolean
  const cartSessionInput = document.getElementById("cartSessionInput");

  const confirmButton = document.getElementById("confirmReservationBtn");
  const updateButton = document.getElementById("updateButton");
  const seatButtons = document.querySelectorAll(".seat-btn");
  const editButton = document.getElementById("editReservationBtn");
  const deleteButton = document.getElementById("deleteReservationBtn");
  const cartInput = document.getElementById("cartSessionInput");


  let labCart = JSON.parse(sessionStorage.getItem("labCart")) || {};;


  if (cartInput && cartInput.value) {
    try {
      const cartData = cartInput.value;
      sessionStorage.setItem("labCart", cartData);
    } catch (e) {
    }
  } else {
    console.log("No cart data from server; using existing sessionStorage cart if any.");
  }


  // 1. Reusable fetch function
  const updateSeatAvailability = async () => {
    const labName = labNameElement?.value;
    const bookingDate = bookingDateElement?.value;
    const bookingTime = bookingTimeElement?.value;

    //console.log("Current selections - Lab:", labName, "Date:", bookingDate, "Time:", bookingTime);
    if (!labName || !bookingDate || !bookingTime) {
      alert("Please select a lab, date, and time to view seat availability.");
      return;
    }

    const url = `/labs/api/seat-availability?labName=${encodeURIComponent(labName)}&bookingDate=${encodeURIComponent(bookingDate)}&bookingTime=${encodeURIComponent(bookingTime)}`;

    try {
      const res = await fetch(url);
      if (!res.ok)
        alert("Network response was not ok");

      const data = await res.json();
      renderSeatGrid(data.labSeats, bookingTime);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  const updateCartAvailability = async () => {
    const labCart = JSON.parse(sessionStorage.getItem("labCart")) || {};
    if (!labCart)
      return;

    const payload = {
      labName: labNameElement?.value,
      date: bookingDateElement?.value,
      cartData: labCart
    };

    try {
      const response = await fetch('/labs/api/cart-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const updatedResults = await response.json();
      updateSessionStorage(updatedResults);

    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  function updateSessionStorage(fetchedData) {
    let labCart = JSON.parse(sessionStorage.getItem("labCart")) || {};

    for (const bookingTime in labCart) {
      const newStatus = fetchedData[bookingTime]?.status;

      if (newStatus) {
        labCart[bookingTime].status = newStatus;

        // OPTIONAL: Automatically remove the seat if it's no longer bookable
        if (newStatus === "Expired" || newStatus === "Occupied") {
          console.warn(`Seat ${labCart[bookingTime].seatNumber} at ${bookingTime} is no longer available.`);
          // delete labCart[bookingTime]; 
        }
      }
    }
    sessionStorage.setItem("labCart", JSON.stringify(labCart));
    renderSelectedSeats();
  }

  // 2. Flicker-free render function
  function renderSeatGrid(seats, bookingTime) {
    console.log("Rendering seat grid with data:", seats);
    const seatGrid = document.getElementById("seatGrid");
    if (!seatGrid) return;

    // If the grid is empty, do a full initial render
    if (seatGrid.children.length === 0) {
      seats.forEach(seat => {
        const isReserved = seat.status === "Reserved";
        const buttonClass = isReserved ? "btn-outline-danger" : "btn-outline-primary";
        const label = isReserved ? seat.studentName : seat.seatNumber;
        const seatHTML = `
          <div class="col-md-2 col-3 mb-2">
            <button
              type="button"
              class="btn seat-btn w-100 ${buttonClass}"
              data-seat="${seat.seatNumber}"
              data-booking-time="${bookingTime}"
              data-student-id="${seat.studentIdNumber || ""}"
            >
              ${label}
            </button>
          </div>`;
        seatGrid.insertAdjacentHTML("beforeend", seatHTML);
      });
    } else {
      // SMART UPDATE: Update existing buttons instead of clearing them
      seats.forEach(seat => {
        const btn = seatGrid.querySelector(`[data-seat="${seat.seatNumber}"]`);
        if (btn) {
          const isReserved = seat.status === "Reserved";
          const label = isReserved ? seat.studentName : seat.seatNumber;

          // Update attributes/classes only if they changed
          btn.dataset.bookingTime = bookingTime;
          btn.dataset.studentId = seat.studentIdNumber || "";

          if (isReserved) {
            btn.classList.replace("btn-outline-primary", "btn-outline-danger");
          } else {
            btn.classList.replace("btn-outline-danger", "btn-outline-primary");
          }

          if (btn.innerText !== label) {
            btn.innerText = label;
          }
        }
      });
    }
  }

  // Handle seat button clicks
  labCart = JSON.parse(sessionStorage.getItem("labCart")) || {};
  seatGrid.addEventListener("click", (e) => {
    const seatBtn = e.target.closest(".seat-btn");
    if (!seatBtn) return;

    const seatNumber = seatBtn.dataset.seat;
    const bookingTime = seatBtn.dataset.bookingTime;
    const studentIdNumber = seatBtn.dataset.studentId;

    if (studentIdNumber) {
      window.location.href = `/user/search?q=${encodeURIComponent(studentIdNumber)}`;
    } else {
      labCart[bookingTime] = {
        seatNumber: seatNumber,
        status: "Checking..."
      };
      sessionStorage.setItem("labCart", JSON.stringify(labCart));
    }

    renderSelectedSeats();
  });

  // Render selected seats from cartSession on page load
  function renderSelectedSeats() {
    if (!selectedSeatsTableBody)
      return;

    selectedSeatsTableBody.innerHTML = "";

    const now = new Date();
    const nowMinutes = (now.getHours() * 60) + now.getMinutes();
    const todayStr = new Date().toISOString().split('T')[0];

    labCart = JSON.parse(sessionStorage.getItem("labCart")) || {};

    for (const time in labCart) {
      if (labCart.hasOwnProperty(time)) {
        const row = document.createElement("tr");

        const timeCell = document.createElement("td");
        timeCell.textContent = minutesToTime(parseInt(time));

        const seatCell = document.createElement("td");
        seatCell.textContent = labCart[time].seatNumber;

        const statusCell = document.createElement("td");
        const status = labCart[time].status;
        statusCell.textContent = status;
        statusCell.style.color =
          status === "Reserved" ? "red" : status === "Available" ? "green" : "gray";

        const actionCell = document.createElement("td");

        if (reservationIdElement && reservationIdElement.value) {
          if (isTechnician) {
              const deleteButton = document.createElement("button");
              deleteButton.classList.add("btn", "btn-danger");
              deleteButton.textContent = "Delete";
              deleteButton.addEventListener("click", function () {
                deleteSeat(time);
              });
              actionCell.appendChild(deleteButton);
          } else {
            if (bookingDateElement.value > todayStr || (bookingDateElement.value === todayStr && parseInt(time) > nowMinutes)) {
              const deleteButton = document.createElement("button");
              deleteButton.classList.add("btn", "btn-danger");
              deleteButton.textContent = "Delete";
              deleteButton.addEventListener("click", function () {
                deleteSeat(time);
              });
              actionCell.appendChild(deleteButton);
            }
          }
        } else {
          const deleteButton = document.createElement("button");
          deleteButton.classList.add("btn", "btn-danger");
          deleteButton.textContent = "Delete";
          deleteButton.addEventListener("click", function () {
            deleteSeat(time);
          });
          actionCell.appendChild(deleteButton);
        }

        row.appendChild(timeCell);
        row.appendChild(seatCell);
        row.appendChild(statusCell);
        row.appendChild(actionCell);

        selectedSeatsTableBody.appendChild(row);
      }
    }
  }

  function deleteSeat(bookingTime) {
    let labCart = JSON.parse(sessionStorage.getItem("labCart")) || {};
    delete labCart[bookingTime];
    sessionStorage.setItem("labCart", JSON.stringify(labCart));
    renderSelectedSeats();
  }

  confirmButton?.addEventListener("click", async function (e) {
    e.preventDefault();

    let studentNumber = null;

    if (isTechnician) {
      studentNumber = prompt("Enter student ID:");
      if (studentNumber === null) return;
      if (studentNumber.trim() === "") {
        alert("Student ID is required for technicians.");
        return;
      }
    }

    const currentCart = JSON.parse(sessionStorage.getItem("labCart")) || {};
    if (Object.keys(currentCart).length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    if (!confirm("Are you sure you want to confirm the reservation?")) return;

    try {
      const response = await fetch(`/reservation/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isAnonymous: isAnonymous?.checked || false,
          studentNumber: studentNumber,
          reservationId: reservationIdElement?.value,
          selectedLab: labNameElement?.value,
          selectedDate: bookingDateElement?.value,
          labCart: currentCart
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Error submitting reservation");
        return;
      }

      alert("Reservation confirmed successfully!");
      sessionStorage.removeItem("labCart");
      location.reload();
    } catch (err) {
      console.error(err);
      alert("System error. Please try again later.");
    }
  });

  updateButton?.addEventListener("click", async function () {
    const labCart = JSON.parse(sessionStorage.getItem("labCart")) || {};
    if (Object.keys(labCart).length === 0) {
      alert("No seats selected to update.");
      return;
    }

    const confirmation = confirm("Are you sure you want to update your reservation?");
    if (!confirmation) return;

    try {
      const response = await fetch(`/reservation/${reservationIdElement?.value}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isAnonymous: isAnonymous?.checked || false,
          reservationId: reservationIdElement?.value,
          sessionCart: labCart
        }),
      });

      let result;

      try {
        result = await response.json();
      } catch {
        const text = await response.text();
        result = { message: text };
      }

      if (!response.ok) {
        alert(result.message || "Failed to update reservation.");
        return;
      }

      alert(result.message || "Reservation updated successfully!");
      sessionStorage.removeItem("labCart");

      if (isTechnician) {
        window.location.href = '/labs/slots-availability';
      } else {
        window.location.href = '/reservation';
      }

      renderSelectedSeats();
    } catch (err) {
      console.error(err);
      alert("Error updating reservation. Please try again.");
    }
  });

  deleteButton?.addEventListener("click", async function (e) {
    e.preventDefault();

    const seatNumber = prompt("Enter seat number to delete:")?.trim();
    if (!seatNumber) return alert("Seat number is required!");

    if (!confirm(`Are you sure you want to delete reservation for seat ${seatNumber}?`)) return;

    try {
      const response = await fetch(`/reservation/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          labName: labNameElement?.value,
          bookingDate: bookingDateElement.value,
          bookingTime: bookingTimeElement.value,
          seatNumber
        }),
      });
      if (!response.ok) {
        alert(result.message || "Failed to delete reservation.");
        return;
      }
    } catch (err) {
      console.log(err);
      //alert('Error deleting reservation')
    }

  });

  editButton?.addEventListener("click", async function () {
    let seatNumber = "";

    if (isTechnician) {
      seatNumber = prompt("Enter seat number to edit:")?.trim() || "";
    }

    if (!seatNumber) return alert("Seat number is required!");

    try {
      const params = new URLSearchParams({
        labName: labNameElement?.value,
        bookingDate: bookingDateElement.value,
        bookingTime: bookingTimeElement.value,
        seatNumber: seatNumber
      });

      const response = await fetch(`/reservation/update-technician?${params.toString()}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      const data = await response.json();
      window.location.href = data.redirectUrl;

    } catch (err) {
      console.log(err);
      alert('Error Editing reservation');
    }
  });



function updateDeleteButtonState() {
  if (!isTechnician || !deleteButton) return;

  const selectedDate = bookingDateElement?.value;
  const selectedTime = parseInt(bookingTimeElement?.value);
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const nowMinutes = (now.getHours() * 60) + now.getMinutes();

  const isFutureDate = selectedDate > todayStr;
  const isTodayButTooEarly = selectedDate === todayStr && nowMinutes < (selectedTime + 10);

  if (isFutureDate || isTodayButTooEarly) {
    deleteButton.disabled = true;
  } else {
    deleteButton.disabled = false;
    deleteButton.title = "";
  }
}

  // Clear grid on time change to force a full fresh render
  bookingTimeElement.addEventListener("change", () => {
    seatGrid.innerHTML = "";
    updateSeatAvailability();
    updateDeleteButtonState();
  });

  updateSeatAvailability();
  renderSelectedSeats();
  setInterval(updateSeatAvailability, 2000);
  setInterval(updateCartAvailability, 2000);
  updateDeleteButtonState();
  
});