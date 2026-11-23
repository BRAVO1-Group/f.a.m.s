import "../css/app.css";
import { AppUserProvider } from "@/lib/app-user";

import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import type { ComponentType } from "react";

import { AppShell } from "@/layouts/app-layout";
import type { AppRole } from "@/lib/auth";

type AuthUser = {
  id: number;
  name: string;
  email: string;
  roles: {
    id: number;
    name: string;
    slug: AppRole;
    permissions: string[];
  }[];
  permissions: string[];
};

type PageProps = {
  auth: {
    user: AuthUser | null;
  };
};

const pages = import.meta.glob<{ default: ComponentType }>("./pages/**/*.tsx");

createInertiaApp({
  resolve: async (name) => {
    const page = pages[`./pages/${name}.tsx`];

    if (!page) {
      throw new Error(`Page not found: ${name}`);
    }

    const module = await page();
    const Page = module.default;

    const isPublicPage =
      name === "welcome" ||
      name === "auth/login" ||
      name === "walkthrough" ||
      name === "auth/mentor-onboard";

    if (isPublicPage) {
      return Page;
    }

    const AuthenticatedPage = Object.assign(
      (pageProps: PageProps) => {
        const user = pageProps.auth?.user;

        if (!user) {
          return <Page {...(pageProps as any)} />;
        }

        const roles = user.roles.map((role) => role.slug);

        const rolePriority: AppRole[] = [
          "system_admin",
          "uni_admin",
          "org_admin",
          "supervisor",
          "student",
        ];

        const primaryRole = rolePriority.find((item) => roles.includes(item)) ?? "student";

        return (
          <AppUserProvider
            value={{
              userId: String(user.id),
              email: user.email,
              name: user.name,
              role: primaryRole,
              roles,
            }}
          >
            <AppShell
              userId={String(user.id)}
              role={primaryRole}
              roles={roles}
              name={user.name}
              email={user.email}
            >
              <Page {...(pageProps as any)} />
            </AppShell>
          </AppUserProvider>
        );
      },
      { displayName: `${name}WithAppShell` },
    );

    return AuthenticatedPage;
  },

  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
});
