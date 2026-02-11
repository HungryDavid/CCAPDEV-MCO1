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

<<<<<<< HEAD
    // Create 40 seats
=======
    // 1. Generate 40 seats
>>>>>>> 0d67454855924aba7f576652537e29c3164dc088
    for (let i = 1; i <= 40; i++) {
        const seat = document.createElement("div");
        seat.classList.add("seat");
        seat.innerText = i;

        // Check if seat is occupied (Mock data)
        const isOccupied = [5, 12, 20].includes(i);

        if (isOccupied) {
            seat.classList.add("occupied");
        }

<<<<<<< HEAD
        seat.addEventListener("click", () => {
            console.log("Clicked seat:", i);
            // CASE A: Seat is occupied AND user is labTech 
=======
        // ONE click listener to rule them all
        seat.addEventListener("click", () => {
            console.log("Clicked seat:", i);
            // CASE A: Seat is occupied AND user is labTech (CANCEL LOGIC)
>>>>>>> 0d67454855924aba7f576652537e29c3164dc088
            if (seat.classList.contains("occupied")) {
                if (userType === "labTech") {
                    const owner = "Student ID: 12345678"; 
                    const action = confirm(`Occupied by: ${owner}\n\nWould you like to cancel this reservation?`);
                    if (action) {
                        seat.classList.remove("occupied");
                        alert("Reservation removed. The seat is now available.");
                    }
                } else {
                    alert("This seat is already reserved.");
                }
<<<<<<< HEAD
                return;
            }

            // CASE B: Seat is available 
=======
                return; // Stop here so it doesn't try to "select" an occupied seat
            }

            // CASE B: Seat is available (SELECTION LOGIC)
>>>>>>> 0d67454855924aba7f576652537e29c3164dc088
            const prevSelected = document.querySelector(".seat.selected");
            if (prevSelected) prevSelected.classList.remove("selected");

            seat.classList.add("selected");
            seatDisplay.innerText = i;
            confirmBtn.disabled = false;
        });

        grid.appendChild(seat);
    }

<<<<<<< HEAD
    // Handle Reservation Confirmation
=======
    // 2. Handle Reservation Confirmation
>>>>>>> 0d67454855924aba7f576652537e29c3164dc088
    confirmBtn.addEventListener("click", () => {
        const startTime = startTimeInput.value;
        const duration = durationInput.value;
        const seatNum = seatDisplay.innerText;

        if (!startTime) {
            alert("Please select a Start Time first.");
            return;
        }

        const header = (userType === "labTech") ? "Walk-in Reservation Successful!" : "Reservation Successful!";
        alert(`${header}\nLab: ${labId}\nSeat: ${seatNum}\nTime: ${startTime}`);
        window.location.href = "front-page.html";
    });
});