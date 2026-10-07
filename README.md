README hướng dẫn cài đặt và chạy chương trình

1. Yêu cầu môi trường

- Node.js phiên bản 22.11.0 trở lên
- npm
- Android Studio đã cài Android SDK
- JDK 17
- Android Emulator hoặc điện thoại Android đã bật USB debugging

Tham khảo hướng dẫn cài đặt môi trường React Native tại:
https://reactnative.dev/docs/set-up-your-environment

2. Tạo project React Native CLI

Tạo một thư mục để chứa project, sau đó mở thư mục đó bằng VS Code. Mở terminal trong VS Code và chạy lệnh sau để khởi tạo ứng dụng `DuBaoThoiTiet`:

```bash
npx @react-native-community/cli@latest init DuBaoThoiTiet
```

Sau khi khởi tạo xong, chuyển vào thư mục ứng dụng:

```bash
cd DuBaoThoiTiet
```

3. Cài đặt thư viện

Trong thư mục `DuBaoThoiTiet`, cài đặt các thư viện của project:

```bash
npm install
```

4. Chạy chương trình trên Android

Trước tiên, khởi động Metro Bundler:

```bash
npm start
```

Để Metro tiếp tục chạy, mở thêm một terminal khác trong thư mục `DuBaoThoiTiet`, rồi chạy ứng dụng:

```bash
npm run android
```

Lệnh này sẽ build và cài ứng dụng lên Android Emulator đang chạy hoặc thiết bị Android đã kết nối. Nếu sử dụng điện thoại thật, hãy bật USB debugging và kiểm tra thiết bị đã được nhận bằng lệnh `adb devices`.

5. Sử dụng ứng dụng

- Xem thời tiết hiện tại, dự báo theo giờ và dự báo nhiều ngày.
- Tìm kiếm thời tiết theo tên thành phố.
- Chạm vào một ngày trong phần dự báo để xem thông tin chi tiết.
- Kéo màn hình xuống để cập nhật dữ liệu thời tiết.

Ứng dụng lấy dữ liệu thời tiết và tìm kiếm địa điểm từ Open-Meteo. API này không yêu cầu API key.

6. Kiểm tra chương trình

Chạy lệnh sau để chạy các bài kiểm tra của project:

```bash
npm test
```

Có thể kiểm tra quy tắc mã nguồn bằng lệnh:

```bash
npm run lint
```

7. Một số lệnh hữu ích

- Khởi động lại Metro và xóa cache:

```bash
npx react-native start --reset-cache
```

- Chạy trực tiếp ứng dụng Android:

```bash
npx react-native run-android
```

8. Cấu trúc chính của mã nguồn

```text
DuBaoThoiTiet/
├── android/                 Cấu hình và mã nguồn Android
├── ios/                     Cấu hình iOS
├── src/
│   ├── components/          Các thành phần giao diện
│   ├── constants/           Cấu hình API và giao diện
│   ├── hooks/                Hook xử lý dữ liệu thời tiết
│   ├── navigation/          Điều hướng giữa các màn hình
│   ├── screens/             Màn hình chính và chi tiết dự báo
│   ├── services/            Gọi API thời tiết
│   ├── types/               Kiểu dữ liệu TypeScript
│   └── utils/               Hàm tiện ích
├── App.tsx
└── package.json
```

9. Xử lý sự cố

- Nếu không thấy thiết bị Android, chạy `adb devices`; kiểm tra cáp USB, quyền gỡ lỗi USB và trạng thái emulator.
- Nếu Metro gặp lỗi cache, dừng Metro bằng `Ctrl + C`, sau đó chạy lại `npx react-native start --reset-cache`.
- Nếu build Android thất bại, kiểm tra phiên bản JDK, Android SDK và biến môi trường `ANDROID_HOME`, rồi thử chạy lại `npm run android`.
- Nếu không tải được dữ liệu thời tiết, kiểm tra kết nối Internet và thử làm mới dữ liệu trong ứng dụng.
