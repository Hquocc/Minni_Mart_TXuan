class StatCard extends HTMLElement {
  connectedCallback() {
    const label = this.getAttribute("label") || "";
    const icon = this.getAttribute("icon") || "";
    const tone = this.getAttribute("tone") || "pink";
    const valueId = this.getAttribute("value-id") || "";
    const value = this.getAttribute("value") || "0";
    const foot = this.getAttribute("foot") || "";
    const footId = this.getAttribute("foot-id") || "";

    this.innerHTML = `
      <article class="stat-card">
        <div class="stat-top"><span>${label}</span><span class="stat-icon ${tone}-icon">${icon}</span></div>
        <strong id="${valueId}">${value}</strong>
        <small class="stat-foot" ${footId ? `id="${footId}"` : ""}>${foot}</small>
      </article>`;
  }
}

class PanelHeading extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute("title") || "";
    const subtitle = this.getAttribute("subtitle") || "";
    const controls = this.innerHTML;

    this.innerHTML = `
      <div class="panel-heading panel-heading-padded">
        <div><h2>${title}</h2><p>${subtitle}</p></div>
        ${controls}
      </div>`;
  }
}

class PageFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="page-footer">
        <span>Phiên bản 1.0</span>
      </footer>`;
  }
}

customElements.define("stat-card", StatCard);
customElements.define("panel-heading", PanelHeading);
customElements.define("page-footer", PageFooter);
