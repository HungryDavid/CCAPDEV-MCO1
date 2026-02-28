// This function will be used when the modal is triggered
document.addEventListener('DOMContentLoaded', function () {
    const editModal = document.getElementById('editLabModal');

    // Adding event listener to the modal show event
    editModal.addEventListener('show.bs.modal', function (event) {
        // Button that triggered the modal
        const button = event.relatedTarget;

        // Get the row that the button belongs to
        const row = button.closest('tr');

        // Extract values from the table row
        const name = row.querySelector('td:nth-child(1)').textContent.trim(); // Lab Name
        const openTime = row.querySelector('td:nth-child(2)').textContent.trim(); // Open Time
        const closeTime = row.querySelector('td:nth-child(3)').textContent.trim(); // Close Time
        const capacity = row.querySelector('td:nth-child(4)').textContent.trim(); // Capacity

        // Get the lab ID from the "Edit" button's data-id attribute
        const id = button.getAttribute('data-id');

        // Update the form action with the correct lab ID
        document.getElementById('editLabForm').action = "/manage-labs/edit/" + id;

        // Set the values in the modal input fields
        document.getElementById('editName').value = name;
        document.getElementById('editOpenTime').value = openTime;
        document.getElementById('editCloseTime').value = closeTime;
        document.getElementById('editCapacity').value = capacity;
    });
});