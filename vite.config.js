import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/blogs": {
        target: "https://api.neurocheckpro.com",
        changeOrigin: true,
        secure: true,
      },
    },
  
    // proxy: {
    //   '/questionnaires': 'https://nest-backend-4z6f.onrender.com',
    // },
  },
});
// 