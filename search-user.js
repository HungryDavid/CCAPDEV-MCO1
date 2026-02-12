function initProfile() {

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    // 1. Fetch User Data
    const input = document.getElementById("search-bar").value;
    const user = findUserById("12345678");

    if (!user) return;

    // 2. Render to the container
    const container = document.getElementById('profile-container');
    if (container) {
        container.innerHTML = SearchProfileCard(user);
    }
  }
});

    
}

document.addEventListener('DOMContentLoaded', initProfile);