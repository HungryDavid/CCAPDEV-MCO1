const renderNavbar = () => {
    const navHTML = `
        <a href="#" class="nav-item" data-role="technician,student,guest">
          <i class="fa-solid fa-house"></i><span class="nav-text">Home</span>
        </a>
    
        <a href="#" class="nav-item" data-role="technician,student">
          <i class="fa-solid fa-calendar-check"></i><span class="nav-text">My Reservations</span>
        </a>
   
      
        <a href="#" class="nav-item" data-role="technician">
          <i class="fa-solid fa-computer"></i><span class="nav-text">Manage Labs</span>
        </a>

        <a href="#" class="nav-item" data-role="technician,student">
          <i class="fa-solid fa-circle-user"></i><span class="nav-text">Profile</span>
        </a>

        <a href="#" class="nav-item" data-role="technician,student">
          <i class="fa-solid fa-magnifying-glass"></i><span class="nav-text">Search Users</span>
        </a>
    `;

    if (document.getElementById('nav-container'))
        document.getElementById('nav-container').innerHTML = navHTML;
};

renderNavbar();