const editButton = document.getElementById('edit-btn');
const area = document.getElementById('description');

editButton.addEventListener('click', () => {
  const isReadOnly = area.readOnly;

  if (isReadOnly) {
    area.readOnly = false;
    area.focus();
    area.setSelectionRange(area.value.length, area.value.length);
    editButton.innerHTML = '<i class="fas fa-save" aria-hidden="true"></i><span>Save</span>';
  } else {
    area.readOnly = true;
    editButton.innerHTML = '<i class="fa fa-pencil" aria-hidden="true"></i><span>Edit Profile</span>';
  }

});
