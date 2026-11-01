class DebtsPage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="page-section" id="page-debts">
        <div class="page-heading heading-with-action">
          <div><p class="eyebrow">SỔ GHI NHỚ</p><h1>Sổ công nợ</h1><p class="heading-subtitle">Theo dõi khoản khách hàng mua thiếu và thanh toán.</p></div>
          <button class="button button-primary" data-action="add-debt"><span>＋</span> Ghi nợ mới</button>
        </div>
        <div class="stats-grid compact-stats">
          <stat-card label="Tổng công nợ" icon="♡" tone="peach" value-id="debts-total" value="0 ₫" foot="Số tiền chưa thu"></stat-card>
          <stat-card label="Khách đang nợ" icon="♙" tone="lilac" value-id="debts-customers" value="0" foot="Khách hàng có dư nợ"></stat-card>
          <stat-card label="Đã thu tháng này" icon="✓" tone="mint" value-id="debts-collected" value="0 ₫" foot="Tiền đã ghi nhận"></stat-card>
        </div>
        <section class="panel debt-chart-panel">
          <panel-heading title="Công nợ theo khách hàng" subtitle="Xếp theo số tiền còn nợ từ cao xuống thấp"></panel-heading>
          <div class="debt-chart-list" id="debt-chart-list"></div>
        </section>
        <section class="panel data-panel">
          <panel-heading title="Danh sách công nợ" subtitle="Bấm vào khách hàng để xem từng lần mua và thời gian ghi nợ"></panel-heading>
          <div class="table-wrap">
            <table>
              <thead><tr><th>KHÁCH HÀNG</th><th>SỐ ĐIỆN THOẠI</th><th>SỐ LẦN GHI NỢ</th><th>GHI NHẬN GẦN NHẤT</th><th>TỔNG TIỀN CÒN NỢ</th><th></th></tr></thead>
              <tbody id="debts-table"></tbody>
            </table>
          </div>
          <nav class="pagination" id="debts-pagination" aria-label="Phân trang sổ công nợ"></nav>
          <div class="empty-state hidden" id="debts-empty"><span>♡</span><strong>Chưa có khoản nợ nào</strong><p>Cửa hàng chưa có khách hàng ghi nợ.</p></div>
        </section>
        <page-footer></page-footer>
      </section>`;
  }
}

customElements.define("debts-page", DebtsPage);
