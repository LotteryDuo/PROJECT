import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  build: {
    target: "esnext", // Allows top-level await
    outDir: "dist/server",
    ssr: "src/entry-server.js",
  },
});
