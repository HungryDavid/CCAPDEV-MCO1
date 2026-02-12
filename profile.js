function initProfile() {
    // 1. Fetch User Data
    const currentId = localStorage.getItem("currentUserId");
    const storedUser = findUserById(currentId);

    if (!storedUser) return;

    // 2. Render to the container
    const container = document.getElementById('my-profile-container');
    if (container) {
        container.innerHTML = MyProfileCard(storedUser);
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
            // Enter Edit Mode
            area.readOnly = false;
            area.focus();
            area.setSelectionRange(area.value.length, area.value.length);
            editButton.innerHTML = '<i class="fas fa-save"></i><span>Save</span>';
        } else {
            // Exit Edit Mode & Save
            area.readOnly = true;
            editButton.innerHTML = '<i class="fa fa-pencil"></i><span>Edit Profile</span>';

        }
    });
}

document.addEventListener('DOMContentLoaded', initProfile);