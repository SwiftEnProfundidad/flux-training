import { defineConfig } from "vitest/config";

const demoApiTarget = process.env.VITE_DEMO_API_TARGET ?? "http://127.0.0.1:8787";

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
        target: demoApiTarget,
        changeOrigin: true
      }
    }
  },
  test: {
    include: ["src/**/*.spec.ts"]
  }
});
