class StoreSidebar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <aside class="sidebar" id="sidebar">
        <button class="brand" type="button" data-page="overview" aria-label="Minni Mart trang chủ">
          <span class="brand-mark">m</span>
          <span><strong>minni mart</strong></span>
        </button>
        <p class="nav-caption">MENU CHÍNH</p>
        <nav class="main-nav" aria-label="Điều hướng chính">
          <button class="nav-link active" data-page="overview">Tổng quan</button>
          <button class="nav-link" data-page="products">Sản phẩm<span class="nav-count" id="product-count">0</span></button>
          <button class="nav-link" data-page="orders">Đơn hàng</button>
          <button class="nav-link" data-page="debts">Sổ công nợ</button>
          <button class="nav-link" data-page="units">Đơn vị tính</button>
          </nav>
          <div class="sidebar-bottom">
            <button class="profile-button" type="button" aria-label="Chỉnh sửa thông tin quản trị viên">
              <span class="profile-avatar" data-admin-initial>T</span>
              <span><strong data-admin-name>Thảo Nguyễn</strong><small>Quản trị viên</small></span>
              <span class="more-dots">···</span>
            </button>
        </div>
      </aside>`;
  }
}

customElements.define("store-sidebar", StoreSidebar);
