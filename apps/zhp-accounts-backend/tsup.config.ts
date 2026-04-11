import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/main.ts"],
  outDir: "dist",
  format: ["cjs"],
  platform: "node",
  target: "node24",
  splitting: false,
  sourcemap: false,
  minify: true,
  clean: true,
  dts: false,
  noExternal: [/.*/],
});
