document.addEventListener('DOMContentLoaded', function () {
    const editBtn = document.getElementById('edit-btn');
    const saveBtn = document.getElementById('save-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    const nameDisplay = document.getElementById('name-display-section');
    const nameEdit = document.getElementById('name-edit-section');
    const bioText = document.getElementById('bio-textarea');
    const bioHidden = document.getElementById('bio-hidden');
    const profileForm = document.getElementById('edit-profile-form');
    const imageUpload = document.getElementById('image-upload-section'); //


    if (editBtn) {
        editBtn.addEventListener('click', function () {
            // Toggle Visibility
            editBtn.classList.add('d-none');
            saveBtn.classList.remove('d-none');
            saveBtn.classList.add('d-flex');

            // Enable Bio Editing
            bioText.removeAttribute('readonly');
            bioText.classList.remove('border-0', 'bg-transparent');
            bioText.focus();

            if(imageUpload) imageUpload.classList.remove('d-none');
        });

        

        // Sync Textarea to Hidden Input before Submit
        if (profileForm) {
            profileForm.addEventListener('submit', function () {
                bioHidden.value = bioText.value;
            });
        };
    }
    
});