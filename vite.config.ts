import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 프로젝트의 절대경로를 설정해주기 위한 resolve 코드
  resolve: {
    alias: [{ find: '@/', replacement: '/src/' }],
  },
});
