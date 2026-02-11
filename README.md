# 💕 Valentine Website

Website Valentine hiện đại, công nghệ nhưng lãng mạn dành cho vợ yêu.

## Tính năng
- 🔐 Entry Gate - Xác nhận ngày cưới (04/02/2026)
- ⏱️ Countdown - Đếm ngược đến Valentine 14/02/2026
- 📖 Memory Book - Sách kỉ niệm với hiệu ứng lật trang 3D
- 💌 Love Letter - Thư tình với typewriter effect
- ❤️ Heart Animation - Vẽ trái tim parametric trên Canvas
- 🎵 Background Music - Tự động phát nhạc nền
- ✨ Floating Particles - Trái tim bay lơ lửng
- 📱 Responsive Design - Desktop, Tablet, Mobile

## Chạy Local

```bash
npx -y serve .
```

Mở trình duyệt: `http://localhost:3000`

## Cấu hình nội dung

### Thay nội dung sách kỉ niệm
Sửa file `js/book.js` → mảng `this.pages`

### Thay nội dung thư tình
Sửa file `js/love-letter.js` → biến `this.letterContent`

### Thêm nhạc nền
1. Copy file `.mp3` vào thư mục `music/`
2. Đổi tên thành `track1.mp3`, `track2.mp3`, ...
3. Sửa tên hiển thị trong `js/music.js` → mảng `this.playlist`

### Thêm ảnh kỉ niệm
1. Copy ảnh vào thư mục `images/`
2. Sửa `js/book.js` → thuộc tính `image` của mỗi trang, ví dụ: `image: 'images/photo1.jpg'`