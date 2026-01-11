import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/adapters": path.resolve(__dirname, "./src/adapters"),
      "@/use-cases": path.resolve(__dirname, "./src/use-cases"),
      "@/entities": path.resolve(__dirname, "./src/entities"),
      "@/frameworks": path.resolve(__dirname, "./src/frameworks"),
    },
  },
  test: {
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.test.ts", "src/**/*.spec.ts", "node_modules"],
    },
  },
});
