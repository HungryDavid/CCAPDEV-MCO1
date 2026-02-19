class NavBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.routes = [
      { label: 'Home', id: "home", path: './front-page.html', roles: ['guest', 'student', 'technician'], icon: 'fa-solid fa-house' },
      { label: 'Reservations', id: "reservations", path: './edit-reservations.html', roles: ['student'], icon: 'fa-solid fa-calendar' },
      { label: 'Manage Labs', id: "manage-labs", path: './front-page.html', roles: ['technician'], icon: 'fa-solid fa-desktop'},
      { label: 'Profile', id: "profile", path: './profile.html', roles: ['student'], icon: 'fa-solid fa-circle-user' },
      { label: 'Search User', id: "search-user", path: './search-user.html', roles: ['student', 'technician'], icon: 'fa-solid fa-magnifying-glass' },
      { label: 'Logout', id: "logout",  path: './front-page.html', roles: ['student', 'technician'], icon: 'fa fa-sign-out' },
      { label: 'Exit', id: "exit",  path: './index.html', roles: ['guest'], icon: 'fa fa-sign-out' }
    ];
  }

  static get observedAttributes() {
    return ['role'];
  }

  attributeChangedCallback() {
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {

    const userRole = sessionStorage.getItem('userType') || 'guest';

    const links = this.routes
    .filter(route => route.roles.includes(userRole))
    .map(route => `
      <li>
        <a href="${route.path}" id="nav-${route.id}">
          <i class="${route.icon}"></i><span class="link-text">${route.label}</span>
        </a>
      </li>`)
    .join('');

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
      <style>

        .sidebar {
          height: 100%;
          padding-top: 1.5rem;
          display: flex;
          grid-area: sidebar;
          flex-direction: column;
          align-items: center;
          gap: 1.2rem;
          background-color: whitesmoke;
        }

        #title-logo{
          width: 80%;
        }

        .logo{
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .links-container{
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .content{
          grid-area: title-section;
        }

        .link-text{
          font-family: "Inter", "Roboto", sans-serif;
          display: none;
          font-weight: bold;
          font-size: 1.2rem;
        }

        i{
          font-size: 1.7rem;
          color: darkslategray;
        }

        li{
          width: 100%;
          padding: 0.6rem 0;
          display: flex;
          justify-content: center;
        }
        
        ul{
          list-style-type: none; 
          margin: 0;           
          padding: 0;
        }

        @media (min-width: 768px) {

          #title-logo{
            padding-top: 2rem;
            max-height: 200px;
          }

          .links-container{
            align-items: flex-start;
          }

          i{
            text-align: center;
            font-size: 2rem;
            min-width: 55px;
          }

          li{
            display: block;
          }

          a{
            text-decoration: none;
          }

          .link-text{
            text-decoration: none;
            color: black;
            display: inline;
            margin: 5px;
          }
        }
      </style>

      <nav class="sidebar">
        <div class="logo">
          <img id="title-logo" src="imgs/logo.png" alt="">
        </div>

        <div class="links-container">
          <ul>${links}</ul>
        </div>
      </nav>      
    `;

    this.setupListeners();
  }


  setupListeners() {
    const logoutLink = this.shadowRoot.getElementById('nav-logout');
    if (logoutLink) {
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.clear();
        localStorage.removeItem('currentUserId');
        window.location.href = "index.html";
      });
    }
  }

}
customElements.define('app-navbar', NavBar);
