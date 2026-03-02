document.addEventListener("DOMContentLoaded", function () {

  /* ===============================
     TIME SELECT AUTO-SUBMIT
  =============================== */
  const timeSelect = document.getElementById("timeSelect");
  const timeForm = document.getElementById("timeSelectForm");

  /* ===============================
     SEAT BUTTONS AND CART UI
  =============================== */
  const seatButtons = document.querySelectorAll(".seat-btn");
  const openCartBtn = document.getElementById("openCartBtn");
  const totalSelected = document.getElementById("totalSelected");

  // Table elements for displaying selected seats
  const selectedSeatsTableContainer = document.getElementById("selectedSeatsTableContainer");
  const selectedSeatsTableBody = document.getElementById("selectedSeatsTableBody");

  // Selected seats for the current timeslot
  let selectedSeatsByTime = {};

  // Load cart from localStorage
  let cartSeats = JSON.parse(localStorage.getItem("cartSeats")) || {};

  // Selected time slot (from server)
  const selectedTime = "{{selectedTime}}";

  // Restore highlights for cart seats in the current timeslot
  if (cartSeats[selectedTime]) {
    cartSeats[selectedTime].forEach(seat => {
      const btn = document.querySelector(
        `.seat-btn[data-seat='${seat}'][data-time='${selectedTime}']`
      );
      if (btn) {
        btn.classList.remove("btn-outline-primary");
        btn.classList.add("btn-primary");
      }
    });
  }

  /* ===============================
     TIME CHANGE SUBMIT
  =============================== */
  if (timeSelect && timeForm) {
    timeSelect.addEventListener("change", function () {
      // Save cart before reload
      localStorage.setItem("cartSeats", JSON.stringify(cartSeats));
      timeForm.submit();
    });
  }

  /* ===============================
     SEAT SELECTION LOGIC
  =============================== */
  seatButtons.forEach(button => {
    button.addEventListener("click", function () {
      if (this.disabled) return;

      const seat = this.dataset.seat;
      const time = this.dataset.time;

      if (!selectedSeatsByTime[time]) selectedSeatsByTime[time] = [];

      // Deselect previous seat for this timeslot
      if (selectedSeatsByTime[time].length > 0) {
        const prevSeat = selectedSeatsByTime[time][0];
        if (prevSeat !== seat) {
          const prevButton = document.querySelector(
            `.seat-btn[data-seat='${prevSeat}'][data-time='${time}']`
          );
          if (prevButton) {
            prevButton.classList.remove("btn-primary");
            prevButton.classList.add("btn-outline-primary");
          }
          selectedSeatsByTime[time] = [];
        }
      }

      // Toggle current seat
      if (selectedSeatsByTime[time].includes(seat)) {
        selectedSeatsByTime[time] = [];
        this.classList.remove("btn-primary");
        this.classList.add("btn-outline-primary");
      } else {
        selectedSeatsByTime[time] = [seat];
        this.classList.remove("btn-outline-primary");
        this.classList.add("btn-primary");
      }

      updateCartUI();
    });
  });

  /* ===============================
     ADD TO CART LOGIC
     - Keep highlight for seats and show the selected seats in a table
  =============================== */
  openCartBtn.addEventListener("click", function () {
    // Add current selection to cart
    for (const [time, seats] of Object.entries(selectedSeatsByTime)) {
      cartSeats[time] = [...seats]; // store in cart
    }

    // Save cart to localStorage
    localStorage.setItem("cartSeats", JSON.stringify(cartSeats));

    // Display the selected seats in a table
    renderSelectedSeatsTable();
  });

  /* ===============================
     RENDER SELECTED SEATS TABLE IMMEDIATELY
  =============================== */
  function renderSelectedSeatsTable() {
    selectedSeatsTableBody.innerHTML = ""; // Clear the table

    // Check if there are any selected seats
    if (Object.keys(cartSeats).length > 0) {
      selectedSeatsTableContainer.style.display = "block"; // Show the table container

      // Loop through each time slot and its corresponding seats
      for (const [time, seats] of Object.entries(cartSeats)) {
        seats.forEach(seat => {
          const row = document.createElement("tr");
          const timeCell = document.createElement("td");
          const seatCell = document.createElement("td");
          const statusCell = document.createElement("td");
          const actionCell = document.createElement("td");

          timeCell.textContent = time;
          seatCell.textContent = seat;
          statusCell.textContent = "Pending"; // Initial status is "Pending"
          
          // Create the Delete button
          const deleteButton = document.createElement("button");
          deleteButton.classList.add("btn", "btn-danger", "btn-sm");
          deleteButton.textContent = "Delete";
          deleteButton.addEventListener("click", function () {
            deleteSeatFromSelection(time, seat); // Delete seat from selection
          });

          // Append the delete button to the action cell
          actionCell.appendChild(deleteButton);

          // Append all cells to the row
          row.appendChild(timeCell);
          row.appendChild(seatCell);
          row.appendChild(statusCell); // Add status column
          row.appendChild(actionCell); // Add delete column

          // Append the row to the table body
          selectedSeatsTableBody.appendChild(row);
        });
      }
    } else {
      selectedSeatsTableContainer.style.display = "none"; // Hide the table if no seats selected
    }
  }

  /* ===============================
     DELETE SEAT FROM SELECTION
  =============================== */
  function deleteSeatFromSelection(time, seat) {
    // Remove the seat from the selectedSeatsByTime
    if (selectedSeatsByTime[time]) {
      selectedSeatsByTime[time] = selectedSeatsByTime[time].filter(s => s !== seat);
      if (selectedSeatsByTime[time].length === 0) {
        delete selectedSeatsByTime[time]; // Remove the time entry if no seats remain
      }
    }

    // Remove from the cartSeats (localStorage)
    if (cartSeats[time]) {
      cartSeats[time] = cartSeats[time].filter(s => s !== seat);
      if (cartSeats[time].length === 0) {
        delete cartSeats[time]; // Remove the time entry if no seats remain
      }
    }

    // Save updated cart to localStorage
    localStorage.setItem("cartSeats", JSON.stringify(cartSeats));

    // Re-render the table after deletion
    renderSelectedSeatsTable();

    // Optionally, update the UI (total count of selected seats, etc.)
    updateCartUI();
  }

  /* ===============================
     UPDATE CART UI LOGIC
  =============================== */
  function updateCartUI() {
    // Update the total count of selected seats in the cart
    const totalSelectedSeats = Object.values(cartSeats).reduce((acc, seats) => acc + seats.length, 0);
    totalSelected.textContent = `(${totalSelectedSeats})`;
  }

  /* ===============================
     CONFIRM RESERVATION LOGIC
  =============================== */
  function confirmReservation() {
    // Iterate over all selected seats and update their status
    Object.entries(cartSeats).forEach(([time, seats]) => {
      seats.forEach(seat => {
        // Find the status cell in the selected seats table and update the status
        const row = Array.from(selectedSeatsTableBody.rows).find(r => r.cells[0].textContent === time && r.cells[1].textContent === seat);
        if (row) {
          row.cells[2].textContent = "Confirmed"; // Change status to "Confirmed"
        }

        // Mark the seat as reserved (e.g., change the seat button style and disable it)
        const seatButton = document.querySelector(`.seat-btn[data-seat='${seat}'][data-time='${time}']`);
        if (seatButton) {
          seatButton.disabled = true;
          seatButton.classList.remove("btn-primary");
          seatButton.classList.add("btn-outline-danger"); // Change to reserved style
        }
      });
    });

    // Optionally, make an AJAX request to update the reservation status on the server

    // After confirmation, clear the selected seats
    selectedSeatsByTime = {};
    localStorage.removeItem("cartSeats");
    updateCartUI();
    alert("Reservations confirmed!");
  }

  // Attach confirm reservation to button
  const confirmButton = document.getElementById("confirmReservationBtn");
  if (confirmButton) {
    confirmButton.addEventListener("click", confirmReservation);
  }

  // Render the table immediately on page load if there are items in the cart
  renderSelectedSeatsTable();

});