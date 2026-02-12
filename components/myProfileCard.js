const renderMyProfileCard = () => {
    const myProfileCard = `
        <div class="profile-picture"><img src="./imgs/portraitPlaceholder.png"/></div>
        <div class="profile-name" id="profile-name">name</div>
        <div class="profile-description">
          <textarea id="description" rows="1" wrap="soft" readonly>Description</textarea>
        </div>
        <div class="profile-edit">
          <button id="edit-btn">
            <i class="fa fa-pencil" aria-hidden="true"></i><span>Edit Profile</span>
          </button>
        </div>
    `;

    if (document.getElementById('my-profile-container'))
      document.getElementById('my-profile-container').innerHTML = myProfileCard;
}


renderMyProfileCard();

