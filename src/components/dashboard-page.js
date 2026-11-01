class DashboardPage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="page-section active" id="page-overview">
        <div class="page-heading heading-with-action">
          <div>
            <p class="eyebrow" id="greeting-date"></p>
            <h1><span id="greeting-title"></span> <span class="wave">✿</span></h1>
            <p class="heading-subtitle">Cùng xem cửa hàng nhỏ của bạn hôm nay nhé.</p>
          </div>
          <button class="button button-primary" data-action="add-order"><span>＋</span> Thêm đơn hàng</button>
        </div>
        <section class="panel quick-panel top-quick-panel">
          <div class="panel-heading"><div><h2>Thao tác nhanh</h2><p>Tiết kiệm thời gian mỗi ngày</p></div></div>
          <div class="quick-actions">
            <button data-action="add-order"><span class="quick-icon quick-lilac">↗</span><span><strong>Tạo đơn hàng</strong><small>Ghi nhận đơn bán mới</small></span><b>›</b></button>
            <button data-action="add-product"><span class="quick-icon quick-pink">＋</span><span><strong>Thêm sản phẩm</strong><small>Cập nhật hàng hóa mới</small></span><b>›</b></button>
            <button data-action="add-debt"><span class="quick-icon quick-peach">♡</span><span><strong>Ghi nợ khách hàng</strong><small>Lưu khoản khách mua thiếu</small></span><b>›</b></button>
          </div>
        </section>
        <div class="stats-grid">
          <article class="stat-card">
            <div class="stat-top"><span>Tổng doanh thu</span><span class="stat-icon pink-icon">↗</span></div>
            <strong id="stat-revenue">0 ₫</strong>
            <small class="stat-foot">Tổng tiền bán hàng</small>
            <div class="sparkline pink-line"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
          </article>
          <article class="stat-card">
            <div class="stat-top"><span>Lãi sau giá vốn</span><span class="stat-icon lilac-icon">↗</span></div>
            <strong id="stat-profit">0 ₫</strong>
            <small class="stat-foot" id="stat-profit-foot">Doanh thu trừ giá nhập sản phẩm</small>
            <div class="sparkline lilac-line"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
          </article>
          <article class="stat-card">
            <div class="stat-top"><span>Lãi + công nợ đã thu</span><span class="stat-icon yellow-icon">∑</span></div>
            <strong id="stat-profit-collected">0 ₫</strong>
            <small class="stat-foot">Lãi sau giá vốn cộng tiền đã thu</small>
            <div class="sparkline yellow-line"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
          </article>
          <article class="stat-card">
            <div class="stat-top"><span>Sản phẩm đang bán</span><span class="stat-icon mint-icon">▦</span></div>
            <strong id="stat-products">0</strong>
            <small class="stat-foot"><span id="low-stock-count" class="warning">0 sắp hết/hết hàng</span></small>
            <div class="sparkline mint-line"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
          </article>
          <article class="stat-card">
            <div class="stat-top"><span>Khách đang nợ</span><span class="stat-icon pink-icon">♡</span></div>
            <strong id="stat-debt">0 ₫</strong>
            <small class="stat-foot"><span id="stat-debt-customers">0 khách hàng</span> cần thu</small>
            <div class="sparkline pink-line"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
          </article>
          <article class="stat-card">
            <div class="stat-top"><span>Công nợ đã thu</span><span class="stat-icon mint-icon">✓</span></div>
            <strong id="stat-collected">0 ₫</strong>
            <small class="stat-foot">Tổng tiền đã thu</small>
            <div class="sparkline mint-line"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
          </article>
        </div>
        <div class="overview-grid">
          <section class="panel revenue-panel">
            <div class="panel-heading">
              <div><h2>Tình hình bán hàng</h2><p>Doanh thu theo ngày, tính cả đơn ghi nợ</p></div>
              <select class="select-small" id="chart-period" aria-label="Khoảng thời gian">
                <option value="7">7 ngày qua</option>
                <option value="30">30 ngày qua</option>
                <option value="quarter">Quý này</option>
                <option value="year">Năm nay</option>
              </select>
            </div>
            <div class="chart-summary"><strong id="chart-total">0 ₫</strong><span id="chart-summary-period">7 ngày qua</span></div>
            <div class="chart-area">
              <div class="chart-y-labels" id="chart-y-labels"></div>
              <div class="chart-plot">
                <div class="chart-grid-lines"><i></i><i></i><i></i><i></i><i></i></div>
                <svg class="chart-svg" viewBox="0 0 640 190" preserveAspectRatio="none" aria-label="Biểu đồ doanh thu 7 ngày">
                  <defs><linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#f2a6c1" stop-opacity=".35"/><stop offset="100%" stop-color="#f2a6c1" stop-opacity="0"/></linearGradient></defs>
                  <path class="chart-area-path" d="" fill="url(#chart-fill)"/>
                  <path class="chart-line-path" d="" fill="none" stroke="#e987aa" stroke-width="3" vector-effect="non-scaling-stroke"/>
                  <path class="chart-debt-line-path" d="" fill="none" stroke="#65b58d" stroke-width="2.5" vector-effect="non-scaling-stroke"/>
                  <path class="chart-profit-collected-line-path" d="" fill="none" stroke="#d7a62f" stroke-width="2.5" vector-effect="non-scaling-stroke"/>
                </svg>
                <div class="chart-x-labels" id="chart-x-labels"></div>
              </div>
            </div>
            <div class="chart-legend" aria-label="Chú giải biểu đồ">
              <span><i class="chart-legend-revenue"></i>Tổng doanh thu</span>
              <span><i class="chart-legend-debt"></i>Công nợ đã thu</span>
              <span><i class="chart-legend-profit-collected"></i>Lãi sau giá vốn + công nợ đã thu</span>
            </div>
            <div class="daily-revenue" id="daily-revenue">
              <div class="revenue-last-day"><span>Doanh thu 24 giờ qua</span><strong id="revenue-last-day">0 ₫</strong></div>
              <div class="daily-revenue-heading"><strong>Doanh thu từng ngày</strong><span>7 ngày gần nhất</span></div>
              <div class="daily-revenue-list" id="daily-revenue-list"></div>
            </div>
          </section>
        </div>
        <section class="panel overview-debt-panel">
          <div class="panel-heading">
            <div><h2>Khách hàng còn nợ</h2><p>Số tiền và số lần ghi nợ chưa thanh toán</p></div>
            <button class="text-button" data-navigate="debts">Xem sổ công nợ <span>→</span></button>
          </div>
          <div class="table-wrap">
            <table class="overview-debt-table">
              <thead><tr><th>KHÁCH HÀNG</th><th>SỐ LẦN GHI NỢ</th><th>SỐ TIỀN CÒN NỢ</th></tr></thead>
              <tbody id="overview-debts"></tbody>
            </table>
          </div>
          <div class="empty-state hidden" id="overview-debts-empty"><strong>Không có khách hàng còn nợ</strong></div>
        </section>
        <section class="panel recent-panel">
          <div class="panel-heading">
            <div><h2>Sản phẩm gần đây</h2><p>Các mặt hàng trong cửa hàng của bạn</p></div>
            <button class="text-button" data-navigate="products">Xem tất cả <span>→</span></button>
          </div>
          <div class="table-wrap">
            <table><thead><tr><th>SẢN PHẨM</th><th>MÃ SẢN PHẨM</th><th>ĐƠN VỊ</th><th>GIÁ BÁN</th><th>TỒN KHO</th><th>TRẠNG THÁI</th></tr></thead><tbody id="overview-products"></tbody></table>
          </div>
        </section>
        <page-footer></page-footer>
      </section>`;
  }
}

customElements.define("dashboard-page", DashboardPage);
