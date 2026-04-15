import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, GraduationCap, Building, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type TabId = "aluno" | "professor" | "direcao";

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("aluno");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");

  const roleMap: Record<TabId, string> = {
    aluno: "student",
    professor: "teacher",
    direcao: "admin",
  };

  const redirectMap: Record<TabId, string> = {
    aluno: "/aluno/home",
    professor: "/professor/dashboard",
    direcao: "/direcao/painel",
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Preencha todos os campos");
      return;
    }

    if (isSignUp && !fullName.trim()) {
      setError("Digite seu nome completo");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, role: roleMap[activeTab] },
            emailRedirectTo: window.location.origin,
          },
        });

        if (signUpError) throw signUpError;

        if (data.user && !data.session) {
          toast({
            title: "Verifique seu email",
            description: "Enviamos um link de confirmação para o seu email.",
          });
          setLoading(false);
          return;
        }

        if (data.user) {
          // Assign role
          await supabase.from("user_roles").insert({
            user_id: data.user.id,
            role: roleMap[activeTab] as "admin" | "teacher" | "student",
          });
        }

        setSuccess(true);
        setTimeout(() => navigate(redirectMap[activeTab]), 800);
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        // Get user role and redirect accordingly
        if (data.user) {
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", data.user.id)
            .maybeSingle();

          const roleRedirect: Record<string, string> = {
            student: "/aluno/home",
            teacher: "/professor/dashboard",
            admin: "/direcao/painel",
          };

          setSuccess(true);
          const dest = roleRedirect[roleData?.role ?? ""] || redirectMap[activeTab];
          setTimeout(() => navigate(dest), 800);
        }
      }
    } catch (err: any) {
      const msg = err?.message || "Erro ao autenticar";
      if (msg.includes("Invalid login")) setError("Email ou senha incorretos");
      else if (msg.includes("already registered")) setError("Este email já está cadastrado");
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "aluno" as const, label: "Aluno", icon: Users },
    { id: "professor" as const, label: "Professor", icon: GraduationCap },
    { id: "direcao" as const, label: "Direção", icon: Building },
  ];

  const resetForm = () => {
    setError("");
    setLoading(false);
    setSuccess(false);
    setIsSignUp(false);
    setEmail("");
    setPassword("");
    setFullName("");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Círculos flutuantes de fundo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="float-circle-1 absolute top-[10%] left-[10%] w-64 h-64 rounded-full bg-secondary opacity-[0.06]" />
        <div className="float-circle-2 absolute top-[60%] right-[5%] w-48 h-48 rounded-full bg-primary opacity-[0.08]" />
        <div className="float-circle-3 absolute bottom-[10%] left-[20%] w-32 h-32 rounded-full bg-purple-glow opacity-[0.07]" />
        <div className="float-circle-4 absolute top-[20%] right-[20%] w-56 h-56 rounded-full bg-secondary opacity-[0.05]" />
        <div className="float-circle-5 absolute bottom-[30%] right-[30%] w-40 h-40 rounded-full bg-primary opacity-[0.06]" />
        <div className="float-circle-6 absolute top-[50%] left-[5%] w-24 h-24 rounded-full bg-purple-glow opacity-[0.12]" />
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
      >
        <Link to="/" className="flex items-center justify-center mb-8">
          <Logo variante="clara" largura={200} />
        </Link>
        <p className="text-center text-sm text-muted-foreground -mt-4 mb-6">Aqui, ninguém fica de fora.</p>

        <div className="bg-card rounded-2xl shadow-elevated border border-border p-6">
          {/* Tabs */}
          <div className="flex rounded-xl bg-accent p-1 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); resetForm(); }}
                className={`relative flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="login-tab-bg"
                    className="absolute inset-0 gradient-hero rounded-lg shadow-card"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </span>
              </button>
            ))}
          </div>

          {/* Animação de sucesso */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center py-8"
              >
                <div className="w-16 h-16 rounded-full bg-status-good/10 flex items-center justify-center check-circle">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M8 16 L14 22 L24 10" stroke="hsl(142, 70%, 45%)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="check-mark" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-foreground mt-3">Entrando...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Erro */}
          <AnimatePresence>
            {error && !success && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="bg-destructive/10 text-destructive text-sm rounded-lg p-3 mb-4"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {!success && (
            <motion.div key={`${activeTab}-${isSignUp}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              <form onSubmit={handleAuth} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Nome completo</label>
                    <Input
                      placeholder="Seu nome completo"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-12 micro-input"
                    />
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 micro-input"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Senha</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 micro-input"
                  />
                </div>

                <Button type="submit" variant="hero" className="w-full h-12 text-base btn-shimmer micro-btn" disabled={loading}>
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : isSignUp ? "Criar conta" : "Entrar"}
                </Button>

                <button
                  type="button"
                  onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
                  className="w-full text-center text-sm text-secondary hover:underline"
                >
                  {isSignUp ? "Já tem conta? Entrar" : "Não tem conta? Criar uma"}
                </button>
              </form>
            </motion.div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Ao entrar, você concorda com nossa{" "}
          <Link to="/privacidade" className="text-secondary underline">política de privacidade</Link>.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
