import path from "node:path";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    resolve: {
      tsconfigPaths: true,
      alias: {
        "@": path.resolve(import.meta.dirname, "resources/js"),
      },
    },
  },
  tanstackStart: {
    // Frontend lives in the Laravel-style resources/js directory.
    srcDirectory: "resources/js",
    // Redirect TanStack Start's bundled server entry to resources/js/server.ts (our SSR error wrapper).
    server: { entry: "server" },
  },
});
