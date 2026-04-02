import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Shield, BarChart3, MessageCircle, Users, Eye, CheckCircle, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const features = [
  {
    icon: ShieldCheck,
    title: "Check-in Emocional",
    description: "Alunos registram como se sentem diariamente com emojis simples. Padrões são detectados automaticamente.",
  },
  {
    icon: MessageCircle,
    title: "Chat Seguro da Turma",
    description: "Espaço para se expressar. Palavras-chave de risco são sinalizadas discretamente ao professor.",
  },
  {
    icon: Users,
    title: "Rede de Confidentes",
    description: "Alunos escolhem colegas de confiança. Cria redes de apoio naturais entre os próprios estudantes.",
  },
  {
    icon: BarChart3,
    title: "Radar da Turma",
    description: "Professores visualizam o clima emocional em tempo real. Verde, amarelo, vermelho — sem identificar nomes.",
  },
  {
    icon: Eye,
    title: "Alertas Inteligentes",
    description: "Detecção automática de padrões de bullying, exclusão ou sofrimento. Alertas chegam em tempo real.",
  },
  {
    icon: Shield,
    title: "Privacidade Total",
    description: "Nenhum dado de aluno é vendido. Conformidade com LGPD. Identidades sempre protegidas.",
  },
];

const plans = [
  {
    name: "Plano Escola",
    price: "R$299",
    period: "/mês",
    description: "Para escolas individuais",
    features: ["Até 500 alunos", "Dashboard do professor", "Alertas em tempo real", "Relatórios semanais", "Chat da turma", "Suporte por email"],
    highlighted: false,
  },
  {
    name: "Plano Rede",
    price: "R$799",
    period: "/mês",
    description: "Para redes de ensino",
    features: ["Escolas ilimitadas", "Painel da direção", "Dados agregados por escola", "Relatórios avançados", "API de integração", "Suporte prioritário"],
    highlighted: true,
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-accent rounded-full px-4 py-1.5 mb-6 animate-fade-in">
            <ShieldCheck className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-accent-foreground">Bem-estar escolar inteligente</span>
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Aqui, ninguém fica{" "}
            <span className="text-gradient">de fora.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Identifique alunos em risco de exclusão social, bullying ou sofrimento emocional — 
            de forma discreta e preventiva, antes que o problema se torne grave.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link to="/cadastro">
              <Button variant="hero" size="lg" className="text-base px-8">
                Começar grátis por 30 dias
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <a href="#como-funciona">
              <Button variant="hero-outline" size="lg" className="text-base px-8">
                Como funciona
              </Button>
            </a>
          </div>
          <p className="text-xs text-muted-foreground mt-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            Sem cartão de crédito. Cancele quando quiser.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 gradient-hero">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "98%", label: "dos alertas detectados a tempo" },
              { value: "2.5k+", label: "alunos protegidos" },
              { value: "100%", label: "anônimo e seguro" },
              { value: "LGPD", label: "em conformidade" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl md:text-3xl font-heading font-bold text-primary-foreground">{stat.value}</p>
                <p className="text-sm text-primary-foreground/70 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section id="como-funciona" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Como o Entre Nós funciona
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Uma plataforma completa para cuidar do bem-estar emocional dos alunos, sem expor identidades.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="gradient-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 border border-border hover:-translate-y-1"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="py-20 px-4 bg-accent">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Planos simples e transparentes
            </h2>
            <p className="text-muted-foreground">30 dias grátis. Sem cartão de crédito.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 ${
                  plan.highlighted
                    ? "gradient-hero text-primary-foreground shadow-glow"
                    : "bg-card border border-border shadow-card"
                }`}
              >
                <h3 className="font-heading font-bold text-xl mb-1">{plan.name}</h3>
                <p className={`text-sm mb-4 ${plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-heading font-extrabold">{plan.price}</span>
                  <span className={`text-sm ${plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 ${plan.highlighted ? "text-primary-foreground" : "text-secondary"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/cadastro">
                  <Button
                    variant={plan.highlighted ? "hero-outline" : "hero"}
                    className={`w-full ${plan.highlighted ? "border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" : ""}`}
                  >
                    Começar grátis
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacidade */}
      <section id="privacidade" className="py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <Shield className="w-12 h-12 text-secondary mx-auto mb-6" />
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Privacidade é prioridade
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Nenhuma mensagem é armazenada com nome. Alunos são identificados apenas por ID anônimo. 
            Dados de humor são agregados antes de chegar ao professor. Nenhum dado é vendido ou compartilhado. 
            Em total conformidade com a LGPD.
          </p>
          <Link to="/privacidade">
            <Button variant="outline">Leia nossa política completa</Button>
          </Link>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="gradient-hero py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary-foreground" />
              <span className="font-heading font-bold text-primary-foreground">Entre Nós</span>
            </div>
            <div className="flex gap-6">
              <Link to="/privacidade" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Privacidade
              </Link>
              <Link to="/login" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Entrar
              </Link>
            </div>
            <p className="text-xs text-primary-foreground/50">© 2026 Entre Nós. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
