import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  // Next.js components live in .js files; parse every source file as JSX.
  oxc: {
    include: /\.(m?js|jsx)$/,
    exclude: /node_modules/,
    lang: "jsx",
    jsx: { runtime: "automatic" },
  },
  resolve: {
    alias: { "@": path.join(root, "src") },
  },
  test: {
    // API/DB tests run in Node. Component tests opt into the DOM with a
    // `// @vitest-environment jsdom` comment at the top of the file.
    environment: "node",
    include: ["tests/**/*.test.{js,jsx,mjs}"],
    setupFiles: ["tests/setup.js"],
    clearMocks: true,
  },
});
