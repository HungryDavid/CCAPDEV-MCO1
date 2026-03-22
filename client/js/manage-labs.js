function minutesToTimeString(totalMinutes) {
    if (isNaN(totalMinutes)) return "00:00";
    const hours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
    const minutes = (totalMinutes % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

document.addEventListener('DOMContentLoaded', function () {
    const editModal = document.getElementById('editLabModal');

    if (editModal) {
        editModal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            
            const id = button.getAttribute('data-id');
            const bldg = button.getAttribute('data-bldg');
            const roomNumber = button.getAttribute('data-roomnumber');
            const open = parseInt(button.getAttribute('data-open'));
            const close = parseInt(button.getAttribute('data-close'));
            const capacity = button.getAttribute('data-capacity');

            const form = editModal.querySelector('#editLabForm');
            if (form) form.action = `/labs/manage/${id}/edit`;

            const roomField = editModal.querySelector('input[name="roomNumber"]');
            if (roomField) roomField.value = roomNumber || '';

            const bldgField = editModal.querySelector('select[name="buildingAbbreviation"]');
            if (bldgField) bldgField.value = bldg || '';

            const openField = editModal.querySelector('#editOpenTime');
            if (openField) openField.value = minutesToTimeString(open);

            const closeField = editModal.querySelector('#editCloseTime');
            if (closeField) closeField.value = minutesToTimeString(close);

            const capField = editModal.querySelector('#editCapacity');
            if (capField) capField.value = capacity || '';
        });
    }

    const deleteModal = document.getElementById('deleteLabModal');
    if (deleteModal) {
        deleteModal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            const id = button.getAttribute('data-id');
            const deleteForm = deleteModal.querySelector('#deleteLabForm');
            if (deleteForm) deleteForm.action = `/labs/manage/${id}/delete`;
        });
    }

    const forms = ['#createLabModal form', '#editLabForm'];
    forms.forEach(selector => {
        const form = document.querySelector(selector);
        if (!form) return;

        form.addEventListener('submit', (e) => {
            const openInput = form.querySelector('input[name="openTime"]');
            const closeInput = form.querySelector('input[name="closeTime"]');
            if (openInput.value && closeInput.value) {
                if (openInput.value >= closeInput.value) {
                    e.preventDefault();
                    alert("Error: Opening time must be earlier than closing time.");
                    closeInput.focus();
                }
            }
        });
    });

});