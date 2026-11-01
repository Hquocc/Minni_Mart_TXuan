const STORAGE_KEY = "minni-mart-store-v1";

const initialData = {
  admin: { name: "Thảo Nguyễn", phone: "", email: "" },
  units: ["Chai", "Gói", "Kg", "Hộp", "Thùng", "Cái"],
  products: [
    { id: "SP001", name: "Sữa tươi TH true MILK", category: "Sữa & đồ uống", unit: "Hộp", purchasePrice: 25000, price: 32000, stock: 18, emoji: "🥛", color: "milk" },
    { id: "SP002", name: "Mì Hảo Hảo tôm chua cay", category: "Đồ khô", unit: "Gói", purchasePrice: 3500, price: 4500, stock: 42, emoji: "🍜", color: "noodles" },
    { id: "SP003", name: "Dầu ăn Simply 1 lít", category: "Gia vị", unit: "Chai", purchasePrice: 42000, price: 52000, stock: 4, emoji: "🫒", color: "oil" },
    { id: "SP004", name: "Bánh quy bơ Cosy", category: "Bánh kẹo", unit: "Hộp", purchasePrice: 22000, price: 28000, stock: 12, emoji: "🍪", color: "cookie" },
    { id: "SP005", name: "Nước suối Aquafina", category: "Sữa & đồ uống", unit: "Chai", purchasePrice: 4000, price: 6000, stock: 30, emoji: "💧", color: "water" }
  ],
  orders: [
    {
      id: "DH001", customer: "Khách lẻ", date: new Date().toISOString(), amount: 64500, payment: "Tiền mặt", status: "paid",
      lines: [
        { productId: "SP001", name: "Sữa tươi TH true MILK", unit: "Hộp", quantity: 1, sellingPrice: 32000, purchasePrice: 25000, subtotal: 32000, profit: 7000 },
        { productId: "SP004", name: "Bánh quy bơ Cosy", unit: "Hộp", quantity: 1, sellingPrice: 28000, purchasePrice: 22000, subtotal: 28000, profit: 6000 },
        { productId: "SP002", name: "Mì Hảo Hảo tôm chua cay", unit: "Gói", quantity: 1, sellingPrice: 4500, purchasePrice: 3500, subtotal: 4500, profit: 1000 }
      ],
      profit: 14000
    },
    {
      id: "DH002", customer: "Cô Lan", date: new Date(Date.now() - 3600000).toISOString(), amount: 120500, payment: "Ghi nợ", status: "debt",
      lines: [
        { productId: "SP001", name: "Sữa tươi TH true MILK", unit: "Hộp", quantity: 2, sellingPrice: 32000, purchasePrice: 25000, subtotal: 64000, profit: 14000 },
        { productId: "SP003", name: "Dầu ăn Simply 1 lít", unit: "Chai", quantity: 1, sellingPrice: 52000, purchasePrice: 42000, subtotal: 52000, profit: 10000 },
        { productId: "SP002", name: "Mì Hảo Hảo tôm chua cay", unit: "Gói", quantity: 1, sellingPrice: 4500, purchasePrice: 3500, subtotal: 4500, profit: 1000 }
      ],
      profit: 25000
    },
    {
      id: "DH003", customer: "Khách lẻ", date: new Date(Date.now() - 7200000).toISOString(), amount: 32000, payment: "Tiền mặt", status: "paid",
      lines: [{ productId: "SP001", name: "Sữa tươi TH true MILK", unit: "Hộp", quantity: 1, sellingPrice: 32000, purchasePrice: 25000, subtotal: 32000, profit: 7000 }],
      profit: 7000
    }
  ],
  debts: [
    { id: "CN001", orderId: "DH002", customer: "Cô Lan", phone: "0901 234 567", date: new Date(Date.now() - 3600000).toISOString(), note: "Mua đồ dùng gia đình", amount: 120500 },
    { id: "CN002", customer: "Chú Ba", phone: "0912 345 678", date: new Date(Date.now() - 86400000 * 5).toISOString(), note: "Gạo và dầu ăn", amount: 85000 }
  ],
  collected: 450000
};

let store;
let storageWarning = "";
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  store = saved && Array.isArray(saved.products) && Array.isArray(saved.orders) && Array.isArray(saved.debts)
    ? {
        ...initialData,
        ...saved,
        products: saved.products.map((product) => ({
          ...product,
          purchasePrice: Number.isFinite(product.purchasePrice) ? product.purchasePrice : null
        })),
        debts: saved.debts.map((debt) => {
          const order = debt.orderId
            ? saved.orders.find((item) => item.id === debt.orderId)
            : saved.orders.find((item) => item.status === "debt" && item.customer === debt.customer && item.amount === debt.amount && !saved.debts.some((other) => other !== debt && other.orderId === item.id));
          return {
            ...debt,
            orderId: debt.orderId || order?.id,
            lines: debt.lines || order?.lines,
            id: debt.id || idFor("CN", saved.debts)
          };
        })
      }
    : structuredClone(initialData);
  if (saved && (!Array.isArray(saved.products) || !Array.isArray(saved.orders) || !Array.isArray(saved.debts))) {
    storageWarning = "Dữ liệu đã lưu không hợp lệ; đang dùng dữ liệu mẫu.";
  }
} catch (error) {
  store = structuredClone(initialData);
  storageWarning = error instanceof SyntaxError
    ? "Dữ liệu đã lưu bị lỗi; đang dùng dữ liệu mẫu."
    : "Không thể đọc dữ liệu trên thiết bị; đang dùng dữ liệu mẫu.";
}
store.admin = {
  ...initialData.admin,
  ...(store.admin && typeof store.admin === "object" ? store.admin : {})
};

const money = (amount) => new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const searchKey = (value) => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").toLocaleLowerCase("vi");
const idFor = (prefix, items) => `${prefix}${String(Math.max(0, ...items.map((item) => Number(item.id.slice(prefix.length)) || 0)) + 1).padStart(3, "0")}`;
const dateLabel = (value) => new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));
const timeLabel = (value) => new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }).format(new Date(value));
const persist = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    showToast("Không thể lưu dữ liệu trên thiết bị này.", true);
  }
};

const dialog = document.querySelector("#app-dialog");
const dialogForm = document.querySelector("#dialog-form");
const dialogContent = document.querySelector("#dialog-content");
let editingProductId = null;
let imageData = "";
let toastTimer;
const pageSize = 10;
const currentPage = { products: 1, orders: 1 };

function showToast(message, error = false) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.toggle("error", error);
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function productThumb(product) {
  const visual = product.image
    ? `<img src="${escapeHtml(product.image)}" alt="">`
    : escapeHtml(product.emoji || "🛍️");
  return `<span class="product-thumb ${escapeHtml(product.color || "")}">${visual}</span>`;
}

function productCell(product) {
  return `<div class="product-cell">${productThumb(product)}<span><strong>${escapeHtml(product.name)}</strong></span></div>`;
}

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function compactMoney(amount) {
  if (amount >= 1_000_000) return `${Number((amount / 1_000_000).toFixed(1))}tr`;
  if (amount >= 1_000) return `${Number((amount / 1_000).toFixed(1))}k`;
  return String(amount);
}

function paginationMarkup(list, page, total) {
  const pageCount = Math.ceil(total / pageSize);
  if (pageCount <= 1) return "";
  const firstItem = (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, total);
  const pageNumbers = new Set([1, pageCount]);
  for (let number = Math.max(2, page - 1); number <= Math.min(pageCount - 1, page + 1); number += 1) {
    pageNumbers.add(number);
  }
  const items = [...pageNumbers].sort((a, b) => a - b);
  let previous = 0;
  const buttons = items.map((number) => {
    const gap = previous && number - previous > 1 ? `<span class="pagination-ellipsis" aria-hidden="true">…</span>` : "";
    previous = number;
    return `${gap}<button type="button" class="pagination-button ${number === page ? "active" : ""}" data-pagination-list="${list}" data-pagination-page="${number}" ${number === page ? 'aria-current="page"' : ""} aria-label="Trang ${number}">${number}</button>`;
  }).join("");
  return `<span class="pagination-summary">Hiển thị ${firstItem}–${lastItem} trong ${total}</span><div class="pagination-controls">
    <button type="button" class="pagination-button pagination-arrow" data-pagination-list="${list}" data-pagination-page="${page - 1}" ${page === 1 ? "disabled" : ""} aria-label="Trang trước">‹</button>
    ${buttons}
    <button type="button" class="pagination-button pagination-arrow" data-pagination-list="${list}" data-pagination-page="${page + 1}" ${page === pageCount ? "disabled" : ""} aria-label="Trang sau">›</button>
  </div>`;
}

function renderRevenueChart() {
  const period = document.querySelector("#chart-period").value;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isMonthly = period === "quarter" || period === "year";
  const days = period === "30" ? 30 : 7;
  const currentQuarter = Math.floor(today.getMonth() / 3);
  const firstMonth = period === "year" ? 0 : currentQuarter * 3;
  const bucketCount = isMonthly ? (period === "year" ? 12 : 3) : days;
  const dates = Array.from({ length: bucketCount }, (_, index) => {
    if (isMonthly) return new Date(today.getFullYear(), firstMonth + index, 1);
    const date = new Date(today);
    date.setDate(today.getDate() - (days - index - 1));
    return date;
  });
  const chartKey = (date) => isMonthly
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    : dateKey(date);
  const totalsByDate = new Map(dates.map((date) => [chartKey(date), 0]));
  for (const order of store.orders) {
    const orderDate = new Date(order.date);
    const key = chartKey(orderDate);
    if (totalsByDate.has(key)) totalsByDate.set(key, totalsByDate.get(key) + order.amount);
  }
  const amounts = dates.map((date) => totalsByDate.get(chartKey(date)));
  const total = amounts.reduce((sum, amount) => sum + amount, 0);
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const lastDayRevenue = store.orders.reduce((sum, order) => {
    const orderTime = new Date(order.date).getTime();
    return orderTime >= oneDayAgo && orderTime <= now ? sum + order.amount : sum;
  }, 0);
  document.querySelector("#revenue-last-day").textContent = money(lastDayRevenue);
  const maximum = Math.max(...amounts, 1000);
  const magnitude = 10 ** Math.floor(Math.log10(maximum));
  const ratio = maximum / magnitude;
  const axisMaximum = (ratio <= 1 ? 1 : ratio <= 2 ? 2 : ratio <= 5 ? 5 : 10) * magnitude;
  const points = amounts.map((amount, index) => ({
    x: (index / (amounts.length - 1)) * 640,
    y: 180 - (amount / axisMaximum) * 170
  }));
  const linePath = points.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
  document.querySelector(".chart-line-path").setAttribute("d", linePath);
  document.querySelector(".chart-area-path").setAttribute("d", `${linePath} L${points[points.length - 1].x.toFixed(1)},190 L${points[0].x.toFixed(1)},190 Z`);
  document.querySelector("#chart-y-labels").innerHTML = [4, 3, 2, 1, 0]
    .map((level) => `<span>${compactMoney(axisMaximum * level / 4)}</span>`).join("");
  const labelCount = isMonthly
    ? Math.min(bucketCount, window.matchMedia("(max-width: 620px)").matches ? 7 : bucketCount)
    : 7;
  const labelIndexes = Array.from({ length: labelCount }, (_, index) => Math.round(index * (bucketCount - 1) / (labelCount - 1)));
  document.querySelector("#chart-x-labels").innerHTML = labelIndexes.map((index) => {
    const label = isMonthly
      ? new Intl.DateTimeFormat("vi-VN", { month: "short" }).format(dates[index])
      : new Intl.DateTimeFormat("vi-VN", { weekday: "short" }).format(dates[index]);
    return `<span>${escapeHtml(label)}</span>`;
  }).join("");
  document.querySelector("#chart-total").textContent = money(total);
  const periodLabel = period === "quarter" ? `Quý ${currentQuarter + 1}/${today.getFullYear()}`
    : period === "year" ? `Năm ${today.getFullYear()}`
      : `${days} ngày qua`;
  document.querySelector("#chart-summary-period").textContent = periodLabel;
  document.querySelector(".chart-svg").setAttribute("aria-label", `Biểu đồ doanh thu ${periodLabel}`);
  const recentDates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    return date;
  });
  const dailyTotals = new Map(recentDates.map((date) => [dateKey(date), 0]));
  for (const order of store.orders) {
    const key = dateKey(new Date(order.date));
    if (dailyTotals.has(key)) dailyTotals.set(key, dailyTotals.get(key) + order.amount);
  }
  document.querySelector("#daily-revenue-list").innerHTML = recentDates.map((date) => {
    const amount = dailyTotals.get(dateKey(date));
    const label = new Intl.DateTimeFormat("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" }).format(date);
    return `<div class="daily-revenue-row"><span>${escapeHtml(label)}</span><strong>${money(amount)}</strong></div>`;
  }).join("");
}

function renderProducts() {
  const search = document.querySelector("#product-search")?.value.trim().toLocaleLowerCase("vi") || "";
  const stockFilter = document.querySelector("#stock-filter")?.value || "";
  const filtered = store.products.filter((product) => {
    const matchesText = !search || `${product.name} ${product.id}`.toLocaleLowerCase("vi").includes(search);
    const matchesStock = !stockFilter || (stockFilter === "low" ? product.stock <= 5 : product.stock > 5);
    return matchesText && matchesStock;
  });
  currentPage.products = Math.min(currentPage.products, Math.max(1, Math.ceil(filtered.length / pageSize)));
  const pageProducts = filtered.slice((currentPage.products - 1) * pageSize, currentPage.products * pageSize);
  const rows = pageProducts.map((product) => `<tr>
    <td>${productCell(product)}</td><td>${escapeHtml(product.id)}</td><td>${escapeHtml(product.unit)}</td>
    <td>${money(product.price)}</td><td>${product.stock} ${escapeHtml(product.unit)}</td>
    <td><span class="stock-badge ${product.stock <= 5 ? "low" : ""}">${product.stock <= 5 ? "• Sắp hết hàng" : "• Còn hàng"}</span></td>
    <td><div class="row-actions"><button class="row-action" data-edit-product="${escapeHtml(product.id)}" aria-label="Sửa ${escapeHtml(product.name)}">✎</button><button class="row-action delete" data-delete-product="${escapeHtml(product.id)}" aria-label="Xóa ${escapeHtml(product.name)}">×</button></div></td>
  </tr>`).join("");
  document.querySelector("#products-table").innerHTML = rows;
  const productsPagination = document.querySelector("#products-pagination");
  productsPagination.innerHTML = paginationMarkup("products", currentPage.products, filtered.length);
  productsPagination.classList.toggle("hidden", filtered.length <= pageSize);
  document.querySelector("#overview-products").innerHTML = store.products.slice(0, 5).map((product) => `<tr>
    <td>${productCell(product)}</td><td>${escapeHtml(product.id)}</td><td>${escapeHtml(product.unit)}</td><td>${money(product.price)}</td>
    <td>${product.stock} ${escapeHtml(product.unit)}</td><td><span class="stock-badge ${product.stock <= 5 ? "low" : ""}">• ${product.stock <= 5 ? "Sắp hết hàng" : "Còn hàng"}</span></td>
  </tr>`).join("");
  document.querySelector("#products-empty").classList.toggle("hidden", filtered.length > 0);
  document.querySelector("#product-result-count").textContent = `${filtered.length} sản phẩm`;
  document.querySelector("#product-count").textContent = store.products.length;
  document.querySelector("#stat-products").textContent = store.products.length;
  document.querySelector("#low-stock-count").textContent = `${store.products.filter((item) => item.stock <= 5).length} sắp hết hàng`;
}

function renderOrders() {
  const filter = document.querySelector("#order-filter").value;
  const orders = store.orders.filter((order) => !filter || order.status === filter);
  currentPage.orders = Math.min(currentPage.orders, Math.max(1, Math.ceil(orders.length / pageSize)));
  const knownProfit = store.orders.filter((order) => Number.isFinite(order.profit)).reduce((sum, order) => sum + order.profit, 0);
  const ordersWithProfit = store.orders.filter((order) => Number.isFinite(order.profit)).length;
  const pageOrders = orders.slice((currentPage.orders - 1) * pageSize, currentPage.orders * pageSize);
  document.querySelector("#orders-table").innerHTML = pageOrders.map((order) => `<tr>
    <td><strong>${escapeHtml(order.id)}</strong></td><td>${escapeHtml(order.customer)}</td>
    <td>${order.lines?.length ? order.lines.map((line) => `${escapeHtml(line.name)} × ${line.quantity}`).join("<br>") : "Đơn cũ"}</td>
    <td>${timeLabel(order.date)}</td><td>${order.status === "debt" ? "Ghi vào sổ công nợ" : escapeHtml(order.payment)}</td><td><strong>${money(order.amount)}</strong></td>
    <td><strong>${Number.isFinite(order.profit) ? money(order.profit) : "—"}</strong></td>
    <td><span class="status-badge ${order.status}">• ${order.status === "debt" ? "Ghi nợ" : order.status === "pending" ? "Chờ xử lý" : "Đã thanh toán"}</span></td>
    <td>${order.status === "debt" ? `<button class="text-button" data-settle-order="${escapeHtml(order.id)}">Đã thu</button>` : ""}</td>
  </tr>`).join("");
  const ordersPagination = document.querySelector("#orders-pagination");
  ordersPagination.innerHTML = paginationMarkup("orders", currentPage.orders, orders.length);
  ordersPagination.classList.toggle("hidden", orders.length <= pageSize);
  document.querySelector("#orders-empty").classList.toggle("hidden", orders.length > 0);
  document.querySelector("#orders-total").textContent = store.orders.length;
  document.querySelector("#orders-revenue").textContent = money(store.orders.reduce((sum, order) => sum + order.amount, 0));
  document.querySelector("#orders-profit").textContent = money(knownProfit);
  document.querySelector("#orders-profit-foot").textContent = `${ordersWithProfit}/${store.orders.length} đơn có giá vốn · chưa trừ chi phí khác`;
  document.querySelector("#orders-pending").textContent = store.orders.filter((order) => order.status !== "paid").length;
  document.querySelector("#stat-orders").textContent = store.orders.length;
  document.querySelector("#stat-revenue").textContent = money(store.orders.reduce((sum, order) => sum + order.amount, 0));
  document.querySelector("#stat-profit").textContent = money(knownProfit);
  document.querySelector("#stat-profit-foot").textContent = `${ordersWithProfit}/${store.orders.length} đơn có giá vốn · chưa trừ chi phí khác`;
  renderRevenueChart();
}

function customerKey(customer) {
  return String(customer).trim().toLocaleLowerCase("vi");
}

function groupedDebts() {
  const groups = new Map();
  for (const debt of store.debts) {
    const key = customerKey(debt.customer);
    if (!groups.has(key)) {
      groups.set(key, { key, customer: debt.customer, phone: debt.phone || "", amount: 0, records: [] });
    }
    const group = groups.get(key);
    group.amount += debt.amount;
    group.records.push(debt);
    if (!group.phone && debt.phone) group.phone = debt.phone;
  }
  return [...groups.values()]
    .map((group) => ({ ...group, records: group.records.sort((a, b) => new Date(b.date) - new Date(a.date)) }))
    .sort((a, b) => b.amount - a.amount);
}

function renderDebtChart(groups) {
  const chart = document.querySelector("#debt-chart-list");
  if (!groups.length) {
    chart.innerHTML = `<p class="debt-chart-empty">Chưa có khoản công nợ để hiển thị.</p>`;
    return;
  }
  const maxAmount = groups[0].amount || 1;
  chart.innerHTML = groups.map((group) => {
    const width = Math.max(4, group.amount / maxAmount * 100);
    return `<div class="debt-chart-row">
      <span class="debt-chart-customer">${escapeHtml(group.customer)}</span>
      <span class="debt-chart-track"><i style="width:${width.toFixed(1)}%"></i></span>
      <strong>${money(group.amount)}</strong>
    </div>`;
  }).join("");
}

function renderDebts() {
  const groups = groupedDebts();
  document.querySelector("#debts-table").innerHTML = groups.map((group) => {
    const latest = group.records[0];
    return `<tr>
      <td><button class="debt-customer-button" data-debt-details="${escapeHtml(group.key)}"><span class="profile-avatar">${escapeHtml(group.customer.trim().charAt(0).toUpperCase())}</span><strong>${escapeHtml(group.customer)}</strong></button></td>
      <td>${escapeHtml(group.phone || "—")}</td><td>${group.records.length} lần</td><td>${dateLabel(latest.date)}</td>
      <td><strong>${money(group.amount)}</strong></td>
      <td><div class="row-actions"><button class="text-button" data-debt-details="${escapeHtml(group.key)}">Chi tiết</button><button class="text-button" data-collect-customer="${escapeHtml(group.key)}">Thu hết</button></div></td>
    </tr>`;
  }).join("");
  renderDebtChart(groups);
  document.querySelector("#debts-empty").classList.toggle("hidden", groups.length > 0);
  const total = store.debts.reduce((sum, debt) => sum + debt.amount, 0);
  document.querySelector("#debts-total").textContent = money(total);
  document.querySelector("#debts-customers").textContent = groups.length;
  document.querySelector("#debts-collected").textContent = money(store.collected || 0);
  document.querySelector("#stat-debt").textContent = money(total);
  document.querySelector("#stat-debt-customers").textContent = `${new Set(store.debts.map((debt) => debt.customer)).size} khách hàng`;
}

function renderUnits() {
  const icons = ["◌", "▱", "⌁", "▣", "▤", "◯"];
  document.querySelector("#units-grid").innerHTML = store.units.map((unit, index) => {
    const used = store.products.filter((product) => product.unit === unit).length;
    return `<article class="unit-card"><span class="unit-symbol">${icons[index % icons.length]}</span><span><strong>${escapeHtml(unit)}</strong><small>${used} sản phẩm đang dùng</small></span><button class="row-action delete" data-delete-unit="${escapeHtml(unit)}" aria-label="Xóa đơn vị ${escapeHtml(unit)}">×</button></article>`;
  }).join("");
}

function renderAll() {
  document.querySelector("[data-admin-name]").textContent = store.admin.name;
  document.querySelectorAll("[data-admin-initial]").forEach((avatar) => {
    avatar.textContent = store.admin.name.trim().charAt(0).toUpperCase() || "A";
  });
  renderProducts();
  renderOrders();
  renderDebts();
  renderUnits();
}

function showPage(name) {
  document.querySelectorAll(".page-section").forEach((section) => section.classList.toggle("active", section.id === `page-${name}`));
  document.querySelectorAll(".nav-link").forEach((link) => link.classList.toggle("active", link.dataset.page === name));
  const active = document.querySelector(`.nav-link[data-page="${name}"]`);
  document.querySelector("#breadcrumb-current").textContent = active?.textContent.trim().replace(/\d+$/, "").trim() || "Tổng quan";
  document.querySelector("#sidebar").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openDialog(title, content, submitLabel = "Lưu thông tin", options = {}) {
  document.querySelector("#dialog-title").textContent = title;
  const submitButton = document.querySelector("#dialog-submit");
  submitButton.textContent = submitLabel;
  submitButton.hidden = options.hideSubmit === true;
  document.querySelector("[data-close-dialog]").textContent = options.closeLabel || "Hủy";
  dialogContent.innerHTML = content;
  dialog.showModal();
}

function debtDetails(groupKey) {
  const group = groupedDebts().find((item) => item.key === groupKey);
  if (!group) return;
  const records = group.records.map((debt) => {
    const order = debt.orderId ? store.orders.find((item) => item.id === debt.orderId) : null;
    const lines = debt.lines || order?.lines || [];
    const items = lines.length
      ? `<ul class="debt-detail-items">${lines.map((line) => `<li><span>${escapeHtml(line.name)} × ${line.quantity} ${escapeHtml(line.unit || "")}</span><strong>${money(line.subtotal || line.sellingPrice * line.quantity)}</strong></li>`).join("")}</ul>`
      : `<p class="debt-detail-note">${escapeHtml(debt.note || "Chưa lưu chi tiết mặt hàng cho khoản nợ này.")}</p>`;
    return `<article class="debt-detail-record">
      <div class="debt-detail-record-heading"><span><strong>${timeLabel(debt.date)}</strong><small>${escapeHtml(debt.orderId || debt.id)}</small></span><strong>${money(debt.amount)}</strong></div>
      ${items}
      <button class="text-button" data-collect-debt="${escapeHtml(debt.id)}">Đã thu khoản này</button>
    </article>`;
  }).join("");
  openDialog(`Công nợ — ${group.customer}`, `
    <div class="debt-details-summary"><span>${group.records.length} lần ghi nợ</span><strong>Tổng còn nợ: ${money(group.amount)}</strong></div>
    <div class="debt-details-list">${records}</div>
  `, "", { hideSubmit: true, closeLabel: "Đóng" });
}

function collectDebts(debts) {
  if (!debts.length) return;
  const debtIds = new Set(debts.map((debt) => debt.id));
  const orderIds = new Set(debts.map((debt) => debt.orderId).filter(Boolean));
  const amount = debts.reduce((sum, debt) => sum + debt.amount, 0);
  store.collected = (store.collected || 0) + amount;
  store.orders.forEach((order) => {
    if (orderIds.has(order.id)) {
      order.status = "paid";
      order.payment = "Đã thu công nợ";
    }
  });
  store.debts = store.debts.filter((debt) => !debtIds.has(debt.id));
  persist();
  renderAll();
  dialog.close();
  showToast(`Đã thu ${money(amount)} công nợ.`);
}

function productForm(product = {}) {
  editingProductId = product.id || null;
  imageData = product.image || "";
  const unitOptions = [...new Set([...store.units, product.unit].filter(Boolean))].map((unit) => `<option ${unit === product.unit ? "selected" : ""}>${escapeHtml(unit)}</option>`).join("");
  openDialog(product.id ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm", `
    <div class="form-grid">
      <div class="form-field full"><label for="product-name">Tên sản phẩm *</label><input id="product-name" name="name" required maxlength="80" placeholder="Ví dụ: Sữa tươi không đường" value="${escapeHtml(product.name || "")}"></div>
      <div class="form-field full"><label>Hình ảnh sản phẩm</label><div class="image-picker">
        <span class="image-preview" id="image-preview">${imageData ? `<img src="${escapeHtml(imageData)}" alt="Ảnh xem trước">` : escapeHtml(product.emoji || "🛍️")}</span>
        <div class="image-picker-controls">
          <button class="button button-soft" type="button" data-toggle-image-options aria-expanded="false">＋ Thêm ảnh</button>
          <div class="image-options hidden" id="image-options">
            <label class="upload-button">▧ Chọn từ thư viện<input type="file" id="product-image" accept="image/*"></label>
            <label class="upload-button">◎ Chụp ảnh<input type="file" id="product-camera" accept="image/*" capture="environment"></label>
          </div>
        </div>
      </div></div>
      <div class="form-field"><label for="product-unit">Đơn vị tính *</label><select id="product-unit" name="unit" required>${unitOptions}</select></div>
      <div class="form-field"><label for="product-purchase-price">Giá nhập (₫) *</label><input id="product-purchase-price" name="purchasePrice" type="number" min="0" step="1" required placeholder="0" value="${product.purchasePrice ?? ""}"></div>
      <div class="form-field"><label for="product-price">Giá bán (₫) *</label><input id="product-price" name="price" type="number" min="0" step="1" required placeholder="0" value="${product.price ?? ""}"></div>
      <div class="form-field"><label for="product-stock">Số lượng tồn *</label><input id="product-stock" name="stock" type="number" min="0" step="1" required placeholder="0" value="${product.stock ?? ""}"></div>
    </div>`);
  dialogContent.querySelectorAll("#product-image, #product-camera").forEach((input) => input.addEventListener("change", handleImageUpload));
}

function handleImageUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    showToast("Vui lòng chọn một tệp hình ảnh.", true);
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    showToast("Ảnh quá lớn. Vui lòng chọn ảnh dưới 5 MB.", true);
    event.target.value = "";
    return;
  }
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    imageData = String(reader.result);
    document.querySelector("#image-preview").innerHTML = `<img src="${escapeHtml(imageData)}" alt="Ảnh xem trước">`;
    document.querySelector("#image-options").classList.add("hidden");
    document.querySelector("[data-toggle-image-options]").setAttribute("aria-expanded", "false");
  });
  reader.addEventListener("error", () => showToast("Không thể đọc ảnh này. Vui lòng thử lại.", true));
  reader.readAsDataURL(file);
}

function orderProductOptions(selectedId = "", query = "") {
  const normalizedQuery = searchKey(query.trim());
  const matchingProducts = store.products.filter((product) => {
    return !normalizedQuery || searchKey(`${product.name} ${product.id}`).includes(normalizedQuery);
  });
  const placeholder = normalizedQuery && matchingProducts.length === 0 ? "Không tìm thấy sản phẩm phù hợp" : "Chọn sản phẩm";
  return `<option value="">${placeholder}</option>${matchingProducts.map((product) => `
    <option value="${escapeHtml(product.id)}" ${product.stock <= 0 ? "disabled" : ""} ${product.id === selectedId ? "selected" : ""}>
      ${escapeHtml(product.name)}${product.stock <= 0 ? " — Hết hàng" : ` — ${money(product.price)}`}
    </option>`).join("")}`;
}

function renderOrderLine(selectedId = store.products.find((product) => product.stock > 0)?.id || "") {
  const product = store.products.find((item) => item.id === selectedId);
  const row = document.createElement("div");
  row.className = "order-line-row";
  row.innerHTML = `
    <div class="order-product-picker">
      <input class="order-product-search" type="search" aria-label="Tìm sản phẩm" placeholder="Tìm theo tên hoặc mã sản phẩm..." autocomplete="off">
      <select class="order-product-select" aria-label="Chọn sản phẩm" required>
        ${orderProductOptions(selectedId)}
      </select>
    </div>
    <input class="order-quantity" type="number" aria-label="Số lượng" min="1" step="1" max="${product?.stock || 1}" value="1" required>
    <button class="row-action delete" type="button" data-remove-order-line aria-label="Xóa mặt hàng">×</button>`;
  return row;
}

function updateOrderSummary() {
  const rows = [...dialogContent.querySelectorAll(".order-line-row")];
  let total = 0;
  for (const row of rows) {
    const product = store.products.find((item) => item.id === row.querySelector(".order-product-select").value);
    const quantity = Number(row.querySelector(".order-quantity").value) || 0;
    if (!product) continue;
    row.querySelector(".order-quantity").max = product.stock;
    total += product.price * quantity;
  }
  const totalTarget = dialogContent.querySelector("#order-total");
  if (totalTarget) totalTarget.textContent = money(total);
}

function orderForm() {
  openDialog("Tạo đơn hàng", `<div class="form-grid">
    <div class="form-field full"><label for="order-customer">Tên khách hàng *</label><input id="order-customer" name="customer" required maxlength="60" placeholder="Tên khách hoặc Khách lẻ" value="Khách lẻ"></div>
    <div class="form-field full">
      <label>Sản phẩm và số lượng *</label>
      <div class="order-lines" id="order-lines"></div>
      <button class="button button-soft add-order-line" type="button" data-add-order-line>＋ Thêm mặt hàng</button>
    </div>
    <div class="form-field full order-debt-option"><label class="order-debt-label" for="order-record-debt"><input id="order-record-debt" name="recordDebt" type="checkbox"><span>Ghi đơn hàng này vào sổ công nợ</span></label><small>Đánh dấu nếu khách mua thiếu hoặc chưa thanh toán.</small></div>
    <div class="form-field"><label for="order-payment">Hình thức thanh toán</label><select id="order-payment" name="payment"><option>Tiền mặt</option><option>Chuyển khoản</option></select></div>
    <div class="form-field"><label for="order-note">Ghi chú</label><input id="order-note" name="note" maxlength="100" placeholder="Ghi chú (không bắt buộc)"></div>
    <div class="order-summary full">
      <div><span>Tiền cần thanh toán</span><strong id="order-total">0 ₫</strong></div>
    </div>
  </div>`, "Tạo đơn hàng");
  document.querySelector("#order-lines").append(renderOrderLine());
  updateOrderSummary();
}

function debtForm() {
  openDialog("Ghi nợ khách hàng", `<div class="form-grid">
    <div class="form-field"><label for="debt-customer">Tên khách hàng *</label><input id="debt-customer" name="customer" required maxlength="60" placeholder="Tên khách hàng"></div>
    <div class="form-field"><label for="debt-phone">Số điện thoại</label><input id="debt-phone" name="phone" type="tel" maxlength="20" placeholder="09xx xxx xxx"></div>
    <div class="form-field full"><label for="debt-amount">Số tiền ghi nợ (₫) *</label><input id="debt-amount" name="amount" type="number" required min="1" step="1" placeholder="0"></div>
    <div class="form-field full"><label for="debt-note">Ghi chú</label><textarea id="debt-note" name="note" maxlength="160" placeholder="Mặt hàng hoặc lời nhắn..."></textarea></div>
  </div>`, "Lưu khoản nợ");
}

function unitForm() {
  openDialog("Thêm đơn vị tính", `<div class="form-grid"><div class="form-field full"><label for="unit-name">Tên đơn vị *</label><input id="unit-name" name="unit" required maxlength="24" placeholder="Ví dụ: Túi, Lon, Quyển"></div></div>`, "Thêm đơn vị");
}

function adminProfileForm() {
  openDialog("Thông tin quản trị viên", `<div class="form-grid">
    <div class="form-field full"><label for="admin-name">Họ và tên *</label><input id="admin-name" name="name" required maxlength="60" value="${escapeHtml(store.admin.name)}" placeholder="Nhập họ và tên"></div>
    <div class="form-field full"><label for="admin-phone">Số điện thoại</label><input id="admin-phone" name="phone" type="tel" maxlength="20" value="${escapeHtml(store.admin.phone)}" placeholder="09xx xxx xxx"></div>
    <div class="form-field full"><label for="admin-email">Email</label><input id="admin-email" name="email" type="email" maxlength="100" value="${escapeHtml(store.admin.email)}" placeholder="email@example.com"></div>
  </div>`, "Lưu thông tin");
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("button");
  if (!target) return;
  if (target.matches(".profile-button")) adminProfileForm();
  if (target.hasAttribute("data-toggle-image-options")) {
    const options = dialogContent.querySelector("#image-options");
    const opening = options.classList.contains("hidden");
    options.classList.toggle("hidden", !opening);
    target.setAttribute("aria-expanded", String(opening));
  }
  if (target.hasAttribute("data-add-order-line")) {
    document.querySelector("#order-lines").append(renderOrderLine());
    updateOrderSummary();
  }
  if (target.hasAttribute("data-remove-order-line")) {
    target.closest(".order-line-row").remove();
    updateOrderSummary();
  }
  if (target.dataset.paginationList) {
    const list = target.dataset.paginationList;
    const page = Number(target.dataset.paginationPage);
    if ((list === "products" || list === "orders") && Number.isInteger(page) && page >= 1) {
      currentPage[list] = page;
      if (list === "products") renderProducts();
      else renderOrders();
    }
  }
  if (target.dataset.debtDetails) debtDetails(target.dataset.debtDetails);
  if (target.dataset.page) showPage(target.dataset.page);
  if (target.dataset.navigate) showPage(target.dataset.navigate);
  if (target.dataset.action === "add-product") productForm();
  if (target.dataset.action === "add-order") orderForm();
  if (target.dataset.action === "add-debt") debtForm();
  if (target.dataset.action === "add-unit") unitForm();
  if (target.dataset.editProduct) {
    const product = store.products.find((item) => item.id === target.dataset.editProduct);
    if (product) productForm(product);
  }
  if (target.dataset.deleteProduct) {
    const product = store.products.find((item) => item.id === target.dataset.deleteProduct);
    if (product && window.confirm(`Xóa sản phẩm "${product.name}" khỏi danh sách?`)) {
      store.products = store.products.filter((item) => item.id !== product.id);
      persist(); renderAll(); showToast("Đã xóa sản phẩm.");
    }
  }
  if (target.dataset.collectDebt) {
    const debt = store.debts.find((item) => item.id === target.dataset.collectDebt);
    if (debt && window.confirm(`Xác nhận đã thu ${money(debt.amount)} từ ${debt.customer}?`)) {
      collectDebts([debt]);
    }
  }
  if (target.dataset.collectCustomer) {
    const group = groupedDebts().find((item) => item.key === target.dataset.collectCustomer);
    if (group && window.confirm(`Xác nhận đã thu toàn bộ ${money(group.amount)} từ ${group.customer}?`)) {
      collectDebts(group.records);
    }
  }
  if (target.dataset.settleOrder) {
    const order = store.orders.find((item) => item.id === target.dataset.settleOrder);
    if (order) {
      const debt = store.debts.find((item) => item.orderId === order.id);
      if (debt) {
        collectDebts([debt]);
      } else {
        order.status = "paid";
        order.payment = "Đã thu công nợ";
        store.collected = (store.collected || 0) + order.amount;
        persist(); renderAll(); showToast("Đơn hàng đã được đánh dấu thanh toán.");
      }
    }
  }
  if (target.dataset.deleteUnit) {
    const unit = target.dataset.deleteUnit;
    if (store.products.some((product) => product.unit === unit)) {
      showToast("Không thể xóa đơn vị đang được sản phẩm sử dụng.", true);
    } else if (window.confirm(`Xóa đơn vị "${unit}"?`)) {
      store.units = store.units.filter((item) => item !== unit);
      persist(); renderAll(); showToast("Đã xóa đơn vị tính.");
    }
  }
  if (target.matches(".dialog-close, [data-close-dialog]")) dialog.close();
});

dialogForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(dialogForm);
  if (dialogContent.querySelector("#product-name")) {
    const name = String(form.get("name")).trim();
    const unit = String(form.get("unit"));
    const purchasePrice = Number(form.get("purchasePrice"));
    const price = Number(form.get("price"));
    const stock = Number(form.get("stock"));
    if (!name || !unit || !Number.isFinite(purchasePrice) || purchasePrice < 0 || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
      showToast("Vui lòng kiểm tra lại thông tin sản phẩm.", true); return;
    }
    const product = { id: editingProductId || idFor("SP", store.products), name, unit, purchasePrice, price, stock, image: imageData, emoji: "🛍️" };
    if (editingProductId) store.products = store.products.map((item) => {
      if (item.id !== editingProductId) return item;
      const existing = { ...item };
      delete existing.category;
      return { ...existing, ...product };
    });
    else { store.products.unshift(product); currentPage.products = 1; }
    persist(); renderAll(); dialog.close(); showToast(editingProductId ? "Đã cập nhật sản phẩm." : "Đã thêm sản phẩm.");
    return;
  }
  if (dialogContent.querySelector("#order-customer")) {
    const customer = String(form.get("customer")).trim();
    const payment = String(form.get("payment"));
    const recordDebt = form.get("recordDebt") === "on";
    const quantities = new Map();
    for (const row of dialogContent.querySelectorAll(".order-line-row")) {
      const productId = row.querySelector(".order-product-select").value;
      const quantity = Number(row.querySelector(".order-quantity").value);
      if (!productId || !Number.isInteger(quantity) || quantity <= 0) {
        showToast("Vui lòng chọn sản phẩm và nhập số lượng hợp lệ.", true); return;
      }
      quantities.set(productId, (quantities.get(productId) || 0) + quantity);
    }
    if (!customer || quantities.size === 0) { showToast("Đơn hàng cần có tên khách và ít nhất một sản phẩm.", true); return; }
    const orderLines = [];
    for (const [productId, quantity] of quantities) {
      const product = store.products.find((item) => item.id === productId);
      if (!product || quantity > product.stock) {
        showToast(`Số lượng "${product?.name || "sản phẩm"}" vượt quá tồn kho.`, true); return;
      }
      if (product.purchasePrice == null) {
        showToast(`Hãy nhập giá nhập cho "${product.name}" trước khi tạo đơn.`, true); return;
      }
      orderLines.push({
        productId: product.id,
        name: product.name,
        unit: product.unit,
        quantity,
        sellingPrice: product.price,
        purchasePrice: product.purchasePrice,
        subtotal: product.price * quantity,
        profit: (product.price - product.purchasePrice) * quantity
      });
    }
    const amount = orderLines.reduce((sum, line) => sum + line.subtotal, 0);
    if (amount <= 0) { showToast("Tổng tiền đơn hàng cần lớn hơn 0.", true); return; }
    const profit = orderLines.reduce((sum, line) => sum + line.profit, 0);
    const order = {
      id: idFor("DH", store.orders), customer, date: new Date().toISOString(), amount, profit, lines: orderLines,
      payment: recordDebt ? "Ghi nợ" : payment,
      status: recordDebt ? "debt" : "paid"
    };
    for (const line of orderLines) {
      const product = store.products.find((item) => item.id === line.productId);
      product.stock -= line.quantity;
    }
    store.orders.unshift(order);
    currentPage.orders = 1;
    if (order.status === "debt") {
      store.debts.unshift({
        id: idFor("CN", store.debts),
        orderId: order.id,
        customer,
        phone: "",
        date: order.date,
        note: String(form.get("note") || "").trim(),
        amount,
        lines: orderLines
      });
    }
    persist(); renderAll(); dialog.close(); showToast("Đã tạo đơn hàng.");
    return;
  }
  if (dialogContent.querySelector("#debt-customer")) {
    const customer = String(form.get("customer")).trim();
    const amount = Number(form.get("amount"));
    if (!customer || !Number.isFinite(amount) || amount <= 0) { showToast("Vui lòng nhập tên khách và số tiền hợp lệ.", true); return; }
    store.debts.unshift({ id: idFor("CN", store.debts), customer, phone: String(form.get("phone") || "").trim(), date: new Date().toISOString(), note: String(form.get("note") || "").trim(), amount });
    persist(); renderAll(); dialog.close(); showToast("Đã ghi nhận công nợ.");
    return;
  }
  if (dialogContent.querySelector("#unit-name")) {
    const unit = String(form.get("unit")).trim();
    if (!unit) { showToast("Vui lòng nhập tên đơn vị.", true); return; }
    if (store.units.some((item) => item.toLocaleLowerCase("vi") === unit.toLocaleLowerCase("vi"))) { showToast("Đơn vị này đã có trong danh sách.", true); return; }
    store.units.push(unit); persist(); renderAll(); dialog.close(); showToast("Đã thêm đơn vị tính.");
    return;
  }
  if (dialogContent.querySelector("#admin-name")) {
    const name = String(form.get("name") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const email = String(form.get("email") || "").trim();
    if (!name) { showToast("Vui lòng nhập họ và tên.", true); return; }
    store.admin = { name, phone, email };
    persist(); renderAll(); dialog.close(); showToast("Đã cập nhật thông tin quản trị viên.");
  }
});

document.querySelector("#product-search").addEventListener("input", () => { currentPage.products = 1; renderProducts(); });
document.querySelector("#stock-filter").addEventListener("change", () => { currentPage.products = 1; renderProducts(); });
document.querySelector("#order-filter").addEventListener("change", () => { currentPage.orders = 1; renderOrders(); });
document.querySelector("#sidebar-toggle").addEventListener("click", (event) => {
  const shell = document.querySelector(".app-shell");
  const collapsed = shell.classList.toggle("sidebar-collapsed");
  const button = event.currentTarget;
  button.setAttribute("aria-expanded", String(!collapsed));
  button.setAttribute("aria-label", collapsed ? "Mở rộng thanh menu" : "Thu gọn thanh menu");
  button.title = collapsed ? "Mở rộng thanh menu" : "Thu gọn thanh menu";
  button.querySelector("span").textContent = collapsed ? "›" : "‹";
});
document.querySelector("#mobile-menu").addEventListener("click", () => document.querySelector("#sidebar").classList.toggle("open"));
dialogForm.addEventListener("input", (event) => {
  if (event.target.matches(".order-quantity")) updateOrderSummary();
  if (event.target.matches(".order-product-search")) {
    const row = event.target.closest(".order-line-row");
    const select = row.querySelector(".order-product-select");
    const selectedId = select.value;
    select.innerHTML = orderProductOptions(selectedId, event.target.value);
    if (select.value !== selectedId) {
      row.querySelector(".order-quantity").value = "1";
      const selectedProduct = store.products.find((product) => product.id === select.value);
      row.querySelector(".order-quantity").max = selectedProduct?.stock || 1;
    }
    updateOrderSummary();
  }
});
dialogForm.addEventListener("change", (event) => {
  if (event.target.matches(".order-product-select")) {
    const product = store.products.find((item) => item.id === event.target.value);
    const quantity = event.target.closest(".order-line-row").querySelector(".order-quantity");
    quantity.max = product?.stock || 1;
    quantity.value = "1";
    updateOrderSummary();
  }
});
document.querySelector("#chart-period").addEventListener("change", renderRevenueChart);
const today = new Date();
document.querySelector("#today-label").textContent = new Intl.DateTimeFormat("vi-VN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(today);
document.querySelector("#greeting-date").textContent = new Intl.DateTimeFormat("vi-VN", { weekday: "long", day: "2-digit", month: "long" }).format(today).toLocaleUpperCase("vi");
renderAll();
if (storageWarning) showToast(storageWarning, true);
