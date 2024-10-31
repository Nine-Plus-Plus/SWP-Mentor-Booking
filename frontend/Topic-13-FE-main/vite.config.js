import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: '/vite-deploy/'
});

// dùng khi gặp lỗi HMR bị overlay
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     hmr: {
//       overlay: false, // Tắt overlay hiển thị lỗi HMR
//     },
//   },
// });
