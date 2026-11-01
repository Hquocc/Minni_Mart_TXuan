class UnitsPage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="page-section" id="page-units">
        <div class="page-heading heading-with-action">
          <div><p class="eyebrow">THIẾT LẬP KHO HÀNG</p><h1>Đơn vị tính</h1><p class="heading-subtitle">Thêm và quản lý đơn vị dùng cho sản phẩm.</p></div>
          <button class="button button-primary" data-action="add-unit"><span>＋</span> Thêm đơn vị</button>
        </div>
        <div class="unit-intro">
          <span class="unit-illustration">◫</span>
          <div><strong>Mỗi món hàng một cách gọi thân quen</strong><p>Tạo các đơn vị tính phù hợp với cửa hàng như chai, gói, kg hoặc thùng.</p></div>
        </div>
        <div class="unit-grid" id="units-grid"></div>
        <page-footer></page-footer>
      </section>`;
  }
}

customElements.define("units-page", UnitsPage);
