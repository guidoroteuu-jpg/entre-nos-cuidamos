import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/Logo";

/* A API `supabase.auth.oauth` está em beta e ainda não é tipada. */
type OAuthResult = {
  data?: { client?: { name?: string } | null; redirect_url?: string; redirect_to?: string } | null;
  error?: { message: string } | null;
};
type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<OAuthResult>;
  approveAuthorization: (id: string) => Promise<OAuthResult>;
  denyAuthorization: (id: string) => Promise<OAuthResult>;
};
const oauth = () => (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

export const Route = createFileRoute("/.lovable/oauth/consent")({
  // Somente no navegador: a sessão do Supabase vive no localStorage.
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s['authorization_id'] === "string" ? s['authorization_id'] : "",
  }),
  component: Consent,
  head: () => ({
    meta: [
      { title: "Autorizar aplicativo | Entre Nós" },
      {
        name: "description",
        content: "Autorize um assistente de IA a acessar a plataforma Entre Nós em seu nome.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function Consent() {
  const { authorization_id } = Route.useSearch();
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [clientName, setClientName] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      setSignedIn(false);
      setReady(true);
      return;
    }
    setSignedIn(true);
    const { data, error: detailsError } = await oauth().getAuthorizationDetails(authorization_id);
    if (detailsError) setError(detailsError.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) {
      window.location.href = immediate;
      return;
    }
    setClientName(data?.client?.name ?? null);
    setReady(true);
  };

  if (!ready && authorization_id) void load();

  if (!authorization_id) {
    return (
      <Shell>
        <p className="text-sm text-muted-foreground">Pedido de autorização inválido (sem identificador).</p>
      </Shell>
    );
  }

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    setReady(false);
    void load();
  };

  const decide = async (approve: boolean) => {
    setBusy(true);
    setError(null);
    const { data, error: decisionError } = approve
      ? await oauth().approveAuthorization(authorization_id)
      : await oauth().denyAuthorization(authorization_id);
    if (decisionError) {
      setBusy(false);
      setError(decisionError.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("O servidor de autorização não retornou um endereço de retorno.");
      return;
    }
    window.location.href = target;
  };

  if (!ready) {
    return (
      <Shell>
        <p className="text-sm text-muted-foreground">Carregando pedido de autorização…</p>
      </Shell>
    );
  }

  if (!signedIn) {
    return (
      <Shell>
        <h1 className="font-heading text-xl font-bold text-foreground">Entre para continuar</h1>
        <p className="text-sm text-muted-foreground">
          Faça login com sua conta da escola para autorizar o aplicativo.
        </p>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <form onSubmit={signIn} className="space-y-3">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            aria-label="E-mail"
            required
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            aria-label="Senha"
            required
          />
          <Button type="submit" variant="hero" className="w-full" disabled={busy}>
            Entrar
          </Button>
        </form>
      </Shell>
    );
  }

  return (
    <Shell>
      <h1 className="font-heading text-xl font-bold text-foreground">
        Conectar {clientName ?? "um aplicativo"} à sua conta
      </h1>
      <p className="text-sm text-muted-foreground">
        Isso permite que {clientName ?? "o aplicativo"} use o Entre Nós como você, respeitando exatamente as
        suas permissões.
      </p>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="flex gap-3">
        <Button variant="hero" className="flex-1" disabled={busy} onClick={() => void decide(true)}>
          Autorizar
        </Button>
        <Button variant="outline" className="flex-1" disabled={busy} onClick={() => void decide(false)}>
          Recusar
        </Button>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md surface-card rounded-3xl p-8 space-y-4">
        <Logo largura={140} />
        {children}
      </div>
    </main>
  );
}
