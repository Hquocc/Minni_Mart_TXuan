# Minni Mart

Giao diện quản lý tạp hóa thân thiện, tông hồng pastel, chạy trực tiếp trên trình duyệt và không cần cài đặt thư viện.

## Mở ứng dụng

Mở `index.html` bằng trình duyệt. Dữ liệu được lưu trên thiết bị bằng `localStorage`.

## Cấu trúc thư mục

```text
.
├── index.html                 # Lắp ráp ứng dụng từ các component
├── src/
│   ├── app.js                 # Dữ liệu, sự kiện và lưu trữ
│   ├── styles.css             # Giao diện responsive dùng chung
│   └── components/
│       ├── shared-ui.js       # Thẻ thống kê, tiêu đề panel, chân trang
│       ├── sidebar.js         # Menu điều hướng
│       ├── topbar.js          # Thanh đầu trang
│       ├── dashboard-page.js  # Màn hình tổng quan
│       ├── products-page.js   # Màn hình sản phẩm
│       ├── orders-page.js     # Màn hình đơn hàng
│       ├── debts-page.js      # Màn hình công nợ
│       ├── units-page.js      # Màn hình đơn vị tính
│       └── app-dialog.js      # Hộp thoại và thông báo
└── README.md
```

Các component sử dụng Web Components chuẩn của trình duyệt và render vào light DOM, nhờ đó `app.js` vẫn có thể cập nhật bảng và biểu mẫu như trước. Mỗi màn hình được giữ trong một file riêng để dễ tìm, sửa và mở rộng.

## Tính năng

- Tổng quan doanh thu, sản phẩm, đơn hàng và công nợ.
- Thêm, sửa, tìm kiếm, lọc và xóa sản phẩm.
- Lưu giá nhập và giá bán riêng cho từng sản phẩm.
- Chọn tùy chọn ghi nợ trong biểu mẫu tạo đơn để lưu đơn và danh sách mặt hàng vào sổ công nợ.
- Xem công nợ gộp theo khách, sắp xếp theo số tiền, biểu đồ công nợ và chi tiết từng lần mua.
- Xem doanh thu trong 24 giờ qua và doanh thu theo từng ngày trong 7 ngày gần nhất.
- Xem biểu đồ doanh thu trong 7/30 ngày, quý hiện tại hoặc năm hiện tại.
- Chỉnh sửa tên, số điện thoại và email của quản trị viên tại hồ sơ dưới menu.
- Chọn ảnh từ thư viện hoặc chụp ảnh sau khi bấm nút thêm ảnh.
- Tạo đơn từ sản phẩm và số lượng; tự tính doanh thu, giá vốn, lợi nhuận và cập nhật tồn kho.
- Theo dõi tổng doanh thu, lợi nhuận trên các đơn có đủ giá vốn, công nợ và thanh toán.
- Quản lý đơn vị tính; không cho xóa đơn vị đang được sản phẩm sử dụng.
- Phân trang danh sách sản phẩm và đơn hàng; hỗ trợ giữ bộ lọc khi chuyển trang.

Ảnh sản phẩm tối đa 5 MB. Lợi nhuận được tính bằng doanh thu trừ giá nhập của sản phẩm, chưa trừ các chi phí vận hành khác. Các đơn cũ chưa lưu mặt hàng sẽ không có số liệu lợi nhuận; cần tạo đơn mới từ sản phẩm để tính chính xác. Dữ liệu được lưu riêng trong trình duyệt hiện tại.
