import { defineConfig } from "vitest/config";

const backendApiTarget =
  process.env.VITE_API_TARGET ?? "http://127.0.0.1:8787";
const shouldStripApiPrefix = backendApiTarget.includes("/flux-training/us-central1");

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "contracts-vendor": ["@flux/contracts"]
        }
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: backendApiTarget,
        changeOrigin: true,
        rewrite: (path) => (shouldStripApiPrefix ? path.replace(/^\/api/, "") : path)
      }
    }
  },
  test: {
    include: ["src/**/*.spec.ts"]
  }
});
