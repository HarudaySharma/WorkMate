import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    // server: {
    //     proxy: {
    //         // FIX: this is not working
    //         //     '/api/': {
    //         //         target: 'http://localhost:3000',
    //         //         changeOrigin: false,
    //         //         rewrite: (path) => {
    //         //             console.log({path})
    //         //             return path
    //         //         },
    //         //         secure: false,
    //         //         configure: (proxy) => {
    //         //             proxy.on('error', (err ) => {
    //         //                 console.log('proxy error', err);
    //         //             });
    //         //             proxy.on('proxyReq', (_, req) => {
    //         //                 console.log('Sending Request to the Target:', req.method, req.url);
    //         //             });
    //         //             proxy.on('proxyRes', (proxyRes, req) => {
    //         //                 console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
    //         //             });
    //         //         },
    //         //     }
    //     }
    // }
})
