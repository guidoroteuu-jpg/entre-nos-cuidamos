import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CheckCircle, ArrowRight, Copy } from "lucide-react";
import { useState } from "react";

const Welcome = () => {
  const location = useLocation();
  const state = location.state as { escola?: string; codigo?: string } | null;
  const escola = state?.escola || "Sua Escola";
  const codigo = state?.codigo || "TURMA-XXXX";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codigo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg text-center">
        <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-8 h-8 text-primary-foreground" />
        </div>

        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
          Bem-vindo ao Entre Nós!
        </h1>
        <p className="text-muted-foreground mb-8">
          {escola} está pronta para cuidar do bem-estar dos alunos.
        </p>

        {/* Código da turma */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-elevated mb-8">
          <p className="text-sm text-muted-foreground mb-2">Código da sua primeira turma:</p>
          <div className="flex items-center justify-center gap-3">
            <code className="text-2xl font-mono font-bold text-secondary tracking-wider">{codigo}</code>
            <button onClick={handleCopy} className="text-muted-foreground hover:text-foreground transition-colors">
              <Copy className="w-5 h-5" />
            </button>
          </div>
          {copied && <p className="text-xs text-status-good mt-2">Copiado!</p>}
          <p className="text-xs text-muted-foreground mt-3">Compartilhe este código com seus alunos para eles acessarem.</p>
        </div>

        {/* Passo a passo */}
        <div className="space-y-4 text-left mb-8">
          {[
            { step: 1, title: "Configure sua turma", desc: "O código acima já é da sua primeira turma. Crie mais turmas no painel." },
            { step: 2, title: "Compartilhe o código", desc: "Escreva o código no quadro ou envie para os alunos. Eles acessam pelo celular." },
            { step: 3, title: "Alunos acessam pelo celular", desc: "Cada aluno entra com o código e registra como está se sentindo." },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary-foreground">{item.step}</span>
              </div>
              <div>
                <h3 className="font-heading font-bold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <Link to="/professor/dashboard">
          <Button variant="hero" size="lg" className="text-base px-8">
            Acessar o painel <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Welcome;
