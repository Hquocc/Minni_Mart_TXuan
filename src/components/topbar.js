class StoreTopbar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="topbar">
        <button class="sidebar-toggle" id="sidebar-toggle" type="button" aria-label="Thu gọn thanh menu" aria-expanded="true" title="Thu gọn thanh menu"><span aria-hidden="true">‹</span></button>
        <button class="mobile-menu" id="mobile-menu" aria-label="Mở menu">☰</button>
        <div class="breadcrumb">
          <button class="breadcrumb-home" type="button" data-page="overview">Cửa hàng</button><span class="breadcrumb-divider">/</span>
          <strong id="breadcrumb-current">Tổng quan</strong>
        </div>
        <div class="topbar-actions">
          <span class="today-label" id="today-label"></span>
          <span class="topbar-avatar" data-admin-initial>T</span>
        </div>
      </header>`;
  }
}

customElements.define("store-topbar", StoreTopbar);
