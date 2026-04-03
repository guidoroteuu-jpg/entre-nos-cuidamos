import Logo from "@/components/Logo";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const colors = [
  { name: "Roxo noite", hex: "#26215C", hsl: "hsl(245, 48%, 25%)" },
  { name: "Roxo escuro", hex: "#3C3489", hsl: "hsl(245, 44%, 37%)" },
  { name: "Roxo médio", hex: "#534AB7", hsl: "hsl(245, 40%, 52%)" },
  { name: "Roxo suave", hex: "#7F77DD", hsl: "hsl(245, 50%, 65%)" },
  { name: "Roxo claro", hex: "#EEEDFE", hsl: "hsl(245, 60%, 97%)" },
  { name: "Branco", hex: "#FFFFFF", hsl: "hsl(0, 0%, 100%)" },
];

const Brand = () => (
  <div className="min-h-screen bg-background">
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Link to="/">
        <Button variant="ghost" size="sm" className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
        </Button>
      </Link>

      <motion.h1
        className="font-heading text-3xl font-bold text-foreground mb-2"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Identidade Visual — Entre Nós
      </motion.h1>
      <p className="text-muted-foreground mb-10">Guia de marca e uso correto da logo.</p>

      {/* Variantes da logo */}
      <section className="mb-12">
        <h2 className="font-heading font-bold text-xl text-foreground mb-6">Variantes da Logo</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card rounded-2xl p-8 border border-border shadow-card flex flex-col items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Clara (fundo branco)</p>
            <Logo variante="clara" largura={200} />
          </div>
          <div className="gradient-hero rounded-2xl p-8 flex flex-col items-center gap-4">
            <p className="text-sm font-medium text-primary-foreground/70">Escura (fundo roxo)</p>
            <Logo variante="escura" largura={200} />
          </div>
          <div className="bg-card rounded-2xl p-8 border border-border shadow-card flex flex-col items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Com slogan</p>
            <Logo variante="slogan" largura={220} />
          </div>
          <div className="bg-accent rounded-2xl p-8 flex flex-col items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Ícone (favicon/app)</p>
            <Logo variante="icone" largura={80} />
          </div>
        </div>
      </section>

      {/* Paleta */}
      <section className="mb-12">
        <h2 className="font-heading font-bold text-xl text-foreground mb-6">Paleta de Cores</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {colors.map((c) => (
            <div key={c.hex} className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
              <div className="h-20" style={{ backgroundColor: c.hex }} />
              <div className="p-3">
                <p className="font-medium text-sm text-foreground">{c.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{c.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Uso correto */}
      <section>
        <h2 className="font-heading font-bold text-xl text-foreground mb-6">Uso Correto</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl p-6 border border-border shadow-card">
            <p className="text-sm font-bold text-status-good mb-3">Correto</p>
            <ul className="space-y-2 text-sm text-foreground">
              <li>• Logo clara em fundos brancos ou claros</li>
              <li>• Logo escura em fundos roxos ou escuros</li>
              <li>• Manter proporções originais</li>
              <li>• Espaço mínimo ao redor da logo</li>
            </ul>
          </div>
          <div className="bg-card rounded-xl p-6 border border-border shadow-card">
            <p className="text-sm font-bold text-status-problem mb-3">Incorreto</p>
            <ul className="space-y-2 text-sm text-foreground">
              <li>• Não distorcer ou esticar a logo</li>
              <li>• Não usar cores fora da paleta</li>
              <li>• Não usar logo escura em fundo claro</li>
              <li>• Não adicionar sombras ou efeitos</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </div>
);

export default Brand;
