// client/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import path from "path";

// Make root = this file's folder ("client")
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname),
  build: {
    outDir: "../server/public",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      picocss: path.resolve(__dirname, "../node_modules/@picocss/pico/css"),
    },
  },
  server: {
    port: 5173,

    proxy: {
      "/api": {
        target: "http://localhost:3000",
      },
    },
  },
});
