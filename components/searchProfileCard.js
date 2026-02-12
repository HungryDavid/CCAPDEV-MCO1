const SearchProfileCard = (user) => {
    // We include only the profile-specific CSS here
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
                border: 2px solid #000; background: #fff;
            }
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
    `;

    return style + html;
};
