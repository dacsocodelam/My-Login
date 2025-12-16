// ============================================================================
// FILE QUẢN LÝ THÔNG BÁO (MESSAGES) - Tập trung tất cả thông báo ở đây
// ============================================================================
// Lợi ích: Chỉ cần sửa 1 file này khi muốn thay đổi nội dung thông báo

const MESSAGES = {
  // --- THÔNG BÁO LỖI TỔNG ---
  E0000: "入力エラー内容を確認してください。",
  E0000_SUCCESS: "✓ ログイン成功！しばらくお待ちください...",

  // --- THÔNG BÁO LỖI TRƯỜNG BẮT BUỘC (E0001) ---
  E0001_ID: "診察券番号を入力してください。",
  E0001_EMAIL: "メールアドレスを入力してください。",
  E0001_PASSWORD: "パスワードを入力してください。",

  // --- THÔNG BÁO LỖI NGÀY THÁNG (E0005) ---
  E0005: "日付が不正です。",

  // --- THÔNG BÁO LỖI FORMAT EMAIL (E0019) ---
  E0019: "メールアドレスの形式が不正です。",

  // --- THÔNG BÁO LỖI DATABASE (M0103) ---
  M0103:
    "ログインユーザーＩＤまたはパスワードが誤っています。正しく入力してください。",

  // --- THÔNG BÁO ĐÃ ĐĂNG KÝ (E0009) ---
  E0009: "すでに登録されている{0}です。",
};

// ============================================================================
// HÀM LOAD THÔNG BÁO VÀO TRANG (Tự động chạy khi load trang)
// ============================================================================
window.addEventListener("DOMContentLoaded", function () {
  // Load thông báo lỗi tổng
  document.getElementById("msg_E0000").innerHTML = MESSAGES.E0000;

  // Load thông báo lỗi từng trường
  document.getElementById("msg_E0001_id").innerHTML = MESSAGES.E0001_ID;
  document.getElementById("msg_E0001_email").innerHTML = MESSAGES.E0001_EMAIL;
  document.getElementById("msg_E0001_pass").innerHTML = MESSAGES.E0001_PASSWORD;
  document.getElementById("msg_E0005").innerHTML = MESSAGES.E0005;
  document.getElementById("msg_E0019").innerHTML = MESSAGES.E0019;
  document.getElementById("msg_M0103").innerHTML = MESSAGES.M0103;
  document.getElementById("msg_E0009").innerHTML = MESSAGES.E0009;
});
