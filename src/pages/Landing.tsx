import { Link } from "@/lib/router-compat";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Shield, BarChart3, MessageCircle, Users, Eye, CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Logo from "@/components/Logo";
import CatBackground from "@/components/CatBackground";
import { ScrollReveal } from "@/components/MotionStagger";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import heroStudents from "@/assets/hero-students.jpg";

const features = [
  { icon: ShieldCheck, title: "landing.feature.checkin.title", description: "landing.feature.checkin.desc" },
  { icon: MessageCircle, title: "landing.feature.chat.title", description: "landing.feature.chat.desc" },
  { icon: Users, title: "landing.feature.network.title", description: "landing.feature.network.desc" },
  { icon: BarChart3, title: "landing.feature.radar.title", description: "landing.feature.radar.desc" },
  { icon: Eye, title: "landing.feature.alerts.title", description: "landing.feature.alerts.desc" },
  { icon: Shield, title: "landing.feature.privacy.title", description: "landing.feature.privacy.desc" },
];

const plans = [
  { name: "landing.schoolPlan", price: "R$299", period: "landing.perMonth", description: "landing.schoolPlanDesc", features: ["landing.plan.school.1", "landing.plan.school.2", "landing.plan.school.3", "landing.plan.school.4", "landing.plan.school.5", "landing.plan.school.6"], highlighted: false },
  { name: "landing.networkPlan", price: "R$799", period: "landing.perMonth", description: "landing.networkPlanDesc", features: ["landing.plan.network.1", "landing.plan.network.2", "landing.plan.network.3", "landing.plan.network.4", "landing.plan.network.5", "landing.plan.network.6"], highlighted: true },
];

const Landing = () => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-transparent relative">
      <CatBackground variant="lively" opacity={0.08} />
      <Navbar />

      {/* Hero — split-screen de vidro */}
      <section className="pt-24 pb-16 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 rounded-[2.5rem] glass-soft border border-white/70 shadow-elevated overflow-hidden">
            {/* Coluna esquerda: conteúdo */}
            <div className="p-8 sm:p-12 lg:p-16 xl:p-20 flex flex-col justify-center gap-8">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-3 self-start rounded-full bg-primary/10 border border-primary/20 px-4 py-2"
              >
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {t("landing.badge")}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 }}
                className="font-heading text-5xl md:text-6xl xl:text-7xl font-extrabold text-foreground leading-[1.05]"
              >
                {t("landing.heroTitleStart")}{" "}
                <span className="text-gradient italic">{t("landing.heroTitleHighlight")}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.16 }}
                className="text-lg md:text-xl text-muted-foreground max-w-md leading-relaxed"
              >
                {t("landing.heroText")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.24 }}
                className="flex flex-wrap gap-4"
              >
                <Link to="/cadastro">
                  <Button variant="hero" size="lg" className="text-base px-8 py-6 rounded-2xl btn-shimmer micro-btn">
                    {t("landing.startTrial")}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <a href="#como-funciona">
                  <Button variant="hero-outline" size="lg" className="text-base px-8 py-6 rounded-2xl micro-btn">
                    {t("nav.howItWorks")}
                  </Button>
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4 pt-4 border-t border-primary/10"
              >
                <div className="flex -space-x-3">
                  <span className="w-9 h-9 rounded-full border-2 border-card bg-secondary" />
                  <span className="w-9 h-9 rounded-full border-2 border-card bg-primary" />
                  <span className="w-9 h-9 rounded-full border-2 border-card bg-accent flex items-center justify-center text-[10px] font-bold text-accent-foreground">
                    +500
                  </span>
                </div>
                <span className="text-sm text-muted-foreground font-medium">{t("landing.noCard")}</span>
              </motion.div>
            </div>

            {/* Coluna direita: imagem em vidro */}
            <div className="relative gradient-hero min-h-[420px] lg:min-h-[560px] flex items-center justify-center p-8 lg:p-14 overflow-hidden">
              <span className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-secondary/40 blur-3xl" aria-hidden="true" />
              <span className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-primary/60 blur-3xl" aria-hidden="true" />

              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="relative w-full rounded-[2rem] border border-white/30 bg-white/10 backdrop-blur-md shadow-elevated overflow-hidden"
              >
                <div className="h-11 flex items-center justify-between px-5 border-b border-white/15 bg-white/10">
                  <div className="flex gap-2" aria-hidden="true">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/30" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/30" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/30" />
                  </div>
                  <span className="w-28 h-1.5 rounded-full bg-white/20" aria-hidden="true" />
                </div>
                <img
                  src={heroStudents}
                  alt="Alunos acolhidos na escola com a mascote Lis, a dálmata roxa"
                  width={1200}
                  height={912}
                  className="w-full h-auto object-cover"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="absolute bottom-6 left-6 lg:bottom-10 lg:left-10 glass-panel rounded-2xl px-4 py-3 shadow-card flex items-center gap-3"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-status-good" aria-hidden="true" />
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  {t("landing.stats.safe")}
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 gradient-hero">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "98%", label: t("landing.stats.alerts") },
              { value: "2.5k+", label: t("landing.stats.students") },
              { value: "100%", label: t("landing.stats.safe") },
              { value: "LGPD", label: t("landing.stats.lgpd") },
            ].map((stat, i) => (
              <ScrollReveal key={stat.label}>
                <p className="text-2xl md:text-3xl font-heading font-bold text-primary-foreground">{stat.value}</p>
                <p className="text-sm text-primary-foreground/70 mt-1">{stat.label}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section id="como-funciona" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <ScrollReveal className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("landing.howTitle")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("landing.howText")}
            </p>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <ScrollReveal key={feature.title}>
                <div className="gradient-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 border border-border micro-card h-full">
                  <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-foreground mb-2">{t(feature.title as TranslationKey)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(feature.description as TranslationKey)}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="py-20 px-4 bg-accent">
        <div className="container mx-auto max-w-4xl">
          <ScrollReveal className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("landing.plansTitle")}
            </h2>
            <p className="text-muted-foreground">{t("landing.plansText")}</p>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-8">
            {plans.map((plan) => (
              <ScrollReveal key={plan.name}>
                <div className={`rounded-2xl p-8 micro-card h-full ${
                  plan.highlighted
                    ? "gradient-hero text-primary-foreground shadow-glow"
                    : "bg-card border border-border shadow-card"
                }`}>
                  <h3 className="font-heading font-bold text-xl mb-1">{t(plan.name as TranslationKey)}</h3>
                  <p className={`text-sm mb-4 ${plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{t(plan.description as TranslationKey)}</p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-heading font-extrabold">{plan.price}</span>
                    <span className={`text-sm ${plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{t(plan.period as TranslationKey)}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle className={`w-4 h-4 flex-shrink-0 ${plan.highlighted ? "text-primary-foreground" : "text-secondary"}`} />
                        {t(f as TranslationKey)}
                      </li>
                    ))}
                  </ul>
                  <Link to="/cadastro">
                    <Button
                      variant={plan.highlighted ? "hero-outline" : "hero"}
                      className={`w-full micro-btn ${plan.highlighted ? "border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" : ""}`}
                    >
                      {t("landing.startFree")}
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Privacidade */}
      <section id="privacidade" className="py-20 px-4">
        <ScrollReveal className="container mx-auto max-w-3xl text-center">
          <Shield className="w-12 h-12 text-secondary mx-auto mb-6" />
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("landing.privacyTitle")}
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            {t("landing.privacyText")}
          </p>
          <Link to="/privacidade">
            <Button variant="outline" className="micro-btn">{t("landing.fullPolicy")}</Button>
          </Link>
        </ScrollReveal>
      </section>

      {/* Rodapé */}
      <footer className="gradient-hero py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Logo variante="escura" largura={130} />
            <div className="flex gap-6">
              <Link to="/privacidade" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("nav.privacy")}</Link>
              <Link to="/login" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("nav.login")}</Link>
              <Link to="/familia/painel" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Família</Link>
            </div>
            <p className="text-xs text-primary-foreground/80">{t("landing.rights")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
