import path from "node:path";
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackStart({
      srcDirectory: "resources/js",
      server: {
        entry: "server",
      },
    }),
    react(),
    tsconfigPaths(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "resources/js"),
    },
  },
});
