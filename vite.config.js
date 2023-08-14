import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    build: {
        rollupOptions: {
            output: {
                entryFileNames: `js/[name].js`,
                chunkFileNames: `js/[name].js`,
                assetFileNames: `css/[name].[ext]`,
            },
        },
    },
    plugins: [
        laravel({
            input: ["resources/css/app.css", "resources/js/index.jsx"],
            refresh: true,
        }),
        react(),
    ],
});

// no hash names | https://stackoverflow.com/a/75344943
