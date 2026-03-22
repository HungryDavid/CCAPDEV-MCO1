document.addEventListener("DOMContentLoaded", function () {
    // Delete Modal
    const deleteButtons = document.querySelectorAll('button[data-bs-target="#deleteReservationModal"]');
    const deleteReservationIdInput = document.getElementById("delete-reservation-id");

    deleteButtons.forEach(button => {
        button.addEventListener("click", function () {
            const reservationId = this.getAttribute("data-id");
            if (deleteReservationIdInput) {
                deleteReservationIdInput.value = reservationId;
                console.log("Reservation ID set:", reservationId); 
            }
        });
    });


    // Edit Modal
    const editButtons = document.querySelectorAll('a[href*="/reservation/"][title="Edit reservation"]');

    editButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); 

            const row = button.closest('tr') || button.closest('.card-body');

            if (!row) return;

            let timeSlot, seatNo;

            if (row.tagName === 'TR') {
                timeSlot = row.children[3].textContent.trim(); 
                seatNo = row.children[5].textContent.trim();  
            } else {
                timeSlot = row.querySelector('small:contains("Booking Time")')?.textContent.split(':')[1].trim();
                seatNo = row.querySelector('small:contains("Seat#")')?.textContent.split('#')[1].trim();
            }

            window.location.href = button.getAttribute('href');
        });
    });

});