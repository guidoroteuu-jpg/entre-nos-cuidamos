import { useEffect } from "react";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  useRouter,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AccessibilityControls from "@/components/AccessibilityControls";
import { I18nProvider } from "@/lib/i18n";
import { initAccessibility } from "@/lib/accessibility";
import { reportLovableError } from "@/lib/lovable-error-reporting";
import NotFound from "@/pages/NotFound";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { title: "Entre Nós — Aqui, ninguém fica de fora" },
      {
        name: "description",
        content:
          "Identifique alunos em risco de exclusão social, bullying ou sofrimento emocional de forma discreta e preventiva.",
      },
      { name: "author", content: "Entre Nós" },
      { property: "og:title", content: "Entre Nós — Bem-estar escolar inteligente" },
      {
        property: "og:description",
        content: "Aqui, ninguém fica de fora. Plataforma de cuidado emocional para escolas.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a1c2097f-5b82-4589-a37f-d9cd2d7f63b6/id-preview-80524c55--f562642f-7ca1-44b1-87cb-1ceb224dcd85.lovable.app-1775158505315.png",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Entre Nós — Bem-estar escolar inteligente" },
      { name: "twitter:description", content: "Aqui, ninguém fica de fora." },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a1c2097f-5b82-4589-a37f-d9cd2d7f63b6/id-preview-80524c55--f562642f-7ca1-44b1-87cb-1ceb224dcd85.lovable.app-1775158505315.png",
      },
      { name: "theme-color", content: "#3C3489" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon-cat.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/favicon-cat.png" },
      { rel: "manifest", href: "/manifest.json" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: () => <NotFound />,
  errorComponent: RootErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    initAccessibility();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AccessibilityControls />
          <Outlet />
        </TooltipProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}

function RootErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  console.error(error);

  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md text-center">
        <h1 className="mb-2 text-xl font-bold text-foreground">This page didn't load</h1>
        <p className="mb-6 text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Try again
          </button>
          <a
            className="rounded-md border border-border bg-card px-4 py-2 text-foreground"
            href="/"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
