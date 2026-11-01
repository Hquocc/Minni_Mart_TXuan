# Minni Mart

Giao diện quản lý tạp hóa tông hồng pastel, dùng Web Components ở frontend, Vercel serverless API và MongoDB Atlas để lưu dữ liệu.

## Mở ứng dụng

Ứng dụng dùng MongoDB qua API serverless trên Vercel. Khi chạy có kết nối, dữ liệu chính được lưu trong MongoDB; `localStorage` chỉ giữ bản sao dự phòng trên thiết bị.

## Cấu hình MongoDB và Vercel

1. Đổi mật khẩu database MongoDB Atlas vừa chia sẻ trong cuộc trò chuyện; không dùng lại mật khẩu cũ.
2. Tạo database user chỉ có quyền `readWrite` trên database `minni_mart`.
3. Trong Vercel, thêm Environment Variables:
   - `MONGODB_URI`: connection string mới của Atlas.
   - `MONGODB_DB_NAME`: `minni_mart`.
4. Bật **Deployment Protection** cho cả production và preview deployments. API dữ liệu cửa hàng không có đăng nhập riêng; lớp bảo vệ này phải áp dụng cho toàn bộ website và các đường dẫn `/api/*`.
5. Triển khai project lên Vercel. API nằm tại `api/store.js`; lần truy cập đầu sẽ đưa dữ liệu sẵn có của origin đó vào MongoDB, hoặc khởi tạo dữ liệu mẫu nếu chưa có dữ liệu. Dữ liệu lưu dưới `file://` không tự chuyển sang domain Vercel.

Không đưa connection string vào mã nguồn hoặc biến JavaScript phía trình duyệt. `.env.example` chỉ là mẫu; dùng Environment Variables của Vercel để lưu thông tin thật. Cài dependency bằng `npm install`; khi chạy local, dùng `npx vercel dev` sau khi tạo `.env.local` từ `.env.example` và điền thông tin MongoDB mới. Không mở ứng dụng bằng `file://` khi cần dữ liệu MongoDB.

MongoDB Atlas phải cho phép kết nối mạng từ môi trường triển khai Vercel. Ưu tiên cấu hình network access phù hợp với gói Vercel đang dùng; không mở truy cập rộng nếu chưa hiểu rủi ro.

MongoDB client được tái sử dụng giữa các lần gọi serverless, bắt đầu với pool tối đa 5 kết nối và không giữ kết nối nhàn rỗi. Theo dõi số kết nối và độ trễ trong Atlas khi có lưu lượng thực tế trước khi điều chỉnh.

Nếu log Vercel báo `Server is missing MONGODB_URI`, thêm biến này ở Project Settings → Environment Variables cho đúng môi trường deployment rồi redeploy. Nếu log báo `MongoServerSelectionError`, kiểm tra Atlas Network Access/IP allowlist và DNS từ Vercel. Nếu là `Authentication failed`, kiểm tra database user và URL-encode ký tự đặc biệt trong mật khẩu. Log API chỉ ghi thông tin lỗi đã lọc, không ghi connection string.

## Cấu trúc thư mục

```text
.
├── index.html                 # Lắp ráp ứng dụng từ các component
├── api/
│   └── store.js               # API đọc/ghi dữ liệu qua MongoDB
├── package.json               # MongoDB Node.js driver
├── src/
│   ├── app.js                 # Giao diện, sự kiện và đồng bộ dữ liệu
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
- Ưu tiên hiển thị sản phẩm hết hàng và sắp hết hàng ở đầu danh sách.
- Lưu giá nhập và giá bán riêng cho từng sản phẩm.
- Chọn tùy chọn ghi nợ trong biểu mẫu tạo đơn để lưu đơn và danh sách mặt hàng vào sổ công nợ.
- Xem công nợ gộp theo khách, sắp xếp theo số tiền, biểu đồ công nợ, chi tiết từng lần mua và thu hết trong hộp thoại.
- Xem doanh thu trong 24 giờ qua và doanh thu/công nợ đã thu theo từng ngày trong 7 ngày gần nhất.
- Xem biểu đồ doanh thu và công nợ đã thu trong 7/30 ngày, quý hiện tại hoặc năm hiện tại. Khi cập nhật, tổng công nợ đã thu cũ chưa có ngày giao dịch sẽ được ghi nhận một lần vào ngày cập nhật để hiển thị trên biểu đồ.
- Chỉnh sửa tên, số điện thoại và email của quản trị viên tại hồ sơ dưới menu.
- Chọn ảnh từ thư viện hoặc chụp ảnh; ảnh được nén trước khi lưu.
- Tạo đơn từ sản phẩm và số lượng; tự tính doanh thu, giá vốn, lợi nhuận và cập nhật tồn kho.
- Theo dõi tổng doanh thu, lợi nhuận trên các đơn có đủ giá vốn, công nợ và thanh toán.
- Quản lý đơn vị tính; không cho xóa đơn vị đang được sản phẩm sử dụng.
- Phân trang danh sách sản phẩm và đơn hàng; hỗ trợ giữ bộ lọc khi chuyển trang.
- In báo cáo lịch sử bán hàng hôm nay hoặc 7 ngày gần nhất từ màn hình đơn hàng.
- Lưu dữ liệu cửa hàng vào MongoDB Atlas qua Vercel serverless API.

Ảnh đầu vào tối đa 5 MB và được nén WebP trước khi lưu. Lợi nhuận được tính bằng doanh thu trừ giá nhập của sản phẩm, chưa trừ các chi phí vận hành khác. Các đơn cũ chưa lưu mặt hàng sẽ không có số liệu lợi nhuận; cần tạo đơn mới từ sản phẩm để tính chính xác.
