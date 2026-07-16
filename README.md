# Vietnam Checklist

Ứng dụng web đánh dấu và theo dõi các tỉnh thành (63 tỉnh cũ) của Việt Nam mà bạn đã từng đặt chân đến, hiển thị trực tiếp trên bản đồ SVG.

## Tính năng

- Click vào từng tỉnh trên bản đồ để đánh dấu đã đến / bỏ đánh dấu
- Hiển thị số tỉnh đã khám phá và phần trăm hoàn thành trên tổng 63 tỉnh
- Tùy chỉnh màu nền và màu nhấn (accent) cho giao diện
- Xuất bản đồ đã đánh dấu ra file ảnh PNG kèm thống kê
- Xóa toàn bộ dữ liệu đã đánh dấu
- Dữ liệu lưu trực tiếp trên trình duyệt (localStorage), không cần đăng nhập hay máy chủ

## Công nghệ sử dụng

- Vue 3 + TypeScript
- Vite
- Tailwind CSS
- VueUse (lưu trạng thái vào localStorage)
- Iconify

## Cài đặt và chạy thử

```bash
npm install
npm run dev
```

## Build production

```bash
npm run build
```

Dự án được cấu hình sẵn GitHub Actions để tự động build và deploy lên GitHub Pages khi push vào nhánh `main`.

## Credits

Dự án được phát triển dựa trên ý tưởng gốc của [Lê Chiến](https://github.com/lechiennn),
thực hiện trong chương trình [vibe.j2team.org](https://vibe.j2team.org).
Bản này được build lại, bổ sung tính năng và tối ưu thêm.

## License

MIT
