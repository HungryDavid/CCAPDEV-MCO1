document.getElementById('seatGrid').addEventListener('click', function(e) {
  const seatButton = e.target;

  if (seatButton.classList.contains('seat-btn') && !seatButton.disabled) {
    const seatNumber = seatButton.dataset.seat;
    const time = document.getElementById('timeSelect').value;

    // Get the previously selected seats from localStorage (if any)
    let selectedSeats = JSON.parse(localStorage.getItem('selectedSeats')) || [];
    let selectedTimes = JSON.parse(localStorage.getItem('selectedTimes')) || [];

    // Check if the seat is already selected
    const seatIndex = selectedSeats.findIndex(s => s.seatNumber === seatNumber && s.time === time);
    
    if (seatIndex !== -1) {
      // Deselect the seat
      selectedSeats.splice(seatIndex, 1);
    } else {
      // Select the seat
      selectedSeats.push({ seatNumber, time });
    }

    // Store the updated selections in local storage (session for now)
    localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));

    // Update the selected times to ensure unique entries
    selectedTimes = Array.from(new Set(selectedSeats.map(s => s.time)));  // Keep unique times
    localStorage.setItem('selectedTimes', JSON.stringify(selectedTimes));

    // Optionally, update UI with the selected seats and times
    updateSelectedInfo(selectedSeats, selectedTimes);
  }
});

function updateSelectedInfo(selectedSeats, selectedTimes) {
  const selectedSeatsElement = document.getElementById('selectedSeats');
  const selectedTimesElement = document.getElementById('selectedTimes');
  const totalSelectedElement = document.getElementById('totalSelected');

  selectedSeatsElement.textContent = selectedSeats.map(s => s.seatNumber).join(', ') || 'None';
  selectedTimesElement.textContent = selectedTimes.join(', ') || 'None';
  totalSelectedElement.textContent = selectedSeats.length;
}

document.getElementById('timeSelect').addEventListener('change', function() {
  document.getElementById('timeSelectForm').submit(); // Submit the form to reload the page with the new time
});