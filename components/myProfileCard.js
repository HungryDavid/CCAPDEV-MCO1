const MyProfileCard = (user) => {
    const style = `
        <style>
            .profile-picture img { max-width: 180px; border-radius: 90px; }
            .profile-picture { display: flex; justify-content: center; padding: 2rem 0 0.5rem 0; }
            .profile-name { display: flex; justify-content: center; font-size: 1.6rem; font-weight: bold; }
            .profile-description { display: flex; justify-content: center; padding: 0.5rem 0; margin-bottom: 0.6rem; }
            .profile-description textarea {
                field-sizing: content; overflow-wrap: anywhere;
                min-height: 1lh; max-height: 10lh; width: 80%;
                text-align: center; resize: none;
                transition: all 0.2s ease; border: 2px solid transparent; 
                background: transparent; outline: none; font-size: 1rem;  
            }
            .profile-description textarea:not([readonly]) {
                border: 2px solid #000; 
                background: #fff;
            }
            .profile-edit { display: flex; justify-content: center; }
            .button {
                padding: 8px 0; 
                min-width: 140px; 
                margin: 0 10px;
                font-size: 0.8rem;      
                background-color: transparent; 
                border: 1px solid #006937;
                cursor: pointer;
            }
            #edit-btn i { margin-right: 5px; font-size: 0.8rem; }
        </style>
    `;

    const html = `
        <div class="profile-picture">
            <img src="${user.profilePic || './imgs/portraitPlaceholder.png'}"/>
        </div>
        <div class="profile-name" id="profile-name">${user.fName + " " + user.lName}</div>
        <div class="profile-description">
            <textarea id="description" rows="1" wrap="soft" readonly>${user.description || 'No description provided.'}</textarea>
        </div>
        <div class="profile-edit">
            <button id="edit-btn" class="button">
                <i class="fa fa-pencil" aria-hidden="true"></i><span>Edit Profile</span>
            </button>

            <button id="delete-btn" class="button">
                <i class="fa fa-trash" aria-hidden="true"></i> <span>Delete Account</span>
            </button>
        </div>
    `;

    return style + html;
};
