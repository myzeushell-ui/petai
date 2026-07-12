/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import { fileURLToPath, URL } from "node:url";

// Build a single self-contained index.html (all JS/CSS inlined) for the
// shareable Claude artifact. Not part of the normal build.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  css: { postcss: {} },
  build: {
    outDir: "dist-single",
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000,
    reportCompressedSize: false,
  },
});
