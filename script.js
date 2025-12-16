// ============================================================================
// 1. KHỞI TẠO DỮ LIỆU (Database Giả - Mock Data)
// ============================================================================
// Đây là bảng 'person' mô phỏng database thật
// Trong thực tế, dữ liệu này sẽ được lấy từ server qua API
const DB_PERSON = [
  {
    examination_number: "12345", // Mã số khám bệnh
    birthday: "2002-12-22", // Ngày sinh (Format: YYYY-MM-DD)
    email: "dat@test.com", // Email đăng ký
    deleted_flag: 0, // 0 = Chưa xóa, 1 = Đã xóa
    apikey: null, // null = Chưa đăng ký (OK để đăng ký mới)
    applied: "2024-01-01", // Ngày apply
  },
  {
    examination_number: "99999",
    birthday: "2000-01-01",
    email: "user2@test.com",
    deleted_flag: 0,
    apikey: "uuid-co-roi", // Có apikey = Đã đăng ký rồi (Sẽ bị lỗi M0109)
    applied: "2024-01-01",
  },
];

// ============================================================================
// 2. TẠO LISTBOX NGÀY THÁNG NĂM (Chạy tự động khi trang load xong)
// ============================================================================
window.onload = function () {
  // Lấy năm hiện tại (VD: 2025)
  const currentYear = new Date().getFullYear();

  // --- TẠO DROPDOWN NĂM (1950 → Năm hiện tại) ---
  for (let i = 1950; i <= currentYear; i++) {
    let opt = new Option(i, i); // Option(text hiển thị, giá trị)
    document.getElementById("inp_year").add(opt); // Thêm vào dropdown năm
  }

  // --- TẠO DROPDOWN THÁNG (01 → 12) ---
  for (let i = 1; i <= 12; i++) {
    // padStart(2, "0") để format: 1 → "01", 2 → "02"...
    let opt = new Option(i, i.toString().padStart(2, "0"));
    document.getElementById("inp_month").add(opt);
  }

  // --- TẠO DROPDOWN NGÀY (01 → 31) ---
  for (let i = 1; i <= 31; i++) {
    let opt = new Option(i, i.toString().padStart(2, "0"));
    document.getElementById("inp_day").add(opt);
  }

  // --- MẶC ĐỊNH CHỌN SẴN 1 NGÀY (Optional - Đang comment) ---
  // Nếu muốn chọn sẵn ngày 22/12/2002, bỏ comment 3 dòng dưới:
  // document.getElementById("inp_year").value = "2002";
  // document.getElementById("inp_month").value = "12";
  // document.getElementById("inp_day").value = "22";
};

// ============================================================================
// 3. HÀM XỬ LÝ CHÍNH (Khi user bấm nút "Login")
// ============================================================================
function handleLogin() {
  // ---------------------------------------------------------------------------
  // BƯỚC A: RESET TẤT CẢ THÔNG BÁO LỖI CŨ
  // ---------------------------------------------------------------------------
  // Ẩn hết tất cả thông báo lỗi trước đó (nếu có) để check lại từ đầu
  document
    .querySelectorAll(".error-msg, .main-error") // Tìm tất cả element có class này
    .forEach((el) => (el.style.display = "none")); // Ẩn đi (display: none)

  let hasError = false; // Biến đánh dấu có lỗi hay không

  // ---------------------------------------------------------------------------
  // BƯỚC B: LẤY DỮ LIỆU TỪ FORM
  // ---------------------------------------------------------------------------
  const id = document.getElementById("inp_id").value; // Mã số khám
  const year = document.getElementById("inp_year").value; // Năm sinh
  const month = document.getElementById("inp_month").value; // Tháng sinh
  const day = document.getElementById("inp_day").value; // Ngày sinh
  const email = document.getElementById("inp_email").value; // Email
  const pass = document.getElementById("inp_pass").value; // Mật khẩu

  // ---------------------------------------------------------------------------
  // BƯỚC C: KIỂM TRA INPUT (Validation)
  // ---------------------------------------------------------------------------

  // --- C1. CHECK TRỐNG (E0001) ---
  // Nếu không nhập ID → Hiện lỗi "E0001: Vui lòng nhập Mã số khám"
  if (!id) {
    document.getElementById("msg_E0001_id").style.display = "block";
    hasError = true;
  }
  // Nếu không nhập Email → Hiện lỗi "E0001: Vui lòng nhập Email"
  if (!email) {
    document.getElementById("msg_E0001_email").style.display = "block";
    hasError = true;
  }
  // Nếu không nhập Password → Hiện lỗi "E0001: Vui lòng nhập Mật khẩu"
  if (!pass) {
    document.getElementById("msg_E0001_pass").style.display = "block";
    hasError = true;
  }

  // --- C2. CHECK FORMAT EMAIL (E0019) ---
  // Check đơn giản: Email phải có ký tự "@"
  // VD: "abc@example.com" → OK, "abcexample.com" → Lỗi
  if (email && !email.includes("@")) {
    document.getElementById("msg_E0019").style.display = "block";
    hasError = true;
  }

  // --- C3. CHECK NGÀY THÁNG HỢP LỆ (E0005) ---
  // Ví dụ: 31/02 (Tháng 2 không có ngày 31) → Lỗi
  // Cách check: Tạo Date object, nếu JS tự động sửa ngày → Không hợp lệ
  const checkDate = new Date(year, month - 1, day); // month - 1 vì JS đếm từ 0
  // VD: Nhập 31/02 → JS chuyển thành 03/03 → month khác nhau → Lỗi!
  if (checkDate.getMonth() + 1 != month || checkDate.getDate() != day) {
    document.getElementById("msg_E0005").style.display = "block";
    hasError = true;
  }

  // --- C4. NẾU CÓ LỖI → DỪNG LẠI ---
  if (hasError) {
    document.getElementById("msg_E0000").style.display = "block"; // Hiện lỗi tổng
    return; // Dừng hàm, không xử lý tiếp
  }

  // ---------------------------------------------------------------------------
  // BƯỚC D: CHECK DATABASE (Kiểm tra thông tin có khớp không)
  // ---------------------------------------------------------------------------

  // --- D1. FORMAT NGÀY SINH ĐỂ SO SÁNH ---
  // Ghép năm-tháng-ngày thành format "YYYY-MM-DD" (VD: "2002-12-22")
  const inputBirthday = `${year}-${month}-${day}`;

  // --- D2. TÌM USER TRONG DATABASE ---
  // Tìm user thỏa mãn TẤT CẢ 4 điều kiện:
  // 1. Mã số khám khớp
  // 2. Ngày sinh khớp
  // 3. Email khớp
  // 4. Chưa bị xóa (deleted_flag = 0)
  const user = DB_PERSON.find(
    (p) =>
      p.examination_number == id && // So sánh ID
      p.birthday == inputBirthday && // So sánh ngày sinh
      p.email == email && // So sánh email
      p.deleted_flag == 0 // Chỉ lấy user chưa bị xóa
  );

  // --- D3. KIỂM TRA KẾT QUẢ TÌM KIẾM ---

  // Nếu KHÔNG TÌM THẤY user nào khớp
  if (!user) {
    // Lỗi M0103: Thông tin không khớp hoặc không tồn tại
    document.getElementById("msg_M0103").style.display = "block";
    return; // Dừng lại
  }

  // Nếu user đã có apikey (khác null) → Đã đăng ký rồi
  if (user.apikey != null) {
    // Lỗi M0109: Tài khoản đã được đăng ký trước đó
    document.getElementById("msg_M0109").style.display = "block";
    return; // Dừng lại
  }

  // ---------------------------------------------------------------------------
  // BƯỚC E: ĐĂNG KÝ THÀNH CÔNG! 🎉
  // ---------------------------------------------------------------------------

  // --- E1. XỬ LÝ BACKEND (Trong thực tế) ---
  // Lý thuyết:
  // - Gửi password lên server để cập nhật vào database
  // - Server tạo apikey mới cho user
  // - Ghi log vào file text
  // - Gửi email kích hoạt
  console.log("Cập nhật Password:", pass);
  console.log("Ghi file text mail: Gửi tới " + email + " nội dung...");

  // --- E2. CHUYỂN HƯỚNG SANG TRANG KHÁC ---
  // Đổi tên file HTML bên dưới thành trang bạn muốn chuyển đến
  // VD: "home.html", "dashboard.html", "welcome.html"...
  const REDIRECT_URL = "hato.html"; // <-- THAY TÊN FILE Ở ĐÂY

  // --- E3. HIỂN THỊ THÔNG BÁO THÀNH CÔNG (MÀU XANH) ---
  document.getElementById("msg_E0000").innerHTML =
    "✓ ログイン成功！しばらくお待ちください..."; // Nội dung thông báo
  document.getElementById("msg_E0000").style.color = "green"; // Đổi chữ sang xanh
  document.getElementById("msg_E0000").style.borderColor = "green"; // Đổi viền sang xanh
  document.getElementById("msg_E0000").style.display = "block"; // Hiện thông báo

  // --- E4. CHUYỂN TRANG SAU 1.5 GIÂY ---
  setTimeout(() => {
    window.location.href = REDIRECT_URL; // Chuyển hướng
  }, 1500); // 1500ms = 1.5 giây
}

// ============================================================================
// 4. HÀM XÓA FORM (Khi user bấm nút "Cancel")
// ============================================================================
function clearForm() {
  // --- XÓA TẤT CẢ GIÁ TRỊ TRONG INPUT ---
  // Tìm tất cả input (text, password) và set value = "" (rỗng)
  document.querySelectorAll("input").forEach((el) => (el.value = ""));

  // --- ẨN TẤT CẢ THÔNG BÁO LỖI ---
  // Ẩn hết các thông báo lỗi đỏ (nếu có)
  document
    .querySelectorAll(".error-msg, .main-error")
    .forEach((el) => (el.style.display = "none"));
}
