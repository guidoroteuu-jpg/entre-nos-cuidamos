import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, AlertTriangle, CalendarDays, Settings, LogOut, ShieldAlert, MailCheck, Stethoscope, BookOpenCheck, Flame, Shield, Accessibility } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";

const navItems = [
  { path: "/direcao/painel", label: "Início", icon: LayoutDashboard },
  { path: "/direcao/turmas", label: "Turmas", icon: Users },
  { path: "/direcao/denuncias", label: "Denúncias", icon: AlertTriangle },
  { path: "/direcao/protocolos", label: "Protocolos", icon: BookOpenCheck },
  { path: "/direcao/mapa-calor", label: "Mapa de calor", icon: Flame },
  { path: "/direcao/familia", label: "Família", icon: MailCheck },
  { path: "/direcao/especialista", label: "Especialista", icon: Stethoscope },
  { path: "/direcao/conselho-tutelar", label: "Conselho", icon: ShieldAlert },
  { path: "/direcao/lgpd", label: "LGPD", icon: Shield },
  { path: "/direcao/ano-letivo", label: "Ano Letivo", icon: CalendarDays },
  { path: "/direcao/acessibilidade", label: "Acessibilidade", icon: Accessibility },
  { path: "/direcao/configuracoes", label: "Configurações", icon: Settings },
];

const DirectionLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex w-64 gradient-hero flex-col p-4 shadow-elevated">
        <div className="mb-2 px-1">
          <Logo variante="escura" largura={140} />
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-primary-foreground/60 mb-8 ml-1">Direção</span>
        <nav className="space-y-1 flex-1 relative">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                aria-current={active ? "page" : undefined}
                className={`relative flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-xl text-sm transition-all group ${
                  active
                    ? "bg-primary-foreground/[0.18] text-primary-foreground font-semibold shadow-sm"
                    : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 font-medium"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="dir-sidebar-bar"
                    className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-primary-foreground"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon className="w-[18px] h-[18px] flex-none transition-transform group-hover:translate-x-0.5" strokeWidth={active ? 2.3 : 1.9} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link to="/login" className="mt-2 flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-xl text-sm text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors micro-btn">
          <LogOut className="w-4 h-4" /> Sair
        </Link>
      </aside>


      {/* Header mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Logo variante="clara" largura={100} />
          <span className="text-xs text-muted-foreground">Direção</span>
        </div>
      </div>

      {/* Conteúdo */}
      <main className="flex-1 overflow-auto px-4 py-6 pt-[4.5rem] pb-24 md:px-8 md:py-8">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mx-auto w-full max-w-6xl"
        >
          {children}
        </motion.div>
      </main>

      {/* Navegação inferior mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border px-2 pt-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] flex justify-around z-40 shadow-elevated">
        {navItems.slice(0, 4).map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              aria-current={active ? "page" : undefined}
              className={`relative flex flex-col items-center justify-center gap-0.5 py-1.5 px-3 min-h-[44px] rounded-xl transition-colors ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="dir-nav-pill"
                  className="absolute inset-0 rounded-xl bg-accent"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <motion.div whileTap={{ scale: 0.85 }} className="relative z-10">
                <item.icon className="w-5 h-5" strokeWidth={active ? 2.4 : 1.9} />
              </motion.div>
              <span className={`relative z-10 text-[10px] ${active ? "font-bold" : "font-medium"}`}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
};

export default DirectionLayout;
