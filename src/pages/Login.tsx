import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Users, GraduationCap, Building, Loader2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type RoleTab = "aluno" | "professor" | "direcao";
type Mode = "login" | "signup";
type SignupStep = "form" | "code";

const roleMap: Record<RoleTab, "admin" | "teacher" | "student"> = {
  aluno: "student",
  professor: "teacher",
  direcao: "admin",
};

const redirectMap: Record<RoleTab, string> = {
  aluno: "/aluno/home",
  professor: "/professor/dashboard",
  direcao: "/direcao/painel",
};

const roleRedirect: Record<string, string> = {
  student: "/aluno/home",
  teacher: "/professor/dashboard",
  admin: "/direcao/painel",
};

const Login = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [activeTab, setActiveTab] = useState<RoleTab>("aluno");

  // shared
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // signup-only
  const [fullName, setFullName] = useState("");
  const [signupStep, setSignupStep] = useState<SignupStep>("form");
  const [code, setCode] = useState("");

  const tabs = [
    { id: "aluno" as const, label: "Aluno", icon: Users },
    { id: "professor" as const, label: "Professor", icon: GraduationCap },
    { id: "direcao" as const, label: "Direção", icon: Building },
  ];

  const finishLogin = async (userId: string) => {
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();
    setSuccess(true);
    const dest = roleRedirect[roleData?.role ?? ""] || redirectMap[activeTab];
    setTimeout(() => navigate(dest), 700);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Preencha email e senha");
      return;
    }
    setLoading(true);
    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) throw err;
      if (data.user) await finishLogin(data.user.id);
    } catch (err: any) {
      const msg = err?.message?.toLowerCase() || "";
      if (msg.includes("invalid login")) setError("Email ou senha incorretos");
      else if (msg.includes("not confirmed")) setError("Confirme seu email antes de entrar");
      else setError(err?.message || "Erro ao entrar");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Preencha email e senha");
      return;
    }
    if (password.length < 6) {
      setError("Senha deve ter ao menos 6 caracteres");
      return;
    }
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: fullName || email.split("@")[0],
            role: roleMap[activeTab],
          },
        },
      });
      if (err) throw err;
      setSignupStep("code");
      toast({
        title: "Código enviado",
        description: "Verifique seu email e digite o código de 6 dígitos.",
      });
    } catch (err: any) {
      const msg = err?.message?.toLowerCase() || "";
      if (msg.includes("already registered") || msg.includes("already exists")) {
        setError("Email já cadastrado. Faça login.");
      } else {
        setError(err?.message || "Erro ao criar conta");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (code.length !== 6) {
      setError("Digite os 6 dígitos do código");
      return;
    }
    setLoading(true);
    try {
      const { data, error: err } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: "signup",
      });
      if (err) throw err;
      if (data.user) await finishLogin(data.user.id);
    } catch (err: any) {
      const msg = err?.message?.toLowerCase() || "";
      if (msg.includes("expired")) setError("Código expirado. Reenvie.");
      else if (msg.includes("invalid") || msg.includes("token")) setError("Código incorreto");
      else setError(err?.message || "Erro ao verificar");
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    setError("");
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.resend({ type: "signup", email });
      if (err) throw err;
      toast({ title: "Código reenviado", description: "Confira seu email." });
    } catch (err: any) {
      setError(err?.message || "Erro ao reenviar");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setError("");
    setSignupStep("form");
    setCode("");
    setSuccess(false);
  };

  const backToForm = () => {
    setSignupStep("form");
    setCode("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
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
          {/* Mode switch: Login / Criar Conta */}
          {signupStep === "form" && (
            <div className="flex rounded-xl bg-accent p-1 mb-5">
              {(["login", "signup"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`relative flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    mode === m ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {mode === m && (
                    <motion.div
                      layoutId="login-mode-bg"
                      className="absolute inset-0 gradient-hero rounded-lg shadow-card"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{m === "login" ? "Entrar" : "Criar conta"}</span>
                </button>
              ))}
            </div>
          )}

          {/* Role tabs (only on signup form) */}
          {mode === "signup" && signupStep === "form" && (
            <div className="flex rounded-xl bg-accent p-1 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setError(""); }}
                  className={`relative flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
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
          )}

          <AnimatePresence>
            {success && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center py-8">
                <div className="w-16 h-16 rounded-full bg-status-good/10 flex items-center justify-center check-circle">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M8 16 L14 22 L24 10" stroke="hsl(142, 70%, 45%)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="check-mark" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-foreground mt-3">Entrando...</p>
              </motion.div>
            )}
          </AnimatePresence>

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

          {/* LOGIN */}
          {!success && mode === "login" && (
            <motion.form key="login" onSubmit={handleLogin} className="space-y-4"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                <Input type="email" placeholder="seu@email.com" value={email}
                  onChange={(e) => setEmail(e.target.value)} className="h-12 micro-input" autoComplete="email" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Senha</label>
                <Input type="password" placeholder="••••••••" value={password}
                  onChange={(e) => setPassword(e.target.value)} className="h-12 micro-input" autoComplete="current-password" />
              </div>
              <Button type="submit" variant="hero" className="w-full h-12 text-base btn-shimmer micro-btn" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar"}
              </Button>
            </motion.form>
          )}

          {/* SIGNUP - form */}
          {!success && mode === "signup" && signupStep === "form" && (
            <motion.form key="signup-form" onSubmit={handleSignup} className="space-y-4"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Nome</label>
                <Input placeholder="Seu nome" value={fullName}
                  onChange={(e) => setFullName(e.target.value)} className="h-12 micro-input" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                <Input type="email" placeholder="seu@email.com" value={email}
                  onChange={(e) => setEmail(e.target.value)} className="h-12 micro-input" autoComplete="email" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Senha</label>
                <Input type="password" placeholder="Mínimo 6 caracteres" value={password}
                  onChange={(e) => setPassword(e.target.value)} className="h-12 micro-input" autoComplete="new-password" />
                <p className="text-xs text-muted-foreground mt-1.5">Enviaremos um código de 6 dígitos para confirmar.</p>
              </div>
              <Button type="submit" variant="hero" className="w-full h-12 text-base btn-shimmer micro-btn" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Criar conta"}
              </Button>
            </motion.form>
          )}

          {/* SIGNUP - code */}
          {!success && mode === "signup" && signupStep === "code" && (
            <motion.div key="signup-code"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              <button type="button" onClick={backToForm}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3 transition">
                <ArrowLeft className="w-4 h-4" /> Voltar
              </button>
              <form onSubmit={handleVerifyCode} className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block text-center">
                    Código enviado para<br /><span className="text-secondary">{email}</span>
                  </label>
                  <div className="flex justify-center mt-3">
                    <InputOTP maxLength={6} value={code} onChange={setCode}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
                <Button type="submit" variant="hero" className="w-full h-12 text-base btn-shimmer micro-btn"
                  disabled={loading || code.length !== 6}>
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirmar e entrar"}
                </Button>
                <button type="button" onClick={resendCode}
                  className="w-full text-center text-sm text-secondary hover:underline" disabled={loading}>
                  Reenviar código
                </button>
              </form>
            </motion.div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Ao continuar, você concorda com nossa{" "}
          <Link to="/privacidade" className="text-secondary underline">política de privacidade</Link>.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
