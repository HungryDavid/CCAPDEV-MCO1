const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block; /* Fixes the 'space' issue from before */
    }
    header {
      display: flex;
      align-items: center;
      background-image: url("./imgs/HS.jpg");
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      background-blend-mode: soft-light;
      background-color: #006937;
      min-height: 10vh;
      will-change: transform; /* Hardware acceleration hint */
    }
    h1 {
      font-size: clamp(1.5rem, 5vw + 0.7rem, 3rem);
      font-family: "Montserrat", "Poppins", sans-serif;
      color: white;
      margin: 0 0 0 4rem;
    }
    @media (min-width: 768px) {
      header { min-height: 25vh; }
    }
  </style>
  <header>
    <h1 id="header-title"></h1>
  </header>
`;

class Header extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const title = this.getAttribute('title') || 'Title';
    this.shadowRoot.getElementById('header-title').textContent = title;
  }
}

customElements.define('app-header', Header);