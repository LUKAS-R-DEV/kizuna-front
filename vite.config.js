import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        proxy: {
            "/realms": {
                target: "http://localhost:8081",
                changeOrigin: true,
            },
            "/resources": {
                target: "http://localhost:8081",
                changeOrigin: true,
            },
            "/api-ai": {
                target: "http://localhost:8080",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api-ai/, "/ai"),
            },
            "/api-data": {
                target: "http://localhost:8080",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api-data/, "/data"),
            },
            "/api-core": {
                target: "http://localhost:8080",
                changeOrigin: true,
                ws: true,
                rewrite: (path) => path.replace(/^\/api-core/, "/core"),
            },
            "/api-iam": {
                target: "http://localhost:8080",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api-iam/, "/iam"),
            },
            "/api-audit": {
                target: "http://localhost:8080",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api-audit/, "/audit"),
            },
            "/api-notification": {
                target: "http://localhost:8080",
                changeOrigin: true,
                ws: true,
                rewrite: (path) => path.replace(/^\/api-notification/, "/ntf"),
            }
        }
    }
});
