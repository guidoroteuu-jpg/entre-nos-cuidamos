import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, GraduationCap, Building, Heart, Loader2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";
import { useI18n } from "@/lib/i18n";

const Login = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"aluno" | "professor" | "direcao" | "familia">("aluno");
  const [classCode, setClassCode] = useState("");
  const [studentName, setStudentName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [error, setError] = useState("");
  const [isFirstAccess, setIsFirstAccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const existingToken = localStorage.getItem("entre_nos_token");

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!classCode.trim()) { setError(t("login.errorClassCode")); return; }
    if (!existingToken && !isFirstAccess) { setIsFirstAccess(true); return; }
    if (isFirstAccess && !studentName.trim()) { setError(t("login.errorName")); return; }

    setLoading(true);
    setTimeout(() => {
      if (!existingToken) {
        const token = crypto.randomUUID();
        localStorage.setItem("entre_nos_token", token);
        localStorage.setItem("entre_nos_nome", studentName);
      }
      localStorage.setItem("entre_nos_turma", classCode);
      setSuccess(true);
      setTimeout(() => navigate("/aluno/home"), 800);
    }, 600);
  };

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) { setError(t("login.errorFields")); return; }
    if (activeTab === "direcao" && !schoolCode.trim()) { setError(t("login.errorSchoolCode")); return; }

    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("entre_nos_staff_role", activeTab);
      localStorage.setItem("entre_nos_staff_email", email.trim());
      if (activeTab === "direcao") localStorage.setItem("entre_nos_school_code", schoolCode.trim());
      setSuccess(true);
      setTimeout(() => {
        if (activeTab === "professor") navigate("/professor/dashboard");
        else if (activeTab === "familia") navigate("/familia");
        else navigate("/direcao/painel");
      }, 800);
    }, 600);
  };

  const tabs = [
    { id: "aluno" as const, label: t("login.student"), icon: Users },
    { id: "professor" as const, label: t("login.teacher"), icon: GraduationCap },
    { id: "direcao" as const, label: t("login.direction"), icon: Building },
  ];

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
        <p className="text-center text-sm text-muted-foreground -mt-4 mb-6">{t("login.tagline")}</p>

        <div className="bg-card rounded-2xl shadow-elevated border border-border p-6">
          {/* Tabs */}
          <div className="flex rounded-xl bg-accent p-1 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setError(""); setIsFirstAccess(false); setLoading(false); setSuccess(false); }}
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
                <p className="text-sm font-medium text-foreground mt-3">{t("login.entering")}</p>
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
            <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              {activeTab === "aluno" ? (
                <form onSubmit={handleStudentLogin} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">{t("login.classCode")}</label>
                    <Input
                      placeholder={t("login.classCodePlaceholder")}
                      value={classCode}
                      onChange={(e) => setClassCode(e.target.value)}
                      className="h-12 text-center text-lg font-mono tracking-wider micro-input"
                    />
                  </div>
                  <AnimatePresence>
                    {isFirstAccess && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">{t("login.name")}</label>
                        <Input
                          placeholder={t("login.namePlaceholder")}
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          className="h-12 micro-input"
                          autoFocus
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <p className="text-xs text-muted-foreground text-center">
                    {isFirstAccess ? t("login.nameVisible") : t("login.askTeacher")}
                  </p>
                  <Button type="submit" variant="hero" className="w-full h-12 text-base btn-shimmer micro-btn" disabled={loading}>
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : isFirstAccess ? t("login.joinClass") : t("login.continue")}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleStaffLogin} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">{t("login.email")}</label>
                    <Input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 micro-input" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">{t("login.password")}</label>
                    <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 micro-input" />
                  </div>
                  <AnimatePresence>
                    {activeTab === "direcao" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">{t("login.schoolCode")}</label>
                        <Input placeholder={t("login.schoolCodePlaceholder")} value={schoolCode} onChange={(e) => setSchoolCode(e.target.value)} className="h-12 micro-input" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <Button type="submit" variant="hero" className="w-full h-12 text-base btn-shimmer micro-btn" disabled={loading}>
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t("nav.login")}
                  </Button>
                </form>
              )}
            </motion.div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          {t("login.privacyPrefix")} {" "}
          <Link to="/privacidade" className="text-secondary underline">{t("login.privacyLink")}</Link>.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
