class OrdersPage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="page-section" id="page-orders">
        <div class="page-heading heading-with-action">
          <div><p class="eyebrow">BÁN HÀNG</p><h1>Đơn hàng</h1><p class="heading-subtitle">Theo dõi các giao dịch bán hàng tại cửa hàng.</p></div>
          <button class="button button-primary" data-action="add-order"><span>＋</span> Tạo đơn hàng</button>
        </div>
        <div class="stats-grid compact-stats">
          <stat-card label="Tổng đơn hàng" icon="▤" tone="lilac" value-id="orders-total" value="0" foot="Tất cả giao dịch"></stat-card>
          <stat-card label="Tổng doanh thu" icon="↗" tone="mint" value-id="orders-revenue" value="0 ₫" foot="Tiền bán hàng, gồm cả đơn nợ"></stat-card>
          <stat-card label="Lãi sau giá vốn" icon="♡" tone="peach" value-id="orders-profit" foot-id="orders-profit-foot" value="0 ₫" foot="Doanh thu trừ giá nhập sản phẩm"></stat-card>
          <stat-card label="Chưa thanh toán" icon="◷" tone="lilac" value-id="orders-pending" value="0" foot="Đơn đang ghi nợ/chờ thu"></stat-card>
        </div>
        <section class="panel data-panel">
          <panel-heading title="Danh sách đơn hàng" subtitle="Lịch sử bán hàng mới nhất">
            <div class="order-tools">
              <select class="filter-select" id="order-filter" aria-label="Lọc đơn hàng">
                <option value="">Tất cả đơn hàng</option><option value="paid">Đã thanh toán</option><option value="debt">Ghi vào sổ công nợ</option>
              </select>
              <div class="print-actions" aria-label="In lịch sử bán hàng">
                <button class="button button-soft" type="button" data-print-sales="1">In hôm nay</button>
                <button class="button button-soft" type="button" data-print-sales="7">In 7 ngày</button>
              </div>
            </div>
          </panel-heading>
          <div class="table-wrap">
            <table>
              <thead><tr><th>MÃ ĐƠN</th><th>KHÁCH HÀNG</th><th>SẢN PHẨM</th><th>THỜI GIAN</th><th>THANH TOÁN</th><th>DOANH THU</th><th>LỢI NHUẬN</th><th>TRẠNG THÁI</th><th></th></tr></thead>
              <tbody id="orders-table"></tbody>
            </table>
          </div>
          <nav class="pagination" id="orders-pagination" aria-label="Phân trang đơn hàng"></nav>
          <div class="empty-state hidden" id="orders-empty"><span>▤</span><strong>Chưa có đơn hàng nào</strong><p>Tạo đơn đầu tiên để bắt đầu theo dõi doanh thu.</p></div>
        </section>
        <page-footer></page-footer>
      </section>`;
  }
}

customElements.define("orders-page", OrdersPage);
