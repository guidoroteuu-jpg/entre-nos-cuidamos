import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Users, GraduationCap, Building } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"aluno" | "professor" | "direcao">("aluno");
  const [classCode, setClassCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (classCode.trim()) navigate("/aluno/home");
  };

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "professor") navigate("/professor/dashboard");
    else navigate("/direcao/painel");
  };

  const tabs = [
    { id: "aluno" as const, label: "Aluno", icon: Users },
    { id: "professor" as const, label: "Professor", icon: GraduationCap },
    { id: "direcao" as const, label: "Direção", icon: Building },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-2xl text-foreground">Entre Nós</span>
        </Link>

        <div className="bg-card rounded-2xl shadow-elevated border border-border p-6">
          {/* Tabs */}
          <div className="flex rounded-xl bg-accent p-1 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "gradient-hero text-primary-foreground shadow-card"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {activeTab === "aluno" ? (
            <form onSubmit={handleStudentLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Código da turma</label>
                <Input
                  placeholder="Ex: TURMA-5A-2026"
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value)}
                  className="h-12 text-center text-lg font-mono tracking-wider"
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Peça o código ao seu professor. Sua identidade não será revelada.
              </p>
              <Button type="submit" variant="hero" className="w-full h-12 text-base">
                Entrar na turma
              </Button>
            </form>
          ) : (
            <form onSubmit={handleStaffLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Senha</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                />
              </div>
              <Button type="submit" variant="hero" className="w-full h-12 text-base">
                Entrar
              </Button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Ao entrar, você concorda com nossa{" "}
          <Link to="/privacidade" className="text-secondary underline">política de privacidade</Link>.
        </p>
      </div>
    </div>
  );
};

export default Login;
