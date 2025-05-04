import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      reporter: ["text", "json", "html"],
    },
    globals: "true",
    environment: "jsdom", // Simulate a browser environment
    setupFiles: "./src/setupTests.js",
  },
})
