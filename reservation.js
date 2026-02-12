document.addEventListener("DOMContentLoaded", () => {
    const userType = sessionStorage.getItem("userType");
    const params = new URLSearchParams(window.location.search);
    const labId = params.get('lab');

    if (!labId) {
        alert("No laboratory selected!");
        window.location.href = "front-page.html";
        return;
    }

    document.getElementById("display-lab-name").innerText = "Laboratory: " + labId;

    const grid = document.getElementById("seat-grid");
    const seatDisplay = document.getElementById("selected-seat-num");
    const confirmBtn = document.getElementById("confirm-res-btn");
    const startTimeInput = document.getElementById("res-start-time");
    const durationInput = document.getElementById("res-duration");

    function populateTimeSlots() {
        const startHour = 7; // 7 AM
        const endHour = 18;  // 6 PM
        
        for (let hour = startHour; hour <= endHour; hour++) {
            ['00', '30'].forEach(minutes => {
                const timeValue = `${hour.toString().padStart(2, '0')}:${minutes}`;
                
                // Makes it AM/PM format
                const suffix = hour >= 12 ? "PM" : "AM";
                const displayHour = hour % 12 || 12;
                const timeText = `${displayHour}:${minutes} ${suffix}`;

                const option = document.createElement('option');
                option.value = timeValue;
                option.textContent = timeText;
                startTimeInput.appendChild(option);
            });
        }
    }
    populateTimeSlots();

    // Create 40 seats
    function updateSeatGrid() {
        grid.innerHTML = ""; // Clear existing seats
        const startTime = startTimeInput.value;
        const duration = durationInput.value;

        // Reset selection when parameters change
        seatDisplay.innerText = "None";
        confirmBtn.disabled = true;

        for (let i = 1; i <= 40; i++) {
            const seat = document.createElement("div");
            seat.classList.add("seat");
            seat.innerText = i;

            const reservation = isSeatTaken(labId, i, startTime, duration);

            if (reservation) {
                seat.classList.add("occupied");
                // For technicians to see owners
                seat.dataset.owner = reservation.userId;
            }

            seat.addEventListener("click", () => {
                if (seat.classList.contains("occupied")) {
                    if (userType === "technician") { 
                        const owner = seat.dataset.owner;
                        const action = confirm(`Occupied by: ${owner}\n\nCancel this reservation?`);
                        if (action) {
                            seat.classList.remove("occupied");
                            alert("Reservation removed.");
                        }
                    } else {
                        alert("This seat is reserved for the selected time slot.");
                    }
                    return;
                }

                // Selection Logic
                const prevSelected = document.querySelector(".seat.selected");
                if (prevSelected) prevSelected.classList.remove("selected");

                seat.classList.add("selected");
                seatDisplay.innerText = i;
                confirmBtn.disabled = false;
            });

            grid.appendChild(seat);
        }
    }
    startTimeInput.addEventListener("change", updateSeatGrid);
    durationInput.addEventListener("change", updateSeatGrid);

    updateSeatGrid();

    // Handle Reservation Confirmation
    confirmBtn.addEventListener("click", () => {
        const startTime = startTimeInput.value;
        const duration = durationInput.value;
        const seatNum = seatDisplay.innerText;
        
        const startMins = timeToMins(startTime);
        const endTotal = startMins + parseInt(duration);
        const endHrs = Math.floor(endTotal / 60).toString().padStart(2, '0');
        const endMins = (endTotal % 60).toString().padStart(2, '0');
        const timeRange = `${startTime} - ${endHrs}:${endMins}`;

        const header = (userType === "technician") ? "Walk-in Success!" : "Reservation Success!";
        alert(`${header}\nLab: ${labId}\nSeat: ${seatNum}\nTime Slot: ${timeRange}`);
        
        window.location.href = "front-page.html";
    });
});