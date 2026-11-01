class ProductsPage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="page-section" id="page-products">
        <div class="page-heading heading-with-action">
          <div><p class="eyebrow">KHO HÀNG CỦA BẠN</p><h1>Sản phẩm</h1><p class="heading-subtitle">Quản lý các mặt hàng đang có tại cửa hàng.</p></div>
          <button class="button button-primary" data-action="add-product"><span>＋</span> Thêm sản phẩm</button>
        </div>
        <div class="toolbar panel">
          <label class="search-box"><span aria-hidden="true">⌕</span><input id="product-search" type="search" placeholder="Tìm tên hoặc mã sản phẩm..." aria-label="Tìm sản phẩm"></label>
          <select class="filter-select" id="stock-filter" aria-label="Lọc theo tồn kho"><option value="">Tất cả tồn kho</option><option value="low">Sắp hết / hết hàng</option><option value="available">Còn hàng</option></select>
          <span class="toolbar-spacer"></span><span class="result-count" id="product-result-count"></span>
        </div>
        <section class="panel data-panel">
          <div class="table-wrap">
            <table>
              <thead><tr><th>SẢN PHẨM</th><th>MÃ SẢN PHẨM</th><th>ĐƠN VỊ</th><th>GIÁ BÁN</th><th>TỒN KHO</th><th>TRẠNG THÁI</th><th></th></tr></thead>
              <tbody id="products-table"></tbody>
            </table>
          </div>
          <nav class="pagination" id="products-pagination" aria-label="Phân trang sản phẩm"></nav>
          <div class="empty-state hidden" id="products-empty"><span>♡</span><strong>Chưa tìm thấy sản phẩm</strong><p>Thử đổi từ khóa tìm kiếm hoặc thêm mặt hàng mới nhé.</p><button class="button button-soft" data-action="add-product">＋ Thêm sản phẩm</button></div>
        </section>
        <page-footer></page-footer>
      </section>`;
  }
}

customElements.define("products-page", ProductsPage);
