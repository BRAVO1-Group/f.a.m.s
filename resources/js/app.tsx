import "../css/app.css";
import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import type { ComponentType } from "react";

const pages = import.meta.glob<{ default: ComponentType }>("./pages/**/*.tsx");

createInertiaApp({
  resolve: async (name) => {
    const page = pages[`./pages/${name}.tsx`];

    if (!page) {
      throw new Error(`Page not found: ${name}`);
    }

    const module = await page();
    return module.default;
  },

  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
});
