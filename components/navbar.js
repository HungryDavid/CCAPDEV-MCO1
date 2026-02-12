const renderNavbar = () => {
    const navHTML = `
        <a href="#" class="nav-item" id="home" data-role="technician,student,guest">
          <i class="fa-solid fa-house"></i><span class="nav-text">Home</span>
        </a>
    
        <a href="#" class="nav-item" id="reservations" data-role="technician,student">
          <i class="fa-solid fa-calendar-check"></i><span class="nav-text">My Reservations</span>
        </a>
   
      
        <a href="#" class="nav-item" id="manage-labs" data-role="technician">
          <i class="fa-solid fa-computer"></i><span class="nav-text">Manage Labs</span>
        </a>

        <a href="#" class="nav-item" id="profile" data-role="technician,student">
          <i class="fa-solid fa-circle-user"></i><span class="nav-text">Profile</span>
        </a>

        <a href="#" class="nav-item" id="search-users" data-role="technician,student">
          <i class="fa-solid fa-magnifying-glass"></i><span class="nav-text">Search Users</span>
        </a>

        <a href="#" class="nav-item" id="logout" data-role="technician,student">
          <i class="fa fa-sign-out"></i><span class="nav-text">Logout</span>
        </a>
    `;

    if (document.getElementById('nav-container'))
      document.getElementById('nav-container').innerHTML = navHTML;

    if (document.getElementById('home'))
      document.getElementById('home').addEventListener("click", function(){
        window.location.href = './front-page.html'; 
    });

    if (document.getElementById('reservations'))
      document.getElementById('reservations').addEventListener("click", function(){
        window.location.href = './front-page.html'; 
    });

    if (document.getElementById('manage-labs'))
      document.getElementById('manage-labs').addEventListener("click", function(){
        window.location.href = './front-page.html'; 
    });

    if (document.getElementById('profile'))
      document.getElementById('profile').addEventListener("click", function(){
        window.location.href = './profile.html'; 
    });
    
    if (document.getElementById('search-users'))
      document.getElementById('search-users').addEventListener("click", function(){
        window.location.replace('./search-user.html'); 
    });

    if (document.getElementById('logout'))
      document.getElementById('logout').addEventListener("click", function(){

        sessionStorage.clear();
        localStorage.removeItem('currentUserId');
        window.location.href = "index.html";

    });

};

renderNavbar();