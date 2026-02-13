class DashboardTemplate extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>

      </style>

      
    `;
  }
}

customElements.define('app-dashboard', DashboardTemplate);