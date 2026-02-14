import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    server: {
        host: '127.0.0.1', // Force IPv4 for the dev server
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:5000',
                changeOrigin: true,
                secure: false,
                // Ensure we don't hit IPv6 if the backend is on IPv4
                rewrite: (path) => path.replace(/^\/api/, '/api')
            }
        }
    }
})
