import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    server: {
        host: "::",
        port: 8080,
        allowedHosts: true,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        target: "es2015",
        minify: "terser",
        terserOptions: {
            compress: {
                drop_console: mode === "production", // Remove console.logs in production
                drop_debugger: true,
            },
        },
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["react", "react-dom", "react-router-dom"],
                    ui: [
                        "@radix-ui/react-dialog",
                        "@radix-ui/react-dropdown-menu",
                        "@radix-ui/react-select",
                        "@radix-ui/react-tooltip",
                    ],
                    utils: ["fuse.js", "@tanstack/react-query"],
                    animations: ["framer-motion"],
                },
            },
        },
        chunkSizeWarningLimit: 1000,
    },
    optimizeDeps: {
        include: ["react", "react-dom", "react-router-dom", "fuse.js"],
    },
}));
