function initProfile() {
    const currentId = localStorage.getItem("currentUserId");
    const storedUser = findUserById(currentId);

    if (!storedUser) return;

    const container = document.getElementById('my-profile-container');
    if (container) {
        container.innerHTML = MyProfileCard(storedUser);
        console.log("ok");
        attachLogic();
    }
}

function attachLogic() {
  console.log("ok");
    const editButton = document.getElementById('edit-btn');
    const area = document.getElementById('description');

    editButton.addEventListener('click', () => {
        const isReadOnly = area.readOnly;

        if (isReadOnly) {
            area.readOnly = false;
            area.focus();
            area.setSelectionRange(area.value.length, area.value.length);
            editButton.innerHTML = '<i class="fas fa-save"></i><span>Save</span>';
        } else {
            area.readOnly = true;
            editButton.innerHTML = '<i class="fa fa-pencil"></i><span>Edit Profile</span>';

        }
    });

    if (sessionStorage.getItem("userType")=="technician"){
        const reservationsContainer = document.getElementById("reservations-container");

        if (reservationsContainer) { 
            reservationsContainer.remove();
        }
    }
        

}

document.addEventListener('DOMContentLoaded', initProfile);
