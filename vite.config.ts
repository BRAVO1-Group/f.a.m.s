
import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import inertia from "@inertiajs/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";

export default defineConfig({
  server: {
    host: "127.0.0.1",
    port: 5173,
  },
  plugins: [
    laravel({
      input: ["resources/js/app.tsx"],
      refresh: true,
    }),
    inertia({ssr:false}),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "resources/js"),
    },
  },
});

